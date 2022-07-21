import { Client } from "@xmtp/xmtp-js";

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
      this.clientInstance = await Client.create(wallet);
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
