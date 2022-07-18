export default async function getNFTOwners(Web3Api, currentAccount, contractAddress) {
  console.log(currentAccount);

  const options = {
    chain: "polygon",
    address: currentAccount,
    token_address: contractAddress,
  };

  try {
    const superclusterNFTs = await Web3Api.account.getNFTsForContract(options);
    if (superclusterNFTs.result.length > 0) {
      return superclusterNFTs.result;
    } else {
      return null;
    }
  } catch(e) {
    console.error(e);
  }
}