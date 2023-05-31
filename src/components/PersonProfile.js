import React from 'react'
import { useState, useEffect } from 'react'
import GameStatus from './GameStatus'
const PersonProfile = ({ profile, walletBalance, account, withDrawWallet, topUpWallet }) => {
    let [topUpVal, setTopUp] = useState("")
    let [withdrawVal, setWithDrawVal] = useState("")
    const onChangeT = async (e) => {
        setTopUp(e.target.value)
    }
    const onChangeW = async (e) => {
        setWithDrawVal(e.target.value);
    }
    const walBal = () => {
        let num = Number(walletBalance)
        num = num / (10 ** 18)
        return num;
    }
    const onClickTopUp = async () => {
        await topUpWallet(topUpVal)
    }
    const onClickWithDrawHandler = async () => {
        let num = Number(withdrawVal)
        await withDrawWallet(num)
    }
    
    return (

        <div className='d-flex flex-column mb-3 border '>
            <h1 class="h5">Persons Profile</h1>
            <div className="p-2">
                <span>Player Address-</span>
                <h className="fw-bold">{account ? account.slice(0, 6) + '...' + account.slice(38, 42) : "..."}</h>
               
                <div className="container py-2">
                    <p2 className="fst-italic">Wallet Balance- </p2>
                    <p className='btn btn-info'> {walBal()} eth</p>
                </div>
            </div>
            <div className='p-2'>

                <div className="input-group mb-3 py-2">
                    <input type="Number" className="form-control" placeholder="00.00 eth" aria-label="Recipient's username" aria-describedby="basic-addon2 " onChange={onChangeT} />
                    <button className="btn btn-success" id="basic-addon2" onClick={onClickTopUp}>TopUp</button>
                </div>
                <div className="input-group mb-3 py-2">
                    <input type="Number" className="form-control" placeholder="00.00 eth" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={onChangeW} />
                    <button className="btn btn-success" id="basic-addon2" onClick={onClickWithDrawHandler} disabled={Number(walletBalance)/(10**18)<withdrawVal}>WithDraw</button>
                </div>
            </div>

            <div className="p-2">
                <p className='h5'>Previous Games-</p>
                <div className="container">
                    {profile.map((element) => {
                        return <div className="container">
                            <GameStatus didWin={element.didWin} lifes={Number(element.lifes.toString()) - 1} moneyEarned={Number(element.moneyEarned.toString()) / (10 ** 18)} time={element.time.toString()} />
                        </div>
                        //   return <GameStatus didWin={element.didWin} lifes={element.lifes} moneyEarned={element.moneyEarned} time={element.time}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default PersonProfile
