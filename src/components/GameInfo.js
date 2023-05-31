import React from 'react'
import { useState } from 'react'
import { ethers } from 'ethers'
const GameInfo = ({ gameBalance, setGameBalance, topUpGame, withDrawGame, gameAddress, GuessNum }) => {
    const [withDrawVal, setWithDrawVal] = useState("")
    const [topUpVal, setTopVal] = useState("")
    const gameBal = () => {
        let num = Number(gameBalance);
        num = num / (10 ** 18);
        return num;
    }
    const onChange = (e) => {
        setWithDrawVal(e.target.value)

    }

    const onChangeT = (e) => {
        setTopVal(e.target.value)
        console.log(e.target.value)
    }
    const onClickWithDrawHandler = async (e) => {

        let num = Number(withDrawVal)
        await withDrawGame(num)

    }
    const onClickTopUp = async () => {
        await topUpGame(topUpVal)
    }

    return (
        <div>
            <div className='d-flex flex-column mb-3 border'>
                <h1 class="h5">Game Info</h1>
                <div className="p-2">
                    <span>NumPy Address-</span>
                    <h className="fw-bold text-break">{gameAddress}</h>
                    <p className="text-md-star">Only the owner of the NumPy game can send or withdraw ethereum to the game Balance</p>

                </div>
                <div className="p-2">
                    <p className="fst-italic">Game Balance- </p>
                    <span className='btn btn-info'>{gameBal()} eth</span>
                </div>
                <div className="p2">
                <div className="input-group mb-3 py-2">
                        <input type="Number" className="form-control" placeholder="00.00 eth" aria-label="Recipient's username" aria-describedby="basic-addon2 " onChange={onChangeT}/>
                            <button className="btn btn-success" id="basic-addon2" onClick={onClickTopUp} >TopUp</button>
                    </div>
                    <div className="input-group mb-3 py-2">
                        <input type="Number" className="form-control" placeholder="00.00 eth" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={onChange}/>
                            <button className="btn btn-success" id="basic-addon2" onClick={onClickWithDrawHandler} disabled={Number(gameBalance)/(10**18)<withDrawVal}>WithDraw</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameInfo
