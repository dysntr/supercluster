export default async function getNFTOwners(
  Web3Api,
  currentAccount,
  contractAddress
) {
  //console.log(currentAccount);

  const options = {
    chain: "polygon",
    address: currentAccount,
    token_address: contractAddress,
  };

  try {
    const superclusterNFTs = await Web3Api.account.getNFTsForContract(options);

    if (superclusterNFTs.result.length > 0) {
      let nft_metadata = superclusterNFTs.result[0].metadata;

      let name_regex = /"name\":\"([\w \s]+)\"/i;
      let name_match = name_regex.exec(nft_metadata);

      let description_regex = /"description\":\"([\w \s .']+)\"/i;
      let description_match = description_regex.exec(nft_metadata);

      let image_regex = /ipfs:\/\/\w+/i;
      let image_match = image_regex.exec(nft_metadata);
      console.log("Image:", image_match[0]);

      // "TBA\",\"value\":\"0xd69DFe5AE027B4912E384B821afeB946592fb648\"
      let tbaRegex = /TBA\",\"value\":\"(0x\w{40})/i;
      let tba_match = tbaRegex.exec(nft_metadata);

      let nftObject = {
        NFTTitle: name_match[1],
        NFTImg: image_match[0],
        NFTDescription: description_match[1],
        contractAddr: contractAddress,
        trustedAddr: tba_match[1],
        pinData: [],
      };

      return nftObject;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
  }
}
