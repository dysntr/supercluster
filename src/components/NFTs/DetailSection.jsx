import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import ContentDetails from "./ContentDetails";
import NewContent from "./NewContent";
import NFTGeneral from "./NFTGeneral";
import {getNFTOwners} from "../../utils/NFT";
import { useMoralisWeb3Api } from "react-moralis";
import SectionLoading from "../SectionLoading";

const NFTSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 30vh;
`;

const Menu = styled.div`
  padding: 1em 0;
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
`;

const ContentInfo = styled.div`
  flex-grow: 1;
  margin: 2em;
`;

const DetailSection = ({
  isCreator,
  NFTsArray,
  ContractAddressToNFTArrayIndex,
  TrustedAddressToContractAddress,
}) => {
  // Instantiate Moralis Web3 API
  const Web3Api = useMoralisWeb3Api();

  const location = useLocation();
  // NFT Object is passed through React Router in the state object
  // see the NFT List component for prop passed nftobj
  const { nftObj } = location.state;
  const { nft } = nftObj;
  console.log("NFT Object from DetailSection: ", nft);

  // temp, need to pull pin data from the state
  console.log("nft.contractAddr", nft.trustedAddr);

  console.log(
    "ContractAddressToNFTArrayIndex[TrustedAddressToContractAddress[TrustedAddress]]",
    ContractAddressToNFTArrayIndex[
      TrustedAddressToContractAddress[nft.trustedAddr]
    ]
  );
  console.log("ContractAddressToNFTArrayIndex", ContractAddressToNFTArrayIndex);

  console.log("NFTsArray", NFTsArray);

  const contractAddress = TrustedAddressToContractAddress[nft.trustedAddr];

  const [nftOwners, setNFTOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAsyncNFTOwners = async () => {
    return await getNFTOwners(Web3Api, contractAddress);
  }

  useEffect(() => {
    setLoading(true);
    let nftOwners = getAsyncNFTOwners();    
    setNFTOwners(nftOwners);
    setLoading(false)
  }, [contractAddress])

  const pinData =
    NFTsArray[
      ContractAddressToNFTArrayIndex[
        TrustedAddressToContractAddress[nft.trustedAddr]
      ]
    ].pinData;
  // const pinData = [
  //   {
  //     subject: "JWT galaxies pic",
  //     CID: "QmedKF9UM2XDEepFZjM2rFZ4hKadTHzbRkeP4Sza2AYNrU",
  //     date: "07/17/22",
  //   },
  //   {
  //     subject: "JWT blackhole",
  //     CID: "QmQiu4DowMCdM6H9VDZnPMm6kCCZutqUJUvCAmXzLsqHTH",
  //     date: "07/17/22",
  //   },
  // ];

  if (loading) {
    return (
      <SectionLoading />
    )
  }

  return (
    <NFTSection>
      <Menu>
        <BackLink to={isCreator ? "/created" : "/"} />
      </Menu>
      <NFTContainer>
        <NFTGeneral nft={nft} />
        <ContentInfo>
          {isCreator ? <NewContent nftOwners={nftOwners} /> : null}
          <ContentDetails contentArray={pinData} />
        </ContentInfo>
      </NFTContainer>
    </NFTSection>
  );
};

export default DetailSection;
