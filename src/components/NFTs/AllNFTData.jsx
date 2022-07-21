import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fakeNFTs } from "../../fakeNFTs";
import { colorLog } from "../../utils/Misc";
import SectionLoading from "../SectionLoading";
import ContentDetails from "./ContentDetails";
import NFTGeneral from "./NFTGeneral";

const AllDataSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Menu = styled.div`
  padding: 1em 2em;
  width: 85%;
`;

const BackLink = styled(Link)`
  border: none;
  color: white;
  background-color: #262833;
  border-bottom: 1px solid white;
`;

const NFTContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 85%;
  margin: 2em;
`;

const ContentInfo = styled.div`
  flex-grow: 1;
  margin: 0 2em 2em 2em;
`;

export const AllNFTData = ({ walletAddress, web3Api, NFTsArray }) => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // {
  //   NFTTitle: "JWT Galaxy",
  //   NFTImg: "/fakeNFT/galaxies.jpg",
  //   contractAddr: "0x0d145472c4Cc8D3d5c7b02A811f4FD83d26382A0",
  //   trustedAddr: "0x0d145472c4Cc8D3d5c7b02A811f4FD83d26382A0",
  //   pinData: [
  //     {
  //       subject: "JWT galaxies pic",
  //       CID: "QmedKF9UM2XDEepFZjM2rFZ4hKadTHzbRkeP4Sza2AYNrU",
  //       date: "07/17/22",
  //     },
  //     {
  //       subject: "JWT blackhole",
  //       CID: "QmQiu4DowMCdM6H9VDZnPMm6kCCZutqUJUvCAmXzLsqHTH",
  //       date: "07/17/22",
  //     },
  //   ],
  // },

  //for (NFT in NFTsArray) {
  /// All Data
  /// NFTTitle, NFTImg,Subject, CID, Date

  ///
  ///
  console.log("NFTsArray-ALLNFTData", NFTsArray);
  console.log("nfts-ALLNFTData", nfts);

  // const ALLNFTs = nfts.map((nft) => {
  //   console.log(nft);
  //   return (
  //     <NFTContainer>
  //       <NFTGeneral nft={nft} />
  //       <ContentInfo>
  //         <ContentDetails contentArray={nft.pinData} />
  //       </ContentInfo>
  //     </NFTContainer>
  //   );
  // });

  // // temp, need to pull pin data from the state
  // console.log("nft.contractAddr", nft.trustedAddr);

  // console.log(
  //   "ContractAddressToNFTArrayIndex[TrustedAddressToContractAddress[TrustedAddress]]",
  //   ContractAddressToNFTArrayIndex[
  //     TrustedAddressToContractAddress[nft.trustedAddr]
  //   ]
  // );
  // console.log("ContractAddressToNFTArrayIndex", ContractAddressToNFTArrayIndex);

  // console.log("NFTsArray", NFTsArray);

  // const pinData =
  //   NFTsArray[
  //     ContractAddressToNFTArrayIndex[
  //       TrustedAddressToContractAddress[nft.trustedAddr]
  //     ]
  //   ].pinData;

  useEffect(() => {
    async function getCreatedNFTs(Web3Api, walletAddress) {
      const superClusterNFT = "0xd69DFe5AE027B4912E384B821afeB946592fb648";
      const options = {
        address: walletAddress,
        chain: "polygon",
      };

      let createdNFTs = [];

      const NFTs = await Web3Api.account.getNFTs(options);
      if (NFTs.result.length > 0) {
        NFTs.result.forEach((result) => {
          let nft_metadata = result.metadata;

          if (nft_metadata && nft_metadata.includes(superClusterNFT)) {
            const metaData = JSON.parse(nft_metadata);
            const trustedAddr = metaData.attributes[0].value;
            metaData["trustedAddr"] = trustedAddr;

            //removes duplicate attributes section
            delete metaData.attributes;
            console.log(metaData);
            createdNFTs.push(metaData);
          }
        });
        setIsLoading(false);
        setNfts(createdNFTs);
      } else {
        console.log(colorLog(1, "Error retrieving created NFTs"));
      }
    }
    getCreatedNFTs(web3Api, walletAddress);
  }, [web3Api, walletAddress]);

  if (isLoading) {
    return <SectionLoading />;
  }

  return (
    <AllDataSection>
      <Menu>
        <BackLink to="/">Home</BackLink>
      </Menu>
      {/* {ALLNFTs} */}
    </AllDataSection>
  );
};
