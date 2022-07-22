/* global chrome */
import { Client } from "@xmtp/xmtp-js";

import { colorLog } from "../utils/Misc";

export default class XMTPManager {
  static clientInstance = {};

  static connected = () => {
    console.log("this.clientInstance", this.clientInstance);
    if (this.clientInstance === null) {
      return false;
    }
    console.log(
      "Object.keys(this.clientInstance)",
      Object.keys(this.clientInstance)
    );

    return !(Object.keys(this.clientInstance).length === 0);
  };

  static async sendMessage(recipientAddress, message) {
    if (this.connected()) {
      const conversation =
        await this.clientInstance.conversations.newConversation(
          recipientAddress
        );
      await conversation.send(message);
      return;
    }
    throw new Error("XMTP not connected!");
  }

  static async getConversations() {
    if (this.connected()) {
      console.log("XMTP object", this.clientInstance);
      return await this.clientInstance.conversations.list();
    }
    throw new Error("XMTP not connected!");
  }
  /**
   * @returns {XMTPManager}
   */
  static async getInstance(wallet) {
    if (!this.connected()) {
      // Get the keys using a valid ethers.Signer. Save them somewhere secure.
      const keys = await Client.getKeys(wallet);
      var data = {
        // Create a view
        data: Array.apply(null, keys),
        contentType: 'x-an-example'
      };

      // Transport over a JSON-serialized channel. In your case: sendResponse
      var transportData = JSON.stringify(data);
      console.log(data);
      chrome.storage.local.set({"xmtp-identity": transportData}, () => colorLog(3, "XMTP identity pushed to chrome localstorage"));
      // Create a client using keys returned from getKeys
      this.clientInstance = await Client.create(null, { privateKeyOverride: keys })
    }
    return this.clientInstance;
  }

  /**
   * @returns {XMTPManager}
   */
  static async setInstance(_clientInstance) {
    console.log("setting xmtp instance", _clientInstance);
    if (!this.connected()) {
      console.log("inside if statement for setInstance");
      this.clientInstance = _clientInstance;
    }
  }
}
