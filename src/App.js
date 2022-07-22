import { create, CID } from "ipfs-http-client";
import "./App.css";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import createMetaMaskProvider from "metamask-extension-provider";
import styled from "styled-components";
import { useMoralisWeb3Api } from "react-moralis";

// Utils
import { getCurrentUserNFTs } from "./utils/NFT";
import XMTPManager from "./utils/Xmtp.js";
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
import DetailSection from "./components/NFTs/DetailSection";
import { tab } from "@testing-library/user-event/dist/tab";
import { AllNFTData } from "./components/NFTs/AllNFTData";

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

  // Green Warrior NFT Contract Address - 0x57E7546d4AdD5758a61C01b84f0858FA0752e940
  // Mandelbrot NFT Contract Address - 0xEE232b653c862A2d94EC66F7f2596307Bc483dBE
  // Galactic NFT Contract Address - 0xc9397648428436C6dd838bDaD2D5f484b80af7dA
  // Recipe guardian Contract Address - 0x8900A5Cc4235392d9981D4C1dD373f13d89962Bb

  const [currentAccount, setCurrentAccount] = useState("");
  const [contractAddresses, setContractAddresses] = useState([
    "0x57E7546d4AdD5758a61C01b84f0858FA0752e940",
    "0xEE232b653c862A2d94EC66F7f2596307Bc483dBE",
    "0xc9397648428436C6dd838bDaD2D5f484b80af7dA",
    "0x8900A5Cc4235392d9981D4C1dD373f13d89962Bb",
  ]);
  const [allMessages, setAllMessages] = useState([]);
  const [NFTsArray, setNFTsArray] = useState([]);

  const [processingObject, setProcessingObject] = useState({
    TrustedAddressToContractAddress: {},
    ContractAddressToNFTArrayIndex: {},
    CIDtoContractAddress: {},
    CIDtoPinDataArrayIndex: {},
    isMessageProcessed: {},
  });

  let web3Provider;
  let wallet;

  const [enableIPFS, setEnableIPFS] = useState(true);
  const [ipfsClient, setIPFSClient] = useState({});

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
      if (!XMTPManager.connected()) connectXMTP();
      connectedIPFS();

      colorLog(1, "Exiting connectWallet");
    } catch (error) {
      console.log(error);
    }
  };

  const connectXMTP = async () => {
    colorLog(1, "Entering connectXMTP");
    web3Provider = new ethers.providers.Web3Provider(getProvider());
    wallet = web3Provider.getSigner();
    // Create the client with your wallet. This will connect to the XMTP development network by default
    await XMTPManager.getInstance(wallet);
    // setCurrentXMTP(xmtp);

    colorLog(1, "Exiting connectXMTP");
  };

  const connectedIPFS = async () => {
    //See https://github.com/ipfs/js-ipfs/tree/master/docs/core-api
    //CORS bypass- need add these or * instead of the individual entries to ipfs config file..
    // "API": {
    //   "HTTPHeaders": {
    //     "Access-Control-Allow-Origin": [
    //       "http://localhost",
    //       "http://localhost:3000",
    //       "http://127.0.0.1"
    //     ]
    //   }
    colorLog(1, "Entering checkIfIPFSConnected");
    if (!enableIPFS) {
      colorLog(1, "Exiting checkIfIPFSConnected");
      return;
    }
    //brave - http://localhost:45005/api/v0
    //const client = create({ url: "http://localhost:45005/api/v0" });

    //normal ipfs - http://localhost:5001/api/v0
    const client = create({ url: "http://localhost:5001/api/v0" });

    setIPFSClient(client);

    colorLog(1, "Exiting checkIfIPFSConnected");
  };

  const pinCID = async (_cid) => {
    colorLog(1, "Entering pinCID()");
    if (!enableIPFS) {
      colorLog(1, "Exiting pinCID()");

      return;
    }

    let cid = await ipfsClient.pin.add(CID.parse(_cid));

    colorLog(1, "Exiting pinCID()");
  };

  const unpinCID = async (_cid) => {
    colorLog(1, "Entering unpinCID()");
    if (!enableIPFS) {
      colorLog(1, "Exiting unpinCID()");
      return;
    }

    let cid = await ipfsClient.pin.rm(_cid);
    console.log(cid._baseCache.get("z"));

    colorLog(1, "Exiting unpinCID()");
  };

  const getNFTMetaData = async () => {
    colorLog(1, "Entering getNFTMetaData");

    colorLog(3, "Entering getNFTOwners()", currentAccount);
    let receivedNFTs = await getCurrentUserNFTs(
      Web3Api,
      currentAccount,
      contractAddresses
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

      // console.log("****NFTsArray ", _NFTsArray);
      // console.log(
      //   "****processingObject ",
      //   _TrustedAddressToContractAddress,
      //   _ContractAddressToNFTArrayIndex
      // );

      setNFTsArray(_NFTsArray);
      setProcessingObject((prevState) => ({
        ...prevState,
        TrustedAddressToContractAddress: _TrustedAddressToContractAddress,
        ContractAddressToNFTArrayIndex: _ContractAddressToNFTArrayIndex,
      }));
    } else {
      if (receivedNFTs.trustedAddr !== null) {
        colorLog(3, "Calling processNFTMetadata()");
        processNFTMetadata(receivedNFTs);
      } else {
        console.log("Error - NFT does not have a trusted broadcast address.");
      }
    }
    colorLog(1, "Exiting getNFTMetaData");
  };

  const processNFTMetadata = async (NFTMetadata) => {
    colorLog(1, "Entering processNFTMetadata", NFTMetadata);
    let x = 0;
    let _ContractAddressToNFTArrayIndex = {};
    let _TrustedAddressToContractAddress = {};
    let _NFTsArray = [];
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

  const checkMessages = async () => {
    colorLog(1, "Entering checkMessages");

    console.log("processingObject", processingObject);

    if (
      XMTPManager.connected() &&
      Object.keys(processingObject.TrustedAddressToContractAddress).length !== 0
    ) {
      console.log("New processingObject or XMTPManager detected.");
      colorLog(3, "Calling getMessages()");
      getMessages();
    }
    colorLog(1, "Exiting checkMessages");
  };

  //if a new NFT is added or XMTP connection established, then get messages.
  useEffect(() => {
    if (XMTPManager.connected()) checkMessages();
  }, [
    processingObject.TrustedAddressToContractAddress,
    XMTPManager.clientInstance,
  ]);

  useEffect(() => {
    const interval = setInterval(() => checkMessages(), 30000);
    return () => {
      clearInterval(interval);
    };
  }, [
    processingObject.TrustedAddressToContractAddress,
    XMTPManager.clientInstance,
  ]);

  //if currentAccount is updated, getNFTMetaData for new account
  useEffect(() => {
    if (currentAccount.length !== 0) {
      console.log("New Account Detected:", currentAccount);
      colorLog(3, "Calling getNFTMetaData()");
      getNFTMetaData();
    }
  }, [currentAccount]);

  const getMessages = async () => {
    colorLog(1, "Entering getMessages");
    const conversations = await XMTPManager.getConversations();

    console.log(" xmtp.conversations.list()", conversations);
    let allMessages = [];

    let _TrustedAddressToContractAddress =
      processingObject.TrustedAddressToContractAddress;

    console.log(
      "_TrustedAddressToContractAddress",
      _TrustedAddressToContractAddress
    );

    const opts = {
      // Only show messages from 7 day(s)
      //startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
      //5 min
      startTime: new Date(new Date() - 5 * 60000),
      endTime: new Date(),
    };

    for (const conversation of conversations) {
      const messagesInConversation = await conversation.messages(opts);

      for await (const message of messagesInConversation) {
        //TODO: sanitize all message.content prior to printing out or processing.

        //check to see if message is from trusted broadcast address
        if (message.content === undefined) continue;
        console.log(
          `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
        );

        const msgContent = JSON.parse(message.content);
        // if message is from a trusted senderAddress and has a command attr
        if (
          message.senderAddress in _TrustedAddressToContractAddress &&
          msgContent.hasOwnProperty("command")
        ) {
          console.log("Message added from tba.", message.senderAddress);
          console.log(
            `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
            //if message is from a trusted senderAddress with matching in message content process messages.
          );
          allMessages.push(message);
        }
      }
    }

    const messagesCleaned = allMessages.map((message) => {
      const msgContent = JSON.parse(message.content);

      return {
        senderAddress: message.senderAddress,
        id: message.id,
        content: msgContent,
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

    // if (!processingObject.hasOwnProperty("isMessageProcessed")) {
    //   processingObject.isMessageProcessed = {};
    // }

    let _isMessageProcessed = processingObject.isMessageProcessed;

    console.log(_isMessageProcessed);
    colorLog(1, "Entering processMessages");

    for (const message of _allMessages) {
      if (message.id in _isMessageProcessed) {
        continue;
      }

      colorLog(
        2,
        "Processing message from Trusted Broadcast Address(message.id):",
        message.id
      );

      // //todo: json needs to be set to message.content
      // let json =
      //   '{"command":"pin","cid":"ipfs://bafybeigpwzgifof6qbblw67wplb7xtjloeuozaz7wamkfjvnztrjjwvk7e","subject":"test subject","encryptionKey":"testEncryptionKey"}';

      let msgContent = JSON.parse(message.content);

      for (let attr of ["command", "cid", "subject", "secretKey"]) {
        if (msgContent[attr] === undefined) {
          console.log(
            "No " +
              attr +
              " in message from Trusted Broadcast Address. skipping message. (message.id): ",
            message.id
          );
        }
      }

      if (msgContent["command"] === undefined) {
        // FIXME: we aren't exiting though?
        colorLog(1, "Exiting processMessages");
        _isMessageProcessed[message.id] = true;
        continue;
      }

      //get command from message.content
      const command = msgContent["command"];
      const cid = msgContent["cid"];
      const subject = msgContent["subject"];
      const secretKey = msgContent["secretKey"];

      //TODO: Need to deal with the case where 2NFTs have same TBA

      switch (command) {
        case "pin":
          colorLog(3, "Calling pinItem()", cid, subject, message.senderAddress);
          pinItem(cid, subject, message.senderAddress);
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

    // if (!processingObject.hasOwnProperty("CIDtoContractAddress")) {
    //   processingObject.CIDtoContractAddress = {};
    // }

    // if (!processingObject.hasOwnProperty("CIDtoPinDataArrayIndex")) {
    //   processingObject.CIDtoPinDataArrayIndex = {};
    // }

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

      pinCID(_cid);
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

      if (pinDataIndex === pinDataLastIndex) {
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

      unpinCID(_cid);
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
          <Route path="/" index element={<Home NFTsArray={NFTsArray} />} />

          <Route path="/created" element={<Created NFTsArray={NFTsArray} />} />

          <Route path="/data" element={<AllNFTData NFTsArray={NFTsArray} />} />

          <Route
            path="/nft/:nftTitle"
            element={
              <DetailSection
                isCreatedPage={false}
                NFTsArray={NFTsArray}
                ContractAddressToNFTArrayIndex={
                  processingObject.ContractAddressToNFTArrayIndex
                }
                TrustedAddressToContractAddress={
                  processingObject.TrustedAddressToContractAddress
                }
              />
            }
          />

          <Route
            path="/nft/manage/:nftAddr"
            element={
              <DetailSection
                isCreatedPage={true}
                NFTsArray={NFTsArray}
                ContractAddressToNFTArrayIndex={
                  processingObject.ContractAddressToNFTArrayIndex
                }
                TrustedAddressToContractAddress={
                  processingObject.TrustedAddressToContractAddress
                }
              />
            }
          />
        </Routes>
      </MainContainer>
    );
  }
};

export default App;
