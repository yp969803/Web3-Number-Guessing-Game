
import React, { useEffect } from 'react'
import { useAffect, useState } from 'react';
import { ethers } from 'ethers';
import GuessNumABI from './abis/GuessNum.json'
import './index.css'
import Navigation from './components/Navigation';
import GameInfo from './components/GameInfo';
import Alert from './components/Alert';
import PersonProfile from './components/PersonProfile';
import PlayGame from './components/PlayGame';
import Spinner from './components/Spinner';
import NumberChoosing from './components/NumberChoosing';
import PlayerTransactions from './components/PlayerTransactions';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  
} from "react-router-dom";
import GameTransaction from './components/GameTransaction';
import Rules from './components/Rules';
const App = () => {
  let [account, setAccount] = useState(null);
  let [GuessNum, setGuessNum] = useState(null)
  let [signer, setSigner] = useState(null)
  let [provider, setProvider] = useState(null)
  let [profile, setProfile] = useState([])
  let [toggle, setToggle] = useState(false)
  let [gameBalance, setGameBalance] = useState("")
  let [walletBalance, setWalletBalance] = useState(null)
  let [playSpin,setPlaySpin]=useState(false)
  let [alert,setAlert]=useState(null);
  let [money,setMoney]=useState(0.05)
  let [playGameWindow,setPlayGameWindow]=useState(true)
  let [pTopUp,setPTopUp]=useState([])
  let [pWithdraw,setPWithdraw]=useState([])
  let [gTopUp,setGTopUp]=useState([])
  let [gWithdraw,setGWithdraw]=useState([])
  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
  }
  
  const togglePop = (profile) => {
    setProfile(profile)
    toggle ? setToggle(false) : setToggle(true)
  }
 
  const loadBlockchainData = async () => {
    //  Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    let signerVar = await provider.getSigner()
    setSigner(signerVar)
    setProvider(provider)
    const network = await provider.getNetwork()
    let guessNum = new ethers.Contract("0x65a5Aea554C5CD1fc565dB3D85F40DA7ec965af4", GuessNumABI, provider)
    console.log(guessNum)
    setGuessNum(guessNum);
    if (account) {
      let profile = await guessNum.returnPersonProfile(account);
      let arrayForRev = [...profile]
      arrayForRev.reverse()
      profile=arrayForRev
      setProfile(profile)
      console.log(profile)
      const walBalance = await guessNum.WalletBalance(account);
      setWalletBalance(walBalance.toString())
    }
    console.log(await guessNum.malik())
    const gameBalance = await guessNum.GameBalance()
    console.log(gameBalance.toString())
    setGameBalance(gameBalance.toString());
    try {
      const topUpEvent = await guessNum.queryFilter('topUpWallet');
      const withdrawEvent=await guessNum.queryFilter('WalletBalanceWithdraw')
      const gameTopUpEvent=await guessNum.queryFilter("topUpGameWallet")
      const gameWithdrawEvent=await guessNum.queryFilter("GameBalanceWithdraw")
      // topUpEvent.wait()
     
      
      
      setPTopUp(topUpEvent)
      setPWithdraw(withdrawEvent)
      setGTopUp(gameTopUpEvent)

      setPTopUp(gameWithdrawEvent)
    } catch (e) {
      console.log(e)
    }
  }

  const topUpGame=async(value)=>{
    console.log(value)
     try{
      await  GuessNum.connect(signer).topUpGameBalance({value:tokens(value)});
     
      await  GuessNum.on("topUpGameWallet",(from,to,value,event)=>{
         console.log(from)
         setAlert({message:"Transaction Successfull",type:"success"})
         
     })
    
     
     }catch(e){
      console.log(e)
      setAlert({message:"Try Again?",type:"danger"})
      
     }
  }

  const withDrawGame=async(amount)=>{
    amount=amount*(10**18);
   try{
    await GuessNum.connect(signer).WithdrawGameBalance(amount);
   
    GuessNum.on("GameBalanceWithdraw",(from,to,value,event)=>{
     console.log(from)
     setAlert({message:"Transaction Successfull",type:"success"})
    })
  
    
   }catch(e){
    console.log(e)
    setAlert({message:"Try Again?",type:"danger"})

   }
  }
  const withDrawWallet=async(amount)=>{
    amount=amount*(10**18);
    try{
     await GuessNum.connect(signer).WithdrawWalletBalance(amount);
    
     GuessNum.on("WalletBalanceWithdraw",(from,to,value,event)=>{
      console.log(from)
      setAlert({message:"Transaction Successfull",type:"success"})
     })
   
     
    }catch(e){
     console.log(e)
     setAlert({message:"Try Again?",type:"danger"})
 
    }
  }
  const topUpWallet=async(value)=>{
    try{
      await  GuessNum.connect(signer).topUp({value:tokens(value)});
     
      await  GuessNum.on("topUpWallet",(from,to,value,event)=>{
         console.log(from)
         setAlert({message:"Transaction Successfull",type:"success"})
         
     })
    
     
     }catch(e){
      console.log(e)
      setAlert({message:"Try Again?",type:"danger"})
      
     }
  }
  const playGame=async(val)=>{
     val=Number(val)
     let num=val*(10**18)
    try{
      await GuessNum.connect(signer).playGame(num);
      GuessNum.on("RequestSent",(from,to,value,evnt)=>{
        setPlaySpin(false)
        setPlayGameWindow(false)
      })
       
    }catch(e){
      setPlaySpin(false)
      setAlert({message:"Try Again",type:"danger"})
      
      console.log(e)
    }
  }
  useEffect(() => {
    loadBlockchainData();
    setAlert({message:"Read rules of game before starting",type:"primary"})
    setPlaySpin(false)
    setPlayGameWindow(true)

  }, [account])

  return (
    <Router>
     <Switch>
      <Route  exact path='/' element={ <div>
      {/* <PlayerTransactions account={account} setAccount={setAccount} pTopUp={pTopUp} pWithdraw={pWithdraw}/> */}
      <Navigation account={account} setAccount={setAccount} />
      
      <h3 className='text-center py-2'>
        Welcome To NumPy-
        <small className="text-body-secondary">Guess And Win!!</small>
      </h3>
      <Alert alert={alert}/>
      <div className="container text-center">

        <div className="row">
          <div className="col-sm-4 border">
           <div className="container" style={{maxHeight:"530px",overflow:"auto"}}> 
           <div className="d-flex flex-column">
              
              <div className="p-2">
                <GameInfo gameBalance={gameBalance}  setGameBalance={setGameBalance} topUpGame={topUpGame} withDrawGame={withDrawGame} GuessNum={GuessNum} gameAddress="0x65a5Aea554C5CD1fc565dB3D85F40DA7ec965af4" signer={signer} setAlert={setAlert}/>

              </div>
              <div className="p-2">
                <PersonProfile profile={profile} walletBalance={walletBalance} account={account} withDrawWallet={withDrawWallet} topUpWallet={topUpWallet}/>
              </div>
             
            </div>
           </div>
          </div>
          <div className="col-sm-8 border">
           
           
            {playGameWindow? <PlayGame playGame={playGame} playSpin={playSpin} setPlaySpin={setPlaySpin} setMoney={setMoney} setPlayGameWindow={setPlayGameWindow} walletBalance={walletBalance}/>: <NumberChoosing money={money} GuessNum={GuessNum} signer={signer} setAlert={setAlert} setPlayGameWindow={setPlayGameWindow}/>}
            
          </div>
        </div>
      </div>


    </div>}/>
    <Route exact path="/playerTransaction" element={<PlayerTransactions account={account} setAccount={setAccount} pTopUp={pTopUp} pWithdraw={pWithdraw}/>}/>
    <Route exact path="/gameTransaction" element={<GameTransaction account={account} setAccount={setAccount} gTopUp={gTopUp} gWithdraw={gWithdraw}/>}/>
    <Route exact path="/rule" element={<Rules/>}  />
     </Switch>
    </Router>
  )
}

export default App

