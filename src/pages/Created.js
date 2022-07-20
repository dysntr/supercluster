import React, {useState} from "react";
import styled from "styled-components";
import { getTodayDate, colorLog } from "../utils/Misc";

const CreatedDiv = styled.div`
  color: white;
  width: 100%;
  min-height: 20vh;
  display: flex;
  justify-content: center;
`;

export default function Created(props) {
  const [recipient, setRecipient] = useState("");
  const [cid, setCid] = useState("");
  const [subject, setSubject] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("secret");
  const [command, setCommand] = useState("");

  let currentXMTP = props.currentXMTP;

  const resetState = () => {
    setCid("");
    setSubject("");
    setEncryptionKey("secret");
    setCommand("");
  }

  const sendMessage = async (message) => {
    try {
      if (Object.keys(currentXMTP).length !== 0) {
        console.log(currentXMTP);
        colorLog(1, "Entering sendMessage");
        // const conversation = await currentXMTP.conversations.newConversation(recipient);
        const conversation = await currentXMTP.conversations.newConversation(
          "0xd69DFe5AE027B4912E384B821afeB946592fb648"
        );
        await conversation.send(message);

        colorLog(2, "Sending message to user", message);
      } else {
        console.error("Current XMTP is not available in Created component")
      }
      colorLog(1, "Exiting sendMessage");
    } catch (error) {
      console.log(error);
    }
  };

  const submitMessage = async () => {

    let messageObject = {
      command: command,
      cid: cid,
      subject: subject,
      createdDate: getTodayDate(),
      encryptionKey: {},
    }

    try {
      await sendMessage(messageObject);
    } catch(e) {
      console.error("Error sending message:", e)
    }

    resetState();
    console.log(messageObject);
  }

  return (
    <>
      <input placeholder="Please enter your recipient address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <input placeholder="Please enter your CID" value={cid} onChange={(e) => setCid(e.target.value)} />
      <input placeholder="Please enter a subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <input placeholder="Please enter pin or unpin command" value={command} onChange={(e) => setCommand(e.target.value)} />
      <input placeholder="Please enter an encryption key" value={encryptionKey} onChange={(e) => setEncryptionKey(e.target.value)} />
      <button onClick={() => submitMessage()}>Submit</button>
    </>
  );
}
