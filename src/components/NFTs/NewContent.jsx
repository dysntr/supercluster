import React, { useState } from "react";
import styled from "styled-components";
import { colorLog, getTodayDate } from "../../utils/Misc";
import XMTPManager from "../../utils/Xmtp";

const NewContentForm = styled.div`
  width: 100%;
  border: 1px solid grey;
  border-radius: 2em;
  margin: 0 2em 2em 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentRow = styled.div`
  width: 100%;
  margin: 0 1em 1em 1em;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ContentInput = styled.input`
  padding: 0.5em 1em;
  margin: 0 1em;
  flex-grow: 1;
  background: rgba(217, 217, 217, 0.1);
  color: white;
  border: none;
  border-radius: 0.75em;
`;

const ContentBttn = styled.button`
  width: 75%;
  background-color: #4f87f6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 1em;
  margin-left: 20px;
`;

const NewContent = () => {
  const [recipient, setRecipient] = useState("");
  const [cid, setCID] = useState("");
  const [subject, setSubject] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("secret");
  const [ipfsCommand, setIPFSCommand] = useState("");

  const handleRecipient = (e) => {
    setRecipient(e.target.value);
  };

  const handleCID = (e) => {
    setCID(e.target.value);
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleEncryptionKey = (e) => {
    setEncryptionKey(e.target.value);
  };

  const handleIPFSCommand = (e) => {
    setIPFSCommand(e.target.value);
  };

  const resetState = () => {
    setRecipient("");
    setCID("");
    setSubject("");
    setEncryptionKey("secret");
    setIPFSCommand("");
  };

  const submitMessage = async () => {
    let messageObject = {};
    messageObject["command"] = ipfsCommand;
    messageObject["cid"] = cid;
    messageObject["subject"] = subject;
    messageObject["createdDate"] = getTodayDate();
    messageObject["encryptionKey"] = encryptionKey;

    console.log(colorLog(1, "messg obj", messageObject));

    try {
      colorLog(2, "Sending message to user", JSON.stringify(messageObject));
      await XMTPManager.sendMessage(recipient, JSON.stringify(messageObject));
    } catch (e) {
      console.error("Error sending message:", e);
    }

    resetState();
    //console.log(messageObject);
  };

  return (
    <NewContentForm>
      <h3>Send New Content to Pin</h3>
      <ContentRow>
        <ContentInput
          placeholder="Enter Receiver Address"
          onChange={handleRecipient}
        />
      </ContentRow>
      <ContentRow>
        <ContentInput placeholder="Enter Subject" onChange={handleSubject} />
        <ContentInput placeholder="Enter CID" onChange={handleCID} />
      </ContentRow>
      <ContentRow>
        <ContentInput
          placeholder="Enter Encryption key"
          onChange={handleEncryptionKey}
        />
        <ContentInput
          placeholder="Enter Pin or Unpin"
          onChange={handleIPFSCommand}
        />
      </ContentRow>
      <ContentRow>
        <ContentBttn onClick={submitMessage}>Submit</ContentBttn>
      </ContentRow>
    </NewContentForm>
  );
};

export default NewContent;
