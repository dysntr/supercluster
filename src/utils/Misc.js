async function getTodayDate() {
  try {
    let date = new Date();
    let dateString =
      ("0" + (date.getMonth() + 1).toString()).substr(-2) +
      "/" +
      ("0" + date.getDate().toString()).substr(-2) +
      "/" +
      date.getFullYear().toString().substr(2);
  } catch (e) {
    console.error(e);
  }
}

async function fillNftArrayWithTestData() {
  try {
    console.log("Filling NFTsArray with test data");
    let NFTsArray = {};
    let TrustedAddressToContractAddress = {};
    let ContractAddressToNFTArrayIndex = {};
    NFTsArray = [
      {
        NFTTitle: "JWT Galaxy",
        NFTImg: "/fakeNFT/galaxies.jpg",
        contractAddr: "0x57E7546d4AdD5758a61C01b84f0858FA0752e940",
        trustedAddr: "0xd69DFe5AE027B4912E384B821afeB946592fb648",
        pinData: [],
      },
    ];
    TrustedAddressToContractAddress[
      "0xd69DFe5AE027B4912E384B821afeB946592fb648"
    ] = "0x57e7546d4add5758a61c01b84f0858fa0752e940";
    ContractAddressToNFTArrayIndex[
      "0x57e7546d4add5758a61c01b84f0858fa0752e940"
    ] = 0;

    return {
      NFTsArray,
      TrustedAddressToContractAddress,
      ContractAddressToNFTArrayIndex,
    };
  } catch (e) {
    console.error(e);
  }
}

function colorLog(
  level = 1,
  message,
  _param1 = "-",
  _param2 = "-",
  _param3 = "-"
) {
  let color, levelPad;
  switch (level) {
    case 1:
      //Function enter/exit
      color = "background: #222; color: #bada55";
      break;
    case 2:
      //Actions in functions (eg.processing)
      color = "background: #222; color: #f57f17";
      break;
    case 3:
      //Calling other functions
      color = "background: #222; color: #ff1744";
      break;
    case 4:
      color = "background: #222; color: #bada55";
      break;
    default:
      color = "background: #222; color: #bada55";
  }

  console.log("%c" + message, color, _param1, _param2);
}

export { fillNftArrayWithTestData, getTodayDate, colorLog };
