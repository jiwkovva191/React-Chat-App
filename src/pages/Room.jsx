import { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

export default function Room() {
  const { user } = useAuth();
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
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    let permissions = [
      Permission.write(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)), //allow user to delete their own messages
    ];
    let response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
    );
    console.log("Created", response.$permissions);

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
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        message_id
      );

      console.log("Deleted");
    } catch (err) {
      console.error("Failed to delete the message", err);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2e2e2ed6]">
      <div className=" bg-[#2E2E2E] p-[30px] my-[20px] rounded-2xl">
        <Header />
        <div className="flex flex-col gap-[20px]">
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
                className="bg-white rounded-2xl p-[10px] w-[400px]"
              ></textarea>
            </div>
            <div>
              <input
                className="bg-[#10B981] px-[10px] py-[5px] rounded-md font-bold text-white"
                type="submit"
                value="Send"
              />
            </div>
          </form>
          <div className="flex flex-col gap-[30px] h-[400px] overflow-y-auto">
            {messages.map((message) => {
              console.log("Message permissions:", message.$permissions);
              return (
                <div key={message.$id} className="flex flex-col gap-[10px]">
                  <div className="flex flex-row">
                    <p className="flex flex-col text-white text-[15px] font-light">
                      {message?.username ? (
                        <span>{message.username}</span>
                      ) : (
                        <span>Anonymous user</span>
                      )}
                      <small>
                        {new Date(message.$createdAt).toLocaleString()}
                      </small>
                    </p>

                    {message.$permissions.includes(
                      `delete("user:${user.$id}")`
                    ) && (
                      <Trash
                        onClick={() => {
                          deleteMessage(message.$id);
                        }}
                        className="text-white"
                      />
                    )}
                  </div>
                  <div>
                    <span className="bg-[#6EE7B7] py-[5px] px-[12px] rounded-xl text-[18px]">
                      {message.body}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
