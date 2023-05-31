require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */

// module.exports = {
//   solidity: "0.8.18",
//   mocha:{
//     timeout:3000000
//   },
//   paths: {
//     sources: "./contracts",
//  }
// };
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "sepolia",
  paths:{
    sources:"./contracts",
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
}