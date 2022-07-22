import React, { useEffect, useState } from "react";
import { colorLog } from "../utils/Misc.js";
import NFTList from "../components/NFTs/NFTList.jsx";
import SectionLoading from "../components/SectionLoading.jsx";

export default function Created({ NFTsArray }) {
  if (!NFTsArray) {
    return <SectionLoading />;
  }

  return <NFTList nftList={NFTsArray} isCreatedPage={true} />;
}
