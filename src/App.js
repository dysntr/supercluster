import "./App.css";
import React, { useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import createMetaMaskProvider from "metamask-extension-provider";
import styled from "styled-components";
import { useMoralisWeb3Api } from "react-moralis"

// Utils
import getNFTOwners from "./utils/NFT";

// Navigation Imports
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./pages/Home";
import Created from "./pages/Created";
import Navigation from "./components/Navigation";
import AllData from "./pages/AllData";
import ConnectWallet from "./pages/ConnectWallet";
import NFTDetail from "./components/followedNFTs/NFTDetail";

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
  const MINUTE_MS = 10000;
  let xtmp_setup = false;
  var Processed = {};
  var runOnce = false;

  let NFTsArray = [];
  //mapping objects for updating NFTs Array

  var ContractAddresstoTrustedAddress = {};
  var ContractAddresstoNFTTitle = {};
  var ContractAddresstoNFTImg = {};
  var TrustedAddresstoContractAddress = {};

  var ContractAddresstoNFTArrayIndex = {};

  var CIDtoContractAddress = {};
  var CIDtoPinDataArrayIndex = {};

  const [currentAccount, setCurrentAccount] = useState("");
  const [contractAddress, setContractAddress] = useState("0x57E7546d4AdD5758a61C01b84f0858FA0752e940")
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
        web3Provider = new ethers.providers.Web3Provider(getProvider());
        const accounts = await web3Provider.provider.request({
          method: "eth_requestAccounts",
        });
  
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
  
        let receivedNFTs = await getNFTOwners(Web3Api, accounts[0], contractAddress);

        if (receivedNFTs.trustedAddr) {
          // setAccountNFTs(receivedNFTs);
          NFTsArray = [receivedNFTs];
          checkIfXMTPConnected(accounts[0]);
        } else {
          console.log("The connected account does not have any valid NFTs")
        }
      } catch (error) {
        console.log(error);
      }
    };

  const checkIfXMTPConnected = async (account) => {
    try {
      if (currentXMTP.length !== 0) {
        console.log("XMTP setup already!", currentXMTP);
        return;
      } else {
        if (account) {
          console.log("Calling connectXMTP()", account);
          connectXMTP();
        } else {
          console.log("Ethereum wallet needs to be configured");
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectXMTP = async () => {
    web3Provider = new ethers.providers.Web3Provider(getProvider());
    wallet = web3Provider.getSigner();
    // Create the client with your wallet. This will connect to the XMTP development network by default
    const xmtp = await Client.create(wallet);
    setCurrentXMTP(xmtp);
    getMessages(xmtp);
  };

  const getMessages = async (xmtp) => {
    console.log("Getting messages...");
    console.log(" xmtp.conversations.list()", await xmtp.conversations.list());
    var allMessages = [];
    for (const conversation of await xmtp.conversations.list()) {
      const messagesInConversation = await conversation.messages();

      for await (const message of messagesInConversation) {
        //TODO: sanitize all message.content prior to printing out or processing.

        console.log(
          `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
          //if message is from a trusted senderAddress with matching in message content process messages.
        );

        //check to see if message is from a trusted broadcast address (TBA)
        //TBA["0xd69DFe5AE027B4912E384B821afeB946592fb648"] = true;
        //if (message.senderAddress in TBA) {
        allMessages.push(message);

        //}
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

    processMessages(allMessages);
  };

  const processMessages = async (_allMessages) => {
    //TODO: sanitize all message.content prior to printing out or processing.
    //get command
    //get cid
    //get message
    //format {command:"","cid":"","subject":""}
    console.log("Entering processMessages");

    for (const message of _allMessages) {
      if (message.id in Processed) {
        return;
      }

      //todo: json needs to be set to message.content
      var json =
        '{"command":"pin","cid":"ipfs://bafybeigpwzgifof6qbblw67wplb7xtjloeuozaz7wamkfjvnztrjjwvk7e","subject":"test subject","encryptionKey":"testEncryptionKey"}';

      // production - content will be sent in above format
      // let json = message.content;

      var myRegexp, match, command, cid, subject, secretKey;
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

      myRegexp = /"command":"(\w+)"/i;
      match = myRegexp.exec(json);
      //there was a match
      if (match !== null) {
        command = match[1];
        console.log("match(command):", command);
      } else {
        console.log(
          "No command match in message from Trusted Broadcast Address."
        );
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

      //---*****dev notes(delete):
      //you need a dictionary(object) of trusted addresses to contracts
      //you need a dictionary(object) of contracts to trusted addresses
      //dictionary(object) of contracts -> NFTTitle: "JWT Galaxy",
      //dictionary(object) of contracts -> NFTImg: "/fakeNFT/galaxies.jpg",
      //dictionary(object) of contracts -> date: "/fakeNFT/galaxies.jpg",
      //CIDtoPinDate
      //dictionary(object) nft array item location to contracts?
      //dictionary(object) of contract[cid] = location of the pin array.
      // for removing items.. you need to overwrite the deleted element with last array element, and pop the last element., update the contract[cid_deleted], and contract[cid] of last element

      //TODO: Need to deal with the case where 2NFTs have same TBA

      switch (command) {
        case "pin":
          console.log("executeCommand(pin)", cid, subject);
          pinItem(cid, subject, message.senderAddress);
          break;

        case "unpin":
          console.log("executeCommand(unpin)", cid, subject);
          //send unpin command to ipfs
          //remove from existing elements for the nft.
          //cid
          //subject
          break;

        default:
          //default
          break;
      }

      //if processed
      Processed[message.id] = true;
      console.log("Breaking out of processMessages");
      break;
    }
  };

  const pinItem = async (_cid, _subject, _tba) => {
    console.log("Entering pinItem Function()", _cid, _subject, _tba);
    if (_cid in CIDtoPinDataArrayIndex) {
      //currently, cids can only be pinned in only collection.
      console.log("_cid was previously pinned.");
      return;
    }

    //dev (delete after testing)
    TrustedAddresstoContractAddress[_tba] =
      "0x57e7546d4add5758a61c01b84f0858fa0752e940";
    ContractAddresstoNFTArrayIndex[
      "0x57e7546d4add5758a61c01b84f0858fa0752e940"
    ] = 0;

    //end of dev

    //update the mapping objects
    //get contract address
    var contractAddress = TrustedAddresstoContractAddress[_tba];

    //if the NFT has already been added continue, otherwise return.
    if (contractAddress in ContractAddresstoNFTArrayIndex) {
      console.log(
        "Working on adding a new pin for existing nft collection to follower console."
      );

      CIDtoContractAddress[_cid] = contractAddress;

      var NFTindex = [ContractAddresstoNFTArrayIndex[contractAddress]];

      console.log("NFTindex", NFTindex);
      //pin data already exist, need to update subject
      var pinDataindex;
      if (_cid in CIDtoPinDataArrayIndex) {
        console.log("updating element in pinData array.");
        pinDataindex = CIDtoPinDataArrayIndex[_cid];
      } else {
        //add a new element to pinData Arry for the nft
        console.log("adding a new element to pinData array.");
        console.log("NFTsArray during pin add:", NFTsArray)
        pinDataindex = NFTsArray[NFTindex].pinData.length;
        CIDtoPinDataArrayIndex[_cid] = pinDataindex;
      }
      console.log("pinDataindex", pinDataindex);

      var date = new Date();
      var datestring =
        ("0" + (date.getMonth() + 1).toString()).substr(-2) +
        "/" +
        ("0" + date.getDate().toString()).substr(-2) +
        "/" +
        date.getFullYear().toString().substr(2);

      console.log("***datestring", datestring);

      if (NFTsArray[NFTindex].pinData[pinDataindex] == null) {
        console.log("adding new element to array...");

        NFTsArray[NFTindex].pinData.push({
          subject: _subject,
          CID: _cid,
          date: datestring,
        });
      } else {
        console.log("updating existing element in array...");
        NFTsArray[NFTindex].pinData[pinDataindex].subject = _subject;
        NFTsArray[NFTindex].pinData[pinDataindex].CID = _cid;
        NFTsArray[NFTindex].pinData[pinDataindex].date = datestring;
      }

      //ipfs pin item.
      //TO DO: send pin command to ipfs
      console.log("pin added", NFTsArray[NFTindex]);
    } else {
      console.log(
        "Error - An Item was not pinned because the NFT is not added."
      );
      return;
    }
  };

  //check to see if wallet is connected

  const checkIfWalletIsConnected = async () => {
    try {
      web3Provider = new ethers.providers.Web3Provider(getProvider());
      const accounts = await web3Provider.provider.request({
        method: "eth_accounts",
      });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        checkIfXMTPConnected(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };





  const sendMessage = async () => {
    try {
      if (currentXMTP) {
        console.log("Entering sendMessage()...");
        const conversation = await currentXMTP.conversations.newConversation(
          "0xd69DFe5AE027B4912E384B821afeB946592fb648"
        );
        const now = new Date();
        await conversation.send(now);
        console.log("Sending message to user.", now);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const blah = () => {
  //   const interval = setInterval(() => {
  //     console.log("Logs every minute");
  //   }, MINUTE_MS);

  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // };
  // blah();

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
          <Route path="/" index element={<Home userNFTs={NFTsArray} allMessages = {allMessages} />} />
          <Route path="/created" element={<Created />} />
          <Route path="/data" element={<AllData />} />
          <Route path="/nft/:nftTitle" element={<NFTDetail />} />
        </Routes>
      </MainContainer>
    );
  }
};

export default App;
