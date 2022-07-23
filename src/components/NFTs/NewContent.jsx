import React, { useRef, useState } from "react";
import styled from "styled-components";
import { colorLog, getTodayDate } from "../../utils/Misc";
import XMTPManager from "../../utils/Xmtp";
import { getNFTOwners } from "../../utils/NFT";
import { useMoralisWeb3Api } from "react-moralis";
import SectionLoading from "../SectionLoading";

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

const NewContent = (props) => {
  // Initialize Moralis API
  let web3Api = useMoralisWeb3Api();
  let contractAddress = props.contractAddress;

  const [cid, setCID] = useState("");
  const [subject, setSubject] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("secret");
  const [ipfsCommand, setIPFSCommand] = useState("");
  const [loading, setLoading] = useState(false);

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
    setCID("");
    setSubject("");
    setEncryptionKey("secret");
    setIPFSCommand("");
  };

  //Send a message to all NFT holders
  const submitMessage = async () => {
    setLoading(true);

    // Get all owners of the NFT contract
    let nftOwners = await getNFTOwners(web3Api, contractAddress);
    // let nftOwners = ["0x5a7a9517f118dccefafcb6af99add30b904ce9cb"];
    let messageObject = {};
    messageObject["command"] = ipfsCommand;
    messageObject["cid"] = cid;
    messageObject["subject"] = subject;
    messageObject["createdDate"] = getTodayDate();
    messageObject["encryptionKey"] = encryptionKey;

    try {
      for (const nftOwner of nftOwners) {
        colorLog(2, "Sending message to user", JSON.stringify(messageObject));
        await XMTPManager.sendMessage(nftOwner, JSON.stringify(messageObject));
      }
    } catch (e) {
      console.error("Error sending message:", e);
    }

    setLoading(false);
    //inputRef.current.value = "";
    //resetState();
    //console.log(messageObject);
  };

  if (loading) {
    return <SectionLoading />;
  }

  return (
    <NewContentForm>
      <h3>Send New Content to Pin</h3>
      <ContentRow>
        <ContentInput
          placeholder="Enter Subject"
          // ref={inputRef}
          onChange={handleSubject}
        />
        <ContentInput
          placeholder="Enter CID"
          // ref={inputRef}
          onChange={handleCID}
        />
      </ContentRow>
      <ContentRow>
        <ContentInput
          placeholder="Enter Encryption key"
          // ref={inputRef}
          onChange={handleEncryptionKey}
        />
        <ContentInput
          placeholder="Enter Pin or Unpin"
          // ref={inputRef}
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
