// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

import "hardhat/console.sol";
contract Test is VRFConsumerBaseV2, ConfirmedOwner{

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);
    event topUpWallet(uint256 value,address Address);
    event topUpGameWallet(uint256 value);
    event GameBalanceWithdraw(uint256 value);
    event WalletBalanceWithdraw(uint256 value);
    event GameResult(address Address,bool result);
    address public  malik;
    mapping (address=>uint256) public WalletBalance;
    uint256 public totalWalletBalance;
    uint256 public GameBalance=address(this).balance-totalWalletBalance;
   
    uint256 public s_requestId;
    uint256[] public s_randomWords;

    struct RequestStatus {
         bool fulfilled; // whether the request has been successfully fulfilled
         bool exists; // whether a requestId exists
         uint256[] randomWords;
         address player;
         bool didWin;
         uint256 gameAmount;
         uint256 cutAmount;
         uint256 choice;
         uint256 life;
    }
  
    struct gameStatus{
        bool didWin;
        uint256 lifes;
        uint256 moneyEarned;
        uint256 time;
    }
 
    mapping(address=>gameStatus[]) public personPublicProfile;
    mapping(uint256 => RequestStatus)  s_requests;
    mapping(address=>RequestStatus) public  PersonsProfile;
    
    VRFCoordinatorV2Interface COORDINATOR;

    //yOUR Subdcription Id

    uint64 s_subscriptionId;
    uint256[] public requestIds;
    uint256 public lastRequestId;
 
    bytes32 keyHash;
// 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c
    uint32 callbackGasLimit = 100000;

    uint16 requestConfirmations = 3;

    uint32 numWords = 1;

    // address vrfv2Cordinator=0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;

    constructor(uint64 subscriptionId,address vrfCoordinator,
        bytes32 keyhash)
    VRFConsumerBaseV2(vrfCoordinator)
    ConfirmedOwner(msg.sender){
        malik=msg.sender;
        COORDINATOR = VRFCoordinatorV2Interface(
            vrfCoordinator
        );
         keyHash = keyhash;

        s_subscriptionId = subscriptionId;
    }
    //Assume the subscription is funded suffieciently
    modifier ownerOnly(){
        require(msg.sender==malik,"Only owner of this contract can do this.");
        _;
    }
    function topUp() payable public{
        WalletBalance[msg.sender]+=msg.value;
        totalWalletBalance+=msg.value;
        GameBalance=address(this).balance-totalWalletBalance;
        emit topUpWallet(msg.value,msg.sender);
    }
    function topUpGameBalance()public payable ownerOnly{
        GameBalance+=msg.value;
        emit topUpGameWallet(msg.value);
    }
    
    function WithdrawGameBalance(uint256 amount)payable public ownerOnly{
        require(amount<=GameBalance,"Not enough money money is left in GameBalance");
        payable( msg.sender).transfer(amount);
        emit GameBalanceWithdraw(amount);
        GameBalance=GameBalance-amount;
    }

    function WithdrawWalletBalance(uint256 amount) payable public{
        require(amount<=WalletBalance[msg.sender],"Not enough baance in Wallet");
        payable(msg.sender).transfer(amount);
        WalletBalance[msg.sender]-=amount;
        
        emit WalletBalanceWithdraw(amount);
    }

    function returnStatement(uint num,uint randomNum) private pure returns(string memory){
        if(randomNum>num&&(randomNum-num)>=15){
            return "Number too large";
        }
        else if(randomNum>num&&(randomNum-num)<15){
            return "Number is large";
        }
        else if(randomNum<num&&(num-randomNum)>=15){
            return "Number too small";
        }
        else{
            return "Number is small";
        }
    }

    function playGame(uint256 amount) public {
        require(amount<=5000000000000000,"You get bet this much high Bid");
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[s_requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false,
            player:msg.sender,
            didWin:false,
            choice:0,
            life:5,
            gameAmount:amount*2,
            cutAmount:amount/5
            
        });
        WalletBalance[msg.sender]=WalletBalance[msg.sender] - amount;
        // console.log(amount);
        
        emit RequestSent(s_requestId, numWords);
        
        
   }
   
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        // console.log(_requestId) ;
        // RequestStatus[]  requestStatusArr;
        // requestStatusArr.push(s_requests[_requestId]);
        //  requestStatusArr;
        s_randomWords = _randomWords;

        address personsAddress=s_requests[_requestId].player;
        PersonsProfile[personsAddress]=s_requests[_requestId];
        
        emit RequestFulfilled(_requestId, _randomWords);
    }

    function choose(uint num) public returns(bool,uint,string memory) {
        require(PersonsProfile[msg.sender].didWin==false&&PersonsProfile[msg.sender].life>0,"Game Already Overed");
        uint randomWord=PersonsProfile[msg.sender].randomWords[0] ;
        uint randomNum=randomWord%20 + 1;
        if(randomNum==num){
            PersonsProfile[msg.sender].didWin=true;
            PersonsProfile[msg.sender].choice=num;
            WalletBalance[msg.sender]+= PersonsProfile[msg.sender].gameAmount;
            // gameStatus memory GameStatus=gameStatus({
            //     didWin:true,
            //     lifes:PersonsProfile[msg.sender][0].life,
            //     moneyEarned:PersonsProfile[msg.sender][0].gameAmount,
            //     time:block.timestamp
            // })
            personPublicProfile[msg.sender].push(gameStatus({
                didWin:true,
                lifes:PersonsProfile[msg.sender].life,
                moneyEarned:PersonsProfile[msg.sender].gameAmount,
                time:block.timestamp
            }));
           
            emit GameResult(msg.sender,true);
            return (true,num,"You Won!!");
        }
        else{
            if(PersonsProfile[msg.sender].life==1){
                PersonsProfile[msg.sender].life==0;
                GameBalance+=PersonsProfile[msg.sender].gameAmount-PersonsProfile[msg.sender].cutAmount;
                // gameStatus memory GameStatus=gameStatus({
                // didWin:false,
                // lifes:PersonsProfile[msg.sender][0].life,
                // moneyEarned:0,
                // time:block.timestamp
                // })
                personPublicProfile[msg.sender].push(gameStatus({
                didWin:false,
                lifes:PersonsProfile[msg.sender].life,
                moneyEarned:0,
                time:block.timestamp
                }));
                emit GameResult(msg.sender,false);

                return (false,num,"You Loose");
            }
            else{
                PersonsProfile[msg.sender].life--;
                PersonsProfile[msg.sender].gameAmount-=PersonsProfile[msg.sender].cutAmount;
                string memory str=returnStatement(num,randomNum);
                return (false,0,str);
            }
        }
    }
}