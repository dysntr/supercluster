import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { Wallet, ethers } from "ethers";
import createMetaMaskProvider from 'metamask-extension-provider'

const getProvider = () => {
    if (window.ethereum) {
        console.log('found window.ethereum>>');
        return window.ethereum;
    } else {
        const provider = createMetaMaskProvider();
        return provider;
    }
}

const App = () => {
  // Wallet Setup
  const MINUTE_MS = 10000;
  let xtmp_setup = false;
  let xtmp_call = false;
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentXMTP, setCurrentXMTP] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

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

  return (
    <div className="mainContainer">
      Hi!
      {!currentAccount && (
        <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      <div styles="overflow-y : scroll; max-height: 200px;">
        {allMessages.map((message, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Sender: {message.Sender}</div>
              <div>Message Hash: {message.Hash}</div>
              <div>Message: {message.Content}</div>
            </div>
          );
        })}
      </div>
      {
        <button className="SendMessage" onClick={sendMessage}>
          SendMessage
        </button>
      }
    </div>
  );
};

export default App;
