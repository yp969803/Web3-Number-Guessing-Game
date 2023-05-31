//
const hre = require("hardhat")
require('dotenv').config()
// console.log(process.env)
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

    //Setuo account
    const [deployer]=await ethers.getSigners();
    //Deploy Dappazon
    const GuessNum=await hre.ethers.getContractFactory("GuessNum");
    const hardhatToken=await GuessNum.deploy(process.env.CHAIN_ID)

    await hardhatToken.deployed();
    console.log("Deployed GuessNum contract at "+hardhatToken.address);
    await hardhatToken.connect(deployer).topUpGameBalance({value:tokens(0.1)});
     console.log(await hardhatToken.GameBalance())

    
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

