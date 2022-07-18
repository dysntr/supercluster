export const processMessages = async (_allMessages) => {
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