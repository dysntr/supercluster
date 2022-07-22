import NFTList from "../components/NFTs/NFTList";
import React, { useEffect, useState } from "react";
import { colorLog, fillNftArrayWithTestData } from "../utils/Misc";
import SectionLoading from "../components/SectionLoading.jsx";

export default function Home({ NFTsArray }) {
  if (!NFTsArray) {
    return <SectionLoading />;
  }

  return <NFTList nftList={NFTsArray} isCreator={false} />;
}
