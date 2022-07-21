import { Client } from "@xmtp/xmtp-js";

export default class XMTPManager {
  static clientInstance = null;

  static connected = () => this.clientInstance !== null;

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
      console.log(this.clientInstance);
      return await this.clientInstance.conversations.list();
    }
    throw new Error("XMTP not connected!");
  }
  /**
   * @returns {XMTPManager}
   */
  static async getInstance(wallet) {
    if (XMTPManager.clientInstance === null) {
      XMTPManager.clientInstance = await Client.create(wallet);
    }
    return this.clientInstance;
  }
}
