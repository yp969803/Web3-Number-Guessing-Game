const { expect,assert } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers,network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const {linkToken}=require('./linKTokenAbi')
const   LinkTokenABI=linkToken

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('GuessNum Contract',async()=>{
  async function deployTokenFixture(){
    const [deployer,player]=await ethers.getSigners()

    const BASE_FEE = "100000000000000000"
    const GAS_PRICE_LINK = "1000000000" // 0.000000001 LINK per gas

    const chainId = network.config.chainId
    const VRFCoordinatorV2MockFactory = await ethers.getContractFactory(
      "VRFCoordinatorV2Mock"
  )
  const VRFCoordinatorV2Mock = await VRFCoordinatorV2MockFactory.deploy(
      BASE_FEE,
      GAS_PRICE_LINK
  )
              const fundAmount = networkConfig[chainId]["fundAmount"] || "1000000000000000000"
              const transaction = await VRFCoordinatorV2Mock.createSubscription()
              const transactionReceipt = await transaction.wait(1)
              const subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1])
              await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, fundAmount)

              const vrfCoordinatorAddress = VRFCoordinatorV2Mock.address
              const keyHash =
                  networkConfig[chainId]["keyHash"] ||
                  "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc"



    const GuessNum=await ethers.getContractFactory("Test")
    
    // const hardhatToken=await GuessNum.deploy(2221);
    const hardhatToken = await GuessNum
    .connect(deployer)
    .deploy(subscriptionId, vrfCoordinatorAddress, keyHash)
    await hardhatToken.deployed();
  
    await VRFCoordinatorV2Mock.addConsumer(subscriptionId, hardhatToken.address)
    return {hardhatToken,GuessNum,deployer,player,VRFCoordinatorV2Mock}
  }
  describe("Deployment",()=>{
    it("Should be the owner",async()=>{
      const {hardhatToken,deployer,player}=await loadFixture(deployTokenFixture);
      console.log(await hardhatToken.malik())
      expect(await hardhatToken.malik()).to.equal(deployer.address)
    })
  })
  describe("Balance management",()=>{
    it("Game balance update",async()=>{
      const { hardhatToken,deployer,player,GuessNum} = await loadFixture(deployTokenFixture);
      await hardhatToken.connect(deployer).topUpGameBalance({value:tokens(1)});
      console.log(await hardhatToken.GameBalance())
      expect(await hardhatToken.GameBalance()).to.equal(tokens(1));

    })
    it("Emit Game Balance",async ()=>{
      const { hardhatToken,deployer,player,GuessNum} = await loadFixture(deployTokenFixture);
      const gameBalance=await hardhatToken.connect(deployer).topUpGameBalance({value:tokens(1)});
 
      expect(gameBalance).to.emit(GuessNum,"topUpGameWallet")

    })

    it("Wallet Balance Update",async()=>{
      const { hardhatToken,deployer,player,GuessNum} = await loadFixture(deployTokenFixture);
      await hardhatToken.connect(player).topUp({value:tokens(1)});
      expect(await hardhatToken.WalletBalance(player.address)).to.equal(tokens(1))
    })
    it("Eimt Wallet Balance Update",async()=>{
      const {hardhatToken,deployer,player,GuessNum}=await loadFixture(deployTokenFixture);
      const walletEmit=await hardhatToken.connect(player).topUp({value:tokens(1)});
      expect(walletEmit).to.emit(GuessNum,"topUpWallet")
    })
    it("Wallet Walance Withdraw",async()=>{
      //WithdrawWalletBalance
      const {hardhatToken,deployer,player,GuessNum}=await loadFixture(deployTokenFixture);
      await hardhatToken.connect(player).topUp({value:tokens(1)});
      await hardhatToken.connect(player).WithdrawWalletBalance(tokens(0.5))
      expect(await hardhatToken.WalletBalance(player.address)).to.equal(tokens(0.5))

    })
    it("Emit Wallet Walance Withdraw",async()=>{
      //WithdrawWalletBalance
      const {hardhatToken,deployer,player,GuessNum}=await loadFixture(deployTokenFixture);
      await hardhatToken.connect(player).topUp({value:tokens(1)});
      const walletWithdrawEmit=await hardhatToken.connect(player).WithdrawWalletBalance(tokens(0.5))
      expect(walletWithdrawEmit).to.emit(GuessNum,"WalletBalanceWithdraw")

    })
    it("should withdraw gameBalance",async()=>{
      const {hardhatToken,deployer,player,GuessNum}=await loadFixture(deployTokenFixture);
      await hardhatToken.connect(deployer).topUpGameBalance({value:tokens(1)});
      await hardhatToken.connect(deployer).WithdrawGameBalance(tokens(0.5));
      expect(await hardhatToken.GameBalance()).to.equal(tokens(0.5));
    })
    it("should emit withdraw gameBalance",async()=>{
      const {hardhatToken,deployer,player,GuessNum}=await loadFixture(deployTokenFixture)
      await hardhatToken.connect(deployer).topUpGameBalance({value:tokens(1)});
      const emitGameWithdrawBalance=await hardhatToken.connect(deployer).WithdrawGameBalance(tokens(0.5));

     expect(emitGameWithdrawBalance).to.emit(GuessNum,"GameBalanceWithdraw")
    })
  })
  describe("Game Management",()=>{
    it("Should playgame",async()=>{
       const {hardhatToken,deployer,player,GuessNum,VRFCoordinatorV2Mock}=await loadFixture(deployTokenFixture)
       await hardhatToken.connect(player).topUp({value:tokens(1)});
       await hardhatToken.connect(deployer).topUpGameBalance({value:tokens(1)});
      //  expect(await hardhatToken.WalletBalance(player.address)).to.equal(tokens(1))
       console.log(await hardhatToken.WalletBalance(player.address))
       console.log(tokens(0.05))
       expect(await hardhatToken.connect(player).playGame(tokens(0.005))).to.emit(VRFCoordinatorV2Mock,
        "RandomWordsRequested")
    })
    it("Choosing a number",async()=>{
      
      const {hardhatToken,deployer,player,GuessNum,VRFCoordinatorV2Mock}=await loadFixture(deployTokenFixture)
       await hardhatToken.connect(player).topUp({value:tokens(1)});
       await hardhatToken.connect(deployer).topUpGameBalance({value:tokens(1)});
      //  expect(await hardhatToken.WalletBalance(player.address)).to.equal(tokens(1))
      console.log(await hardhatToken.connect(player).PersonsProfile(player.address));
       console.log(await hardhatToken.WalletBalance(player.address))
      //  console.log(tokens(0.05))

       await hardhatToken.connect(player).playGame(tokens(0.005))
       const requestId = await hardhatToken.s_requestId()

      //  (x,y,z) = await hardhatToken.connect(player).choose(2)
      // console.log()
      // let arr=await hardhatToken.s_requests(Number(requestId.data.toString()))
      // console.log(arr)
      // const {x,y,z}=await hardhatToken.connect(player).choose(5)
      // console.log(await hardhatToken.)
      // console.log(await hardhatToken.connect(player).PersonsProfile(player.address));
      await  expect(await VRFCoordinatorV2Mock.fulfillRandomWords(
        requestId,
        hardhatToken.address)).to.emit(GuessNum,"Requestfulfilled")
      //  expect(requestId).to.emit(GuessNum,"RequestFulfilled")
         const firstRandomNumber = await hardhatToken.s_randomWords(0)
                      // const secondRandomNumber = await hardhatToken.s_randomWords(1)

         assert(
                 firstRandomNumber.gt(ethers.constants.Zero),
                  "First random number is greater than zero"
         )


                    
    })
  })
})