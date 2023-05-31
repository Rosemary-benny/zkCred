const CONTRACT_ADDRESS = "0xF98Fa130eAD113D4299A059959C6D31A881e4682"
const META_DATA_URL = "ipfs://bafyreigv4mr5ci3rz444kad7h2rbq6og7gc7qqrxoc6y2xj5xi33evqlb4/metadata.json"

async function mintNFT(contractAddress, metaDataURL) {
   const ExampleNFT = await ethers.getContractFactory("ExampleNFT")
   const [owner] = await ethers.getSigners()
   await ExampleNFT.attach(contractAddress).mintNFT(owner.address, metaDataURL)
   console.log("NFT minted to: ", owner.address)
}

mintNFT(CONTRACT_ADDRESS, META_DATA_URL)
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });