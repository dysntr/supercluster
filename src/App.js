import "./App.css";
import React, { useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import createMetaMaskProvider from "metamask-extension-provider";
import styled from "styled-components";
import { useMoralisWeb3Api } from "react-moralis";

// Utils
import getNFTOwners from "./utils/NFT";
import { fillNftArrayWithTestData, getTodayDate, colorLog } from "./utils/Misc";

// Navigation Imports
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./pages/Home";
import Created from "./pages/Created";
import Navigation from "./components/Navigation";
import AllData from "./pages/AllData";
import ConnectWallet from "./pages/ConnectWallet";
import NFTDetail from "./components/followedNFTs/NFTDetail";
import { tab } from "@testing-library/user-event/dist/tab";

// Styled Components
export const MainContainer = styled.div`
  background-color: #262833;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  font-family: "Inter", sans-serif;
  background-color: #262833;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const getProvider = () => {
  if (window.ethereum) {
    console.log("found window.ethereum>>");
    return window.ethereum;
  } else {
    const provider = createMetaMaskProvider();
    return provider;
  }
};

const App = () => {
  // Moralis Web3Api Instantiation
  const Web3Api = useMoralisWeb3Api();

  // Wallet Setup
  const POLLTIME_MS = 30000;

  const [currentAccount, setCurrentAccount] = useState("");
  const [contractAddress, setContractAddress] = useState(
    "0x57E7546d4AdD5758a61C01b84f0858FA0752e940"
  );
  const [currentXMTP, setCurrentXMTP] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [NFTsArray, setNFTsArray] = useState([]);
  const [processingObject, setProcessingObject] = useState([
    {
      TrustedAddressToContractAddress: {},
      ContractAddressToNFTArrayIndex: {},
      CIDtoContractAddress: {},
      CIDtoPinDataArrayIndex: {},
      isMessageProcessed: {},
    },
  ]);

  let web3Provider;
  let wallet;

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      colorLog(1, "Entering connectWallet");
      web3Provider = new ethers.providers.Web3Provider(getProvider());
      const accounts = await web3Provider.provider.request({
        method: "eth_requestAccounts",
      });

      colorLog(2, "Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      colorLog(3, "Calling checkIfXMTPConnected()");
      checkIfXMTPConnected(accounts[0]);

      colorLog(1, "Exiting connectWallet");
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfXMTPConnected = async (account) => {
    try {
      colorLog(1, "Entering checkIfXMTPConnected");
      if (currentXMTP.length !== 0) {
        console.log("XMTP setup already!", currentXMTP);
        return;
      } else {
        if (account) {
          console.log(
            "checkIfXMTPConnected() - Calling connectXMTP() (account): ",
            account
          );
          colorLog(3, "Calling connectXMTP()");
          connectXMTP();
        } else {
          console.log("Ethereum wallet needs to be configured");
          return;
        }
      }
      colorLog(1, "Exiting checkIfXMTPConnected");
    } catch (error) {
      console.log(error);
    }
  };

  const connectXMTP = async () => {
    colorLog(1, "Entering connectXMTP");
    web3Provider = new ethers.providers.Web3Provider(getProvider());
    wallet = web3Provider.getSigner();
    // Create the client with your wallet. This will connect to the XMTP development network by default
    const xmtp = await Client.create(wallet);
    setCurrentXMTP(xmtp);

    colorLog(1, "Exiting connectXMTP");
  };

  const getNFTMetaData = async () => {
    colorLog(1, "Entering getNFTMetaData");

    colorLog(3, "Entering getNFTOwners()", currentAccount);
    let receivedNFTs = await getNFTOwners(
      Web3Api,
      currentAccount,
      contractAddress
    );
    if (receivedNFTs == null) {
      console.log("The connected account does not have any valid NFTs");

      colorLog(3, "Calling fillNftArrayWithTestData()");

      let _NFTsArray,
        _TrustedAddressToContractAddress,
        _ContractAddressToNFTArrayIndex;

      let results = fillNftArrayWithTestData();
      _NFTsArray = results.NFTsArray;
      _TrustedAddressToContractAddress =
        results.TrustedAddressToContractAddress;
      _ContractAddressToNFTArrayIndex = results.ContractAddressToNFTArrayIndex;

      console.log("****NFTsArray ", _NFTsArray);
      console.log(
        "****processingObject ",
        _TrustedAddressToContractAddress,
        _ContractAddressToNFTArrayIndex
      );

      setNFTsArray(_NFTsArray);
      setProcessingObject((prevState) => ({
        ...prevState,
        TrustedAddressToContractAddress: _TrustedAddressToContractAddress,
        ContractAddressToNFTArrayIndex: _ContractAddressToNFTArrayIndex,
      }));
    } else {
      if (receivedNFTs.trustedAddr !== null) {
        colorLog(3, "Calling processNFTMetadata()");
        processNFTMetadata([receivedNFTs]);
      } else {
        console.log("Error - NFT does not have a trusted broadcast address.");
      }
    }
    colorLog(1, "Exiting getNFTMetaData");
  };

  const processNFTMetadata = async (NFTMetadata) => {
    colorLog(1, "Entering processNFTMetadata");
    let x = 0;
    let _ContractAddressToNFTArrayIndex = {};
    let _TrustedAddressToContractAddress = {};
    let _NFTsArray = {};
    for (const NFT of NFTMetadata) {
      let NftContractAddr = NFT.contractAddr;
      let NftTrustedAddr = NFT.trustedAddr;
      _NFTsArray[x] = NFT;
      _ContractAddressToNFTArrayIndex[NftContractAddr] = x;
      _TrustedAddressToContractAddress[NftTrustedAddr] = NftContractAddr;
      x++;
    }

    setNFTsArray(_NFTsArray);
    setProcessingObject((prevState) => ({
      ...prevState,
      TrustedAddressToContractAddress: _TrustedAddressToContractAddress,
      ContractAddressToNFTArrayIndex: _ContractAddressToNFTArrayIndex,
    }));
    console.log("_NFTsArray", _NFTsArray);
    console.log(
      "_TrustedAddressToContractAddress",
      _TrustedAddressToContractAddress
    );
    console.log(
      "_ContractAddressToNFTArrayIndex",
      _ContractAddressToNFTArrayIndex
    );

    colorLog(1, "Exiting processNFTMetadata");
  };

  //if a new NFT is added or XMTP connection established, then get messages.
  useEffect(() => {
    if (
      currentXMTP.length != 0 &&
      processingObject.TrustedAddressToContractAddress.length != 0
    ) {
      console.log("New processingObject or currentXMTP detected.");
      colorLog(3, "Calling getMessages()");
      getMessages();
    }
  }, [processingObject.TrustedAddressToContractAddress, currentXMTP]);

  //if currentAccount is updated, getNFTMetaData for new account
  useEffect(() => {
    if (currentAccount.length != 0) {
      console.log("New Account Detected:", currentAccount);
      colorLog(3, "Calling getNFTMetaData()");
      getNFTMetaData();
    }
  }, [currentAccount]);

  const getMessages = async () => {
    colorLog(1, "Entering getMessages");

    console.log(
      " xmtp.conversations.list()",
      await currentXMTP.conversations.list()
    );
    let allMessages = [];

    let _TrustedAddressToContractAddress =
      processingObject.TrustedAddressToContractAddress;

    console.log(
      "_TrustedAddressToContractAddress",
      _TrustedAddressToContractAddress
    );

    const opts = {
      // Only show messages from 7 day(s)
      startTime: new Date(new Date().setDate(new Date().getDate() - 7)),
      endTime: new Date(),
    };

    for (const conversation of await currentXMTP.conversations.list()) {
      const messagesInConversation = await conversation.messages(opts);

      for await (const message of messagesInConversation) {
        //TODO: sanitize all message.content prior to printing out or processing.

        console.log(
          `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
          //if message is from a trusted senderAddress with matching in message content process messages.
        );

        //check to see if message is from trusted broadcast address
        if (message.senderAddress in _TrustedAddressToContractAddress) {
          console.log("Message added from tba.", message.senderAddress);
          allMessages.push(message);
        }
      }
    }

    const messagesCleaned = allMessages.map((message) => {
      return {
        senderAddress: message.senderAddress,
        id: message.id,
        content: message.content,
      };
    });
    console.log("Cleaned messages:", messagesCleaned);

    // Remove set all messages at this point
    setAllMessages(messagesCleaned);

    colorLog(3, "Calling processMessages()");
    processMessages(allMessages);

    console.log("NFTsArray", NFTsArray);

    colorLog(1, "Exiting getMessages");
  };

  const processMessages = async (_allMessages) => {
    //TODO: sanitize all message.content prior to printing out or processing.
    //get command
    //get cid
    //get message
    //format {command:"","cid":"","subject":""}

    if (!processingObject.hasOwnProperty("isMessageProcessed")) {
      processingObject.isMessageProcessed = {};
    }

    let _isMessageProcessed = processingObject.isMessageProcessed;

    console.log(_isMessageProcessed);
    colorLog(1, "Entering processMessages");

    for (const message of _allMessages) {
      if (
        typeof _isMessageProcessed !== "undefined" &&
        message.id in _isMessageProcessed
      ) {
        return;
      }

      colorLog(
        2,
        "Processing message from Trusted Broadcast Address(message.id):",
        message.id
      );

      //todo: json needs to be set to message.content
      let json =
        '{"command":"pin","cid":"ipfs://bafybeigpwzgifof6qbblw67wplb7xtjloeuozaz7wamkfjvnztrjjwvk7e","subject":"test subject","encryptionKey":"testEncryptionKey"}';

      // production - content will be sent in above format
      // let json = message.content;

      let myRegexp, match, command, cid, subject, secretKey;
      myRegexp = /^\{"command":"(\w+)"/i;
      match = myRegexp.exec(json);
      //there was a match
      if (match !== null) {
        command = match[1];
        console.log("match(command):", command);
      } else {
        console.log(
          "No command match in message from Trusted Broadcast Address. skipping message.(message.id): ",
          message.id
        );

        colorLog(1, "Exiting processMessages");
        _isMessageProcessed[message.id] = true;

        continue;
      }

      //ipfs://bafybeigpwzgifof6qbblw67wplb7xtjloeuozaz7wamkfjvnztrjjwvk7e
      myRegexp = /"cid"\:"(ipfs:\/\/\w+)"/i;
      match = myRegexp.exec(json);
      //there was a match
      if (match !== null) {
        cid = match[1];
        console.log("match(IPFS LINK):", cid);
      } else {
        console.log("No CID match in message from Trusted Broadcast Address.");
      }

      myRegexp = /"subject":"([\s \w]+)"/i;
      match = myRegexp.exec(json);
      //there was a match
      if (match !== null) {
        subject = match[1];
        console.log("match(subject):", subject);
      } else {
        console.log(
          "No subject match in message from Trusted Broadcast Address."
        );
      }

      myRegexp = /"encryptionKey":"(\w+)"/i;
      match = myRegexp.exec(json);
      //there was a match
      if (match !== null) {
        secretKey = match[1];
        console.log("match(encryptionKey):", secretKey);
      } else {
        console.log(
          "No encryptionKey match in message from Trusted Broadcast Address."
        );
      }

      //TODO: Need to deal with the case where 2NFTs have same TBA

      switch (command) {
        case "pin":
          colorLog(3, "Calling pinItem()", cid, subject, message.senderAddress);
          pinItem(cid, subject, message.senderAddress);
          pinItem("testcid2", "testsubject2", message.senderAddress);
          unpinItem(cid, message.senderAddress);
          break;

        case "unpin":
          colorLog(3, "Calling unpinItem()", cid, message.senderAddress);
          unpinItem(cid, message.senderAddress);
          break;

        default:
          //default
          break;
      }

      //if processed
      _isMessageProcessed[message.id] = true;
    }

    setProcessingObject((prevState) => ({
      ...prevState,
      isMessageProcessed: _isMessageProcessed,
    }));

    colorLog(1, "Exiting processMessages");
  };

  const pinItem = async (_cid, _subject, _tba) => {
    colorLog(1, "Entering pinItem", _cid, _subject, _tba);

    let _TrustedAddressToContractAddress =
      processingObject.TrustedAddressToContractAddress;
    let _ContractAddressToNFTArrayIndex =
      processingObject.ContractAddressToNFTArrayIndex;

    if (!processingObject.hasOwnProperty("CIDtoContractAddress")) {
      processingObject.CIDtoContractAddress = {};
    }

    if (!processingObject.hasOwnProperty("CIDtoPinDataArrayIndex")) {
      processingObject.CIDtoPinDataArrayIndex = {};
    }

    let _CIDtoPinDataArrayIndex = processingObject.CIDtoPinDataArrayIndex;
    let _CIDtoContractAddress = processingObject.CIDtoContractAddress;

    console.log(
      "processingObject.CIDtoContractAddress",
      processingObject.CIDtoContractAddress
    );
    console.log("_CIDtoContractAddress", _CIDtoContractAddress);

    let _NFTsArray = NFTsArray;

    if (
      typeof _CIDtoPinDataArrayIndex !== "undefined" &&
      _cid in _CIDtoPinDataArrayIndex
    ) {
      //A CID can only be pinned in one collection.
      console.log("_cid was previously pinned.");
      colorLog(1, "Exiting pinItem");
      return;
    }

    //update the mapping objects
    //get contract address
    let contractAddress = _TrustedAddressToContractAddress[_tba];

    //if the NFT has already been added continue, otherwise return.
    if (contractAddress in _ContractAddressToNFTArrayIndex) {
      console.log(
        "Working on adding a new pin for existing nft collection to follower console."
      );

      console.log("_cid", _cid);
      console.log("contractAddress", contractAddress);

      _CIDtoContractAddress[_cid] = contractAddress;

      let NFTIndex = [_ContractAddressToNFTArrayIndex[contractAddress]];

      console.log("NFTIndex", NFTIndex);

      let pinDataIndex;
      if (_cid in _CIDtoPinDataArrayIndex) {
        //pin data already exist, need to update subject

        pinDataIndex = _CIDtoPinDataArrayIndex[_cid];
        console.log(
          "Getting pinDataIndex for updating an element (NFTIndex,pinDataIndex ).",
          NFTIndex,
          pinDataIndex
        );
      } else {
        //add a new element to pinData Array for the nft

        //console.log("NFTsArray during pin add:", NFTsArray[NFTIndex]);
        pinDataIndex = NFTsArray[NFTIndex].pinData.length;
        _CIDtoPinDataArrayIndex[_cid] = pinDataIndex;

        console.log(
          "Getting pinDataIndex for adding a new element (NFTIndex, pinDataIndex):",
          NFTIndex,
          pinDataIndex
        );
      }

      let today = getTodayDate();

      if (_NFTsArray[NFTIndex].pinData[pinDataIndex] == null) {
        console.log("Adding new element to Array...");

        _NFTsArray[NFTIndex].pinData.push({
          subject: _subject,
          CID: _cid,
          date: today,
        });
      } else {
        console.log("Updating existing element in array...");
        _NFTsArray[NFTIndex].pinData[pinDataIndex].subject = _subject;
        _NFTsArray[NFTIndex].pinData[pinDataIndex].CID = _cid;
        _NFTsArray[NFTIndex].pinData[pinDataIndex].date = today;
      }

      setProcessingObject((prevState) => ({
        ...prevState,
        CIDtoPinDataArrayIndex: _CIDtoPinDataArrayIndex,
        TrustedAddressToContractAddress: _TrustedAddressToContractAddress,
        ContractAddressToNFTArrayIndex: _ContractAddressToNFTArrayIndex,
        CIDtoContractAddress: _CIDtoContractAddress,
      }));

      setNFTsArray(_NFTsArray);

      //IPFS pin item.
      //TO DO: send pin command to IPFS
      console.log("Pin added", _NFTsArray[NFTIndex]);
      colorLog(1, "Exiting pinItem");
    } else {
      console.log(
        "Error - An Item was not pinned because the NFT is not added."
      );
      return;
    }
  };

  const unpinItem = async (_cid, _tba) => {
    colorLog(1, "Entering unpinItem", _cid, _tba);

    if (!processingObject.hasOwnProperty("CIDtoContractAddress")) {
      processingObject.CIDtoContractAddress = {};
    }

    if (!processingObject.hasOwnProperty("CIDtoPinDataArrayIndex")) {
      processingObject.CIDtoPinDataArrayIndex = {};
    }
    let _CIDtoPinDataArrayIndex = processingObject.CIDtoPinDataArrayIndex;
    let _TrustedAddressToContractAddress =
      processingObject.TrustedAddressToContractAddress;
    let _ContractAddressToNFTArrayIndex =
      processingObject.ContractAddressToNFTArrayIndex;
    let _CIDtoContractAddress = processingObject.CIDtoContractAddress;
    let _NFTsArray = NFTsArray;

    if (_cid in _CIDtoPinDataArrayIndex) {
      console.log("Working on unpinning _cid..");
    } else {
      console.log("_cid not pinned (nothing to unpin)..");
      colorLog(1, "Exiting unpinItem");

      return;
    }

    //update the object mappings

    //get contract address
    let contractAddress = _TrustedAddressToContractAddress[_tba];

    //check to see if the nft contract is in the list, otherwise return.
    if (contractAddress in _ContractAddressToNFTArrayIndex) {
      console.log(
        "Contract found... Unpinning in progress...",
        contractAddress
      );

      let NFTIndex = [_ContractAddressToNFTArrayIndex[contractAddress]];
      console.log("NFTIndex", NFTIndex);

      let pinDataIndex;
      if (_cid in _CIDtoPinDataArrayIndex) {
        console.log("Found _cid element in pinData array.");
        pinDataIndex = _CIDtoPinDataArrayIndex[_cid];
        console.log("pinDataIndex", pinDataIndex);
      } else {
        //add a new element to pinData Array for the nft
        console.log("cid index not found. nothing to unpin.");
        return;
      }

      //the index for the last element in the pinData array
      let pinDataLastIndex = _NFTsArray[NFTIndex].pinData.length - 1;

      if (pinDataIndex == pinDataLastIndex) {
        //if the item we're unpinning is the last element of array
        delete _NFTsArray[NFTIndex].pinData.pop();
      } else {
        //copy the last element of the array to the item that is being unpinned
        //update the CIDtoPinDataArrayIndex
        //delete the last element of the array
        _NFTsArray[NFTIndex].pinData[pinDataIndex] =
          _NFTsArray[NFTIndex].pinData[pinDataLastIndex];

        _CIDtoPinDataArrayIndex[
          [_NFTsArray[NFTIndex].pinData[pinDataIndex].CID]
        ] = pinDataIndex;

        delete _NFTsArray[NFTIndex].pinData.pop();
      }

      //delete cid from mapping objects
      delete _CIDtoContractAddress[_cid];
      delete _CIDtoPinDataArrayIndex[_cid];

      //ipfs unpin item.
      //TO DO: send unpin command to ipfs
      console.log("item unpinned", _NFTsArray[NFTIndex]);

      setProcessingObject((prevState) => ({
        ...prevState,
        CIDtoPinDataArrayIndex: _CIDtoPinDataArrayIndex,
        TrustedAddressToContractAddress: _TrustedAddressToContractAddress,
        ContractAddressToNFTArrayIndex: _ContractAddressToNFTArrayIndex,
        CIDtoContractAddress: _CIDtoContractAddress,
      }));

      setNFTsArray(_NFTsArray);

      colorLog(1, "Exiting unpinItem");
    } else {
      console.log("Error - unpin error, no such contract found.");
      console.log("Exiting unpinItem");
      return;
    }
  };

  const sendMessage = async () => {
    try {
      if (currentXMTP) {
        colorLog(1, "Entering sendMessage");
        const conversation = await currentXMTP.conversations.newConversation(
          "0xd69DFe5AE027B4912E384B821afeB946592fb648"
        );
        const now = new Date();
        await conversation.send(now);

        colorLog(2, "Sending message to user", now);
      }
      colorLog(1, "Exiting sendMessage");
    } catch (error) {
      console.log(error);
    }
  };

  // const poll = () => {
  //   const interval = setInterval(() => {
  //     if (currentXMTP.length !== 0) {
  //       getMessages(currentXMTP);
  //     }
  //     console.log("Poll every ", POLLTIME_MS / 60000, " minute(s).");
  //   }, POLLTIME_MS);

  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // };
  // poll();

  if (!currentAccount) {
    return (
      <MainContainer>
        <ConnectWallet connectWallet={connectWallet} />
      </MainContainer>
    );
  } else {
    return (
      <MainContainer>
        <Navigation walletAddress={currentAccount} />
        <Routes>
          <Route
            path="/"
            index
            element={<Home userNFTs={NFTsArray} allMessages={allMessages} />}
          />
          <Route path="/created" element={<Created />} />
          <Route path="/data" element={<AllData />} />
          <Route path="/nft/:nftTitle" element={<NFTDetail />} />
        </Routes>
      </MainContainer>
    );
  }
};

export default App;
