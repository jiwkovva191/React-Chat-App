import { useState, useEffect } from "react";
import {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID , Query} from "appwrite";
import {Trash} from 'react-feather';

export default function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  useEffect(() => {
    getMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevents default form(e) action /refreshing the form/
    let payload = {
      body: messageBody,
    };
    let response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload
    );
    console.log("Created", response);
    setMessages(prevState=>[response, ...messages]) //here we spread (copy the whole messages arr) out the previous array
    setMessageBody(""); //we want to reset the form
  };
  const getMessages = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [
        Query.orderDesc('$createdAt'), //orders the text messages - newest first
        Query.limit(20) //sets the limit of messages you will see
      ]
    );
    console.log("RESPONSE:", response);
    setMessages(response.documents);
  };

  const deleteMessage = async(message_id)=>{
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id)
    setMessages(prevState => messages.filter(message => message.$id !== message_id)) //filters the massages which id is not equal to the deleted message id
    console.log('Deleted')
  }
  return (
    <main>
      <div>
        <form onSubmit={handleSubmit} action="">
          <div>
            <textarea
              required
              maxLength={2000}
              placeholder="Say something... "
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>
          <div>
            <input type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((message) => (
            <div key={message.$id}>
              <div>
                <p>{new Date(message.$createdAt).toLocaleString()}</p>
                <Trash onClick={()=>{deleteMessage(message.$id)}}/>
                
              </div>
              <div>
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
