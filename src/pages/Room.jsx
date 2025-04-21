import { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID, Query } from "appwrite";
import { Trash } from "react-feather";
import Header from "../components/Header";

export default function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        //console log depending on the action
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A message was created");
          setMessages((prevMessages) => [response.payload, ...prevMessages]); //here we spread (copy the whole messages arr) out the previous array
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A message was deleted");
          //filters the massages which id is not equal to the deleted message id
          setMessages((prevMessages) =>
            prevMessages.filter(
              (message) => message.$id !== response.payload.$id
            )
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
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

    setMessageBody(""); //we want to reset the form
  };
  const getMessages = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [
        Query.orderDesc("$createdAt"), //orders the text messages - newest first
        Query.limit(20), //sets the limit of messages you will see
      ]
    );
    console.log("RESPONSE:", response);
    setMessages(response.documents);
  };

  const deleteMessage = async (message_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);

    console.log("Deleted");
  };
  return (
    <main>
      <Header />
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
                <Trash
                  onClick={() => {
                    deleteMessage(message.$id);
                  }}
                />
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
