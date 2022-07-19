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
  let Processed = {};

  let NFTsArray = [];

  //mapping objects for updating NFTs Array
  let TrustedAddressToContractAddress = {};
  let ContractAddressToNFTArrayIndex = {};
  let CIDtoContractAddress = {};
  let CIDtoPinDataArrayIndex = {};

  const [currentAccount, setCurrentAccount] = useState("");
  const [contractAddress, setContractAddress] = useState(
    "0x57E7546d4AdD5758a61C01b84f0858FA0752e940"
  );
  const [currentXMTP, setCurrentXMTP] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [accountNFTs, setAccountNFTs] = useState([]);

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

      let receivedNFTs = await getNFTOwners(
        Web3Api,
        accounts[0],
        contractAddress
      );

      if (receivedNFTs == null) {
        console.log("The connected account does not have any valid NFTs");

        colorLog(3, "Calling fillNftArrayWithTestData()");
        ({
          NFTsArray,
          TrustedAddressToContractAddress,
          ContractAddressToNFTArrayIndex,
        } = await fillNftArrayWithTestData());
      } else {
        if (receivedNFTs.trustedAddr !== null) {
          colorLog(3, "Calling processNFTMetadata()");
          processNFTMetadata([receivedNFTs]);
        } else {
          console.log("Error - NFT does not have a trusted broadcast address.");
        }
      }

      colorLog(3, "Calling checkIfXMTPConnected()");
      checkIfXMTPConnected(accounts[0]);

      colorLog(1, "Exiting connectWallet");
    } catch (error) {
      console.log(error);
    }
  };

  //expects an array of NFTMetadata of all the nfts to add for follower
  const processNFTMetadata = async (NFTMetadata) => {
    colorLog(1, "Entering processNFTMetadata");
    let x = 0;
    for (const NFT of NFTMetadata) {
      let NftContractAddr = NFT.contractAddr;
      let NftTrustedAddr = NFT.trustedAddr;
      NFTsArray[x] = NFT;
      ContractAddressToNFTArrayIndex[NftContractAddr] = x;
      TrustedAddressToContractAddress[NftTrustedAddr] = NftContractAddr;
      x++;
    }
    console.log("NFTsArray", NFTsArray);
    colorLog(1, "Exiting processNFTMetadata");
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

    colorLog(3, "Calling getMessages()");
    getMessages(xmtp);

    colorLog(1, "Exiting connectXMTP");
  };

  const getMessages = async (xmtp) => {
    colorLog(1, "Entering getMessages");

    console.log(" xmtp.conversations.list()", await xmtp.conversations.list());
    let allMessages = [];

    const opts = {
      // Only show messages from 7 day(s)
      startTime: new Date(new Date().setDate(new Date().getDate() - 7)),
      endTime: new Date(),
    };

    for (const conversation of await xmtp.conversations.list()) {
      const messagesInConversation = await conversation.messages(opts);

      for await (const message of messagesInConversation) {
        //TODO: sanitize all message.content prior to printing out or processing.

        console.log(
          `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
          //if message is from a trusted senderAddress with matching in message content process messages.
        );

        //check to see if message is from trusted broadcast address
        if (message.senderAddress in TrustedAddressToContractAddress) {
          console.log("Message added from tba.", message.senderAddress);
          allMessages.push(message);
        }
      }
    }

    const messagesCleaned = allMessages.map((message) => {
      return {
        Sender: message.senderAddress,
        Hash: message.id,
        Content: message.content,
      };
    });
    console.log("Cleaned messages:", messagesCleaned);

    // Remove set all messages at this point
    setAllMessages(messagesCleaned);

    colorLog(3, "Calling processMessages()");
    processMessages(allMessages);

    colorLog(1, "Exiting getMessages");
  };

  const processMessages = async (_allMessages) => {
    //TODO: sanitize all message.content prior to printing out or processing.
    //get command
    //get cid
    //get message
    //format {command:"","cid":"","subject":""}

    colorLog(1, "Entering processMessages");

    for (const message of _allMessages) {
      if (message.id in Processed) {
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
        Processed[message.id] = true;
        return;
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
      Processed[message.id] = true;
    }
    colorLog(1, "Exiting processMessages");
  };

  const pinItem = async (_cid, _subject, _tba) => {
    colorLog(1, "Entering pinItem", _cid, _subject, _tba);

    if (_cid in CIDtoPinDataArrayIndex) {
      //A CID can only be pinned in one collection.
      console.log("_cid was previously pinned.");
      colorLog(1, "Exiting pinItem");
      return;
    }

    //update the mapping objects
    //get contract address
    let contractAddress = TrustedAddressToContractAddress[_tba];

    //if the NFT has already been added continue, otherwise return.
    if (contractAddress in ContractAddressToNFTArrayIndex) {
      console.log(
        "Working on adding a new pin for existing nft collection to follower console."
      );

      CIDtoContractAddress[_cid] = contractAddress;

      let NFTIndex = [ContractAddressToNFTArrayIndex[contractAddress]];

      console.log("NFTIndex", NFTIndex);

      let pinDataIndex;
      if (_cid in CIDtoPinDataArrayIndex) {
        //pin data already exist, need to update subject

        pinDataIndex = CIDtoPinDataArrayIndex[_cid];
        console.log(
          "Getting pinDataIndex for updating an element (NFTIndex,pinDataIndex ).",
          NFTIndex,
          pinDataIndex
        );
      } else {
        //add a new element to pinData Array for the nft

        //console.log("NFTsArray during pin add:", NFTsArray[NFTIndex]);
        pinDataIndex = NFTsArray[NFTIndex].pinData.length;
        CIDtoPinDataArrayIndex[_cid] = pinDataIndex;

        console.log(
          "Getting pinDataIndex for adding a new element (NFTIndex, pinDataIndex):",
          NFTIndex,
          pinDataIndex
        );
      }

      let today = getTodayDate();

      if (NFTsArray[NFTIndex].pinData[pinDataIndex] == null) {
        console.log("Adding new element to Array...");

        NFTsArray[NFTIndex].pinData.push({
          subject: _subject,
          CID: _cid,
          date: today,
        });
      } else {
        console.log("Updating existing element in array...");
        NFTsArray[NFTIndex].pinData[pinDataIndex].subject = _subject;
        NFTsArray[NFTIndex].pinData[pinDataIndex].CID = _cid;
        NFTsArray[NFTIndex].pinData[pinDataIndex].date = today;
      }

      //IPFS pin item.
      //TO DO: send pin command to IPFS
      console.log("Pin added", NFTsArray[NFTIndex]);
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
    if (_cid in CIDtoPinDataArrayIndex) {
      console.log("Working on unpinning _cid..");
    } else {
      console.log("_cid not pinned (nothing to unpin)..");
      colorLog(1, "Exiting unpinItem");

      return;
    }

    //update the object mappings

    //get contract address
    let contractAddress = TrustedAddressToContractAddress[_tba];

    //check to see if the nft contract is in the list, otherwise return.
    if (contractAddress in ContractAddressToNFTArrayIndex) {
      console.log(
        "Contract found... Unpinning in progress...",
        contractAddress
      );

      let NFTIndex = [ContractAddressToNFTArrayIndex[contractAddress]];
      console.log("NFTIndex", NFTIndex);

      let pinDataIndex;
      if (_cid in CIDtoPinDataArrayIndex) {
        console.log("Found _cid element in pinData array.");
        pinDataIndex = CIDtoPinDataArrayIndex[_cid];
        console.log("pinDataIndex", pinDataIndex);
      } else {
        //add a new element to pinData Array for the nft
        console.log("cid index not found. nothing to unpin.");
        return;
      }

      //the index for the last element in the pinData array
      let pinDataLastIndex = NFTsArray[NFTIndex].pinData.length - 1;

      if (pinDataIndex == pinDataLastIndex) {
        //if the item we're unpinning is the last element of array
        delete NFTsArray[NFTIndex].pinData.pop();
      } else {
        //copy the last element of the array to the item that is being unpinned
        //update the CIDtoPinDataArrayIndex
        //delete the last element of the array
        NFTsArray[NFTIndex].pinData[pinDataIndex] =
          NFTsArray[NFTIndex].pinData[pinDataLastIndex];

        CIDtoPinDataArrayIndex[
          [NFTsArray[NFTIndex].pinData[pinDataIndex].CID]
        ] = pinDataIndex;

        delete NFTsArray[NFTIndex].pinData.pop();
      }

      //delete cid from mapping objects
      delete CIDtoContractAddress[_cid];
      delete CIDtoPinDataArrayIndex[_cid];

      //ipfs unpin item.
      //TO DO: send unpin command to ipfs
      console.log("item unpinned", NFTsArray[NFTIndex]);

      colorLog(1, "Exiting unpinItem");
    } else {
      console.log("Error - unpin error, no such contract found.");
      console.log("Exiting unpinItem");
      return;
    }
  };

  //check to see if wallet is connected

  const checkIfWalletIsConnected = async () => {
    try {
      colorLog(1, "Entering checkIfWalletIsConnected");
      web3Provider = new ethers.providers.Web3Provider(getProvider());
      const accounts = await web3Provider.provider.request({
        method: "eth_accounts",
      });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        colorLog(3, "Calling checkIfXMTPConnected()");
        checkIfXMTPConnected(account);
      } else {
        console.log("No authorized account found");
      }
      colorLog(1, "Exiting checkIfWalletIsConnected");
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    // checkIfWalletIsConnected();
  }, []);

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
