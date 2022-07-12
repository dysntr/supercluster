import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import { Client } from "@xmtp/xmtp-js";
import { Wallet, ethers } from "ethers";

const App = () => {
  // Wallet Setup
  const MINUTE_MS = 10000;
  let xtmp_set = false;
  const [currentAccount, setCurrentAccount] = useState("");
  let provider;
  let wallet;
  let xmtp;
  //check to see if wallet is connected
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);

        if (!xtmp_set) {
          xtmp_set = true;
          provider = new ethers.providers.Web3Provider(ethereum);
          wallet = provider.getSigner();
          // Create the client with your wallet. This will connect to the XMTP development network by default
          xmtp = await Client.create(wallet);
          console.log("creating new xtmp connection.");
        }
        if (xmtp !== undefined) {
          getMessages();
        }
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    // Start a conversation with Vitalik
    const conversation = await xmtp.conversations.newConversation(
      "0x5A7A9517f118dCCEfAFcB6AF99ADD30b904Ce9cb"
    );

    // Load all messages in the conversation
    const messages = await conversation.messages();
    // Send a message
    // await conversation.send("gm0001");
    for (const conversation of await xmtp.conversations.list()) {
      const messagesInConversation = await conversation.messages();
      for await (const message of messagesInConversation) {
        if (message.senderAddress === xmtp.address) {
          // This message was sent from me
          continue;
        }
        console.log(
          `Message from ${message.senderAddress}: ${message.id}: ${message.content}`
        );
      }
    }

    for await (const message of await conversation.streamMessages()) {
      if (message.senderAddress === xmtp.address) {
        // This message was sent from me
        continue;
      }
      console.log(
        `New message from ${message.senderAddress}: ${message.id}: ${message.content}`
      );
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
      if (xmtp !== undefined) {
        const conversation = await xmtp.conversations.newConversation(
          "0x5A7A9517f118dCCEfAFcB6AF99ADD30b904Ce9cb"
        );
        await conversation.send("gm0001");
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
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      hi
      {!currentAccount && (
        <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {
        <button className="SendMessage" onClick={sendMessage}>
          SendMessage
        </button>
      }
    </div>
  );
};

export default App;
