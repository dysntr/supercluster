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

// Hard-coded NFT Contract Address
const contractAddress = "0x57E7546d4AdD5758a61C01b84f0858FA0752e940";

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

  const getMessages = async (xmtp) => {
    console.log("Getting messages...");
    console.log(" xmtp.conversations.list()", await xmtp.conversations.list());
    var allMessages = new Array();
    for (const conversation of await xmtp.conversations.list()) {
      const messagesInConversation = await conversation.messages();

      for await (const message of messagesInConversation) {
        allMessages.push(message);
        console.log(
          `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
        );
      }
    }

    const messagesCleaned = allMessages.map((message) => {
      return {
        Sender: message.senderAddress,
        Hash: message.id,
        Content: message.content,
      };
    });
    setAllMessages(messagesCleaned);
  };

  const connectXMTP = async () => {
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
    try {
      web3Provider = new ethers.providers.Web3Provider(getProvider());
      const accounts = await web3Provider.provider.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      checkIfXMTPConnected(accounts[0]);

      let receivedNFTs = await getNFTOwners(Web3Api, accounts[0], contractAddress);
      console.log(receivedNFTs)
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
          <Route path="/" index element={<Home accountNFTs={accountNFTs} allMessages = {allMessages} />} />
          <Route path="/created" element={<Created />} />
          <Route path="/data" element={<AllData />} />
          <Route path="/nft/:nftTitle" element={<NFTDetail />} />
        </Routes>
      </MainContainer>
    );
  }
};

export default App;
