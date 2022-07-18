/*global chrome*/
import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { Wallet, ethers } from "ethers";
import createMetaMaskProvider from 'metamask-extension-provider'
import styled from "styled-components";
import { useMoralisWeb3Api } from "react-moralis"

// Utils
import getNFTOwners from "./utils/NFT";

// Navigation Imports
import {Routes, Route} from 'react-router-dom';

// Components
import Home from './pages/Home';
import Created from "./pages/Created";
import Navigation from "./components/Navigation";
import AllData from "./pages/AllData";
import ConnectWallet from "./pages/ConnectWallet";

// Styled Components
const MainContainer = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #262833;
  color: white;
  flex-direction: column;
  text-align: center;
  margin: 0;
  height: 100%;
`

const getProvider = () => {
  if (window.ethereum) {
    return window.ethereum;
  } else {
    const provider = createMetaMaskProvider();
    return provider;
  }
}

// Hard-coded NFT Contract Address
const contractAddress = "0x6301e6278c099613bb9947017f8a21163d130607";

const App = () => {
  // Moralis Web3Api Instantiation
  const Web3Api = useMoralisWeb3Api();

  // Wallet Setup
  const MINUTE_MS = 10000;
  let xtmp_setup = false;
  let xtmp_call = false;
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentXMTP, setCurrentXMTP] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [accountNFTs, setAccountNFTs] = useState([]);

  let web3Provider;
  let wallet;

  const checkIfXMTPConnected = async (account) => {
    console.log("checkIfXMTPConnected")
    try {
      if (currentXMTP.length !== 0) {
        console.log("XMTP setup already!", currentXMTP);

        return;
      } else {
        if (account && !xtmp_call) {
          xtmp_call = true;
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

  //check to see if wallet is connected

  const checkIfWalletIsConnected = async () => {
    console.log("checkIfWalletIsConnected")
    try {
      web3Provider = new ethers.providers.Web3Provider(getProvider());
      const accounts = await web3Provider.provider.request({ method: "eth_accounts" });

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

  const getMessages = async (xmtp) => {
    console.log("getmessages")
    console.log(xmtp)
    console.log(" xmtp.conversations.list()", await xmtp.conversations.list());
    var allMessages = [];
    for (const conversation of await xmtp.conversations.list()) {
      const messagesInConversation = await conversation.messages();

      for await (const message of messagesInConversation) {
        allMessages.push(message);
        console.log(
          `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
        );
        if (message.content.includes("hello") && message.senderAddress !== "0xE4475EF8717d14Bef6dCBAd55E41dE64a0cc8510") {
          console.log(xmtp)
          sendMessage(message.senderAddress, "different message", xmtp)
        }
      }
    }

    const messagesCleaned = allMessages.map((message) => {
      console.log("messagesCleaned")
      return {
        Sender: message.senderAddress,
        Hash: message.id,
        Content: message.content,
      };
    });
    setAllMessages(messagesCleaned);
  };

  const connectXMTP = async () => {
    console.log("connectXMTP")
    web3Provider = new ethers.providers.Web3Provider(getProvider());
    wallet = web3Provider.getSigner();
    // Create the client with your wallet. This will connect to the XMTP development network by default
    const xmtp = await Client.create(wallet);
    setCurrentXMTP(xmtp);
    xtmp_call = false;
    getMessages(xmtp);
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    console.log("connectWallet")
    chrome.storage.sync.get('userEthAddress', async function(data) {
      let userEthAddress;
      if (data.userEthAddress === undefined) {
        try {
          web3Provider = new ethers.providers.Web3Provider(getProvider());

          const accounts = await web3Provider.provider.request({
            method: "eth_requestAccounts",
          });

          console.log("Connected", accounts[0]);
          userEthAddress = accounts[0];
          // not setting a callback here but chrome.storage.sync has a (very small) limit
          chrome.storage.sync.set({"userEthAddress": userEthAddress}, () =>{
            console.log("addr set!")
          });
        } catch (error) {
          console.log(error);
          return;
        }
      } else {
        userEthAddress = data.userEthAddress;
      }
      setCurrentAccount(userEthAddress);
      checkIfXMTPConnected(userEthAddress);
      setAccountNFTs(await getNFTOwners(Web3Api, userEthAddress, contractAddress));
    });
  };

  const sendMessage = async (recipient, message, xmtp) => {
    console.log("sendMessage")
    try {
      if (xmtp !== undefined) {
        console.log("Entering sendMessage()...");
        console.log(xmtp);
        message = new Date() + " " + message
        const conversation = await xmtp.conversations.newConversation(recipient);
        await conversation.send(message);
        console.log("Sending message to user.", message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // checkIfWalletIsConnected();
  }, []);

  if(!currentAccount) {
    return (
      <MainContainer>
        <ConnectWallet connectWallet={connectWallet} />
      </MainContainer>
    )
  } else {
    return (
      <MainContainer>
        <Navigation walletAddress={currentAccount} />
        <Routes>
          <Route path="/" index element={<Home accountNFTs={accountNFTs} allMessages = {allMessages} />} />
          <Route path="/created" element={<Created />} />
          <Route path="/data" element={<AllData />} />
        </Routes>
      </MainContainer>
    )
  }
};

export default App;
