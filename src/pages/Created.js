import React, {useEffect, useState} from "react";
import styled from "styled-components";

// Utils
import XMTPManager from "../utils/Xmtp.js"
import { getTodayDate, colorLog } from "../utils/Misc";
import { getCreatedNFTs } from "../utils/NFT";


const CreatedDiv = styled.div`
  color: white;
  width: 100%;
  min-height: 20vh;
  display: flex;
  justify-content: center;
`;

export default function Created(props) {
  const [nfts, setNfts] = useState([]); 
  const [recipient, setRecipient] = useState("");
  const [cid, setCid] = useState("");
  const [subject, setSubject] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("secret");
  const [command, setCommand] = useState("");

  let walletAddress = props.walletAddress;
  let web3Api = props.web3Api;

  useEffect(() => {
    setNfts(getCreatedNFTs(web3Api, walletAddress));
  }, [web3Api, walletAddress])

  const resetState = () => {
    setCid("");
    setSubject("");
    setEncryptionKey("secret");
    setCommand("");
  };

  const submitMessage = async () => {
    let messageObject = {
      command: command,
      cid: cid,
      subject: subject,
      createdDate: getTodayDate(),
      encryptionKey: encryptionKey,
    };

    try {
      colorLog(2, "Sending message to user", JSON.stringify(messageObject));
      await XMTPManager.sendMessage("0xE4475EF8717d14Bef6dCBAd55E41dE64a0cc8510", JSON.stringify(messageObject));
    } catch (e) {
      console.error("Error sending message:", e);
    }

    resetState();
    //console.log(messageObject);
  };

  return (
    <>
      <input
        placeholder="Please enter your recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        placeholder="Please enter your CID"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
      />
      <input
        placeholder="Please enter a subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <input
        placeholder="Please enter pin or unpin command"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />
      <input
        placeholder="Please enter an encryption key"
        value={encryptionKey}
        onChange={(e) => setEncryptionKey(e.target.value)}
      />
      <button onClick={() => submitMessage()}>Submit</button>
    </>
  );
}
