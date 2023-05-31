import React from 'react'
import { useState, useEffect } from 'react'
import Spinner from './Spinner'
const PlayGame = ({ playGame, playSpin, setPlaySpin ,setMoney,walletBalance}) => {
    let [bet, setBet] = useState(0.0005)
    let onPlay = async () => {
        setMoney(bet)
        await playGame(bet)
        setPlaySpin(true)
    }
    if(playSpin){
        return <Spinner message="Initialing Setup"/>
    }
    return (

        < div className = 'container' >
    <h1 class="display-4 my-2">Lets Start</h1>

    <div className="container py-4">
        <h1 class="display-6">Choose the bet!! Choose big Win big</h1>
        <button type="button mx-2 my-2 px-2 py-2" class="btn btn-outline-primary" disabled={Number(walletBalance)/(10**18)<0.05} onClick={()=>{setBet(0.05)}}>0.05 eth</button>
        <button type="button mx-2 my-2 px-2 py-2" class="btn btn-outline-secondary" disabled={Number(walletBalance)/(10**18)<0.005} onClick={()=>{setBet(0.005)}}>0.005 eth</button>
        <button type="button mx-2 my-2 px-2 py-2" class="btn btn-outline-success"  disabled={Number(walletBalance)/(10**18)<0.0005} onClick={()=>{setBet(0.0005)}}>0.0005 eth</button>
        <button type="button mx-2 my-2 px-2 py-2" class="btn btn-outline-danger" disabled={Number(walletBalance)/(10**18)<0.0005}  onClick={()=>{setBet(0.00005)}}>0.00005 eth</button>

    </div>
    <h5 className='mx-3'>{bet} eth</h5>
    <button type="button" class="btn btn-success" disabled={bet==0&&bet>Number(walletBalance)/(10**18)} onClick={onPlay}>PLAY</button>
</div >
    )
}

export default PlayGame
