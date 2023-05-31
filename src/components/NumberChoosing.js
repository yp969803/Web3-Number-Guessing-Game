import React from 'react'
import { useState, useEffect } from 'react'
import Spinner from './Spinner'
const NumberChoosing = ({ money, GuessNum, signer, setAlert, setPlayGameWindow }) => {
    let [num, setNum] = useState(1)
    let [lifes, setLifes] = useState(6)
    let [guide, setGuide] = useState("")
    let [fres, setFres] = useState(null)
    let [fnum, setFnum] = useState(0)
    let [spin, setSpin] = useState(false)
    let [onProgress, setProgress] = useState(false)
    let [res, setRes] = useState(null)
    const afterChoosing = async () => {

        try {
            let tx = await GuessNum.connect(signer).choose(num)
            setSpin(true)
            tx.wait()


            GuessNum.on("chooseEvent", (from, to, value, about) => {
                setSpin(false)
                console.log(value.args)
                console.log(value.args.res)
                console.log(value.args.status)
                setRes(value.args.res)
                setGuide(value.args.status)
                console.log(res)
                console.log(guide)
                if (!res) {
                    setLifes(lifes - 1)
                }
            })

            GuessNum.on("GameResult", (from, to, value, event) => {
                
                console.log(value, "hello")
                if (value.args.result == true) {
                    setAlert({ message: "Congratulation you Won!!", type: "Success" })
                    setProgress(true)
                    
                    setFres(res)
                    const myTimeout = setTimeout(() => {
                        setPlayGameWindow(true)
                    }, 5000);
                }
                else if (value.args.result == false) {
                    setAlert({ message: "You Loose!!", type: "danger" })
                    setProgress(true)
                    setFres(false)
                    const myTimeout = setTimeout(() => {
                        setPlayGameWindow(true)
                    }, 3000);
                }
            })
            

        }
        catch (e) {
            console.log(e)
            setAlert({ message: "This Game Already overed or some error occured", type: "danger" })
            setSpin(false)
        }

    }
    return (
        <div>

            <h1 class="display-6 py-2">Guess the number from 1 to 20</h1>
            <div class="container py-3 border">
                <div class="row">
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(1) }}>1</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(2) }}>2</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(3) }}>3</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(4) }}>4</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(5) }}>5</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(6) }}>6</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(7) }}>7</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(8) }}>8</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(9) }}>9</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(10) }}>10</button>
                    </div>

                </div>
                <div className="row">
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(11) }}>11</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(12) }}>12</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(13) }}>13</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(14) }}>14</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(15) }}>15</button>
                    </div>
                </div>
                <div className="row">
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(16) }}>16</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(17) }}>17</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(18) }}>18</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(19) }}>19</button>
                    </div>
                    <div class="col my-2">
                        <button type="button" class="btn btn-primary" onClick={() => { setNum(20) }}>20</button>
                    </div>
                </div>

            </div>

            <p>Number Choosed-{num}</p>
            {spin ? <Spinner message="Loading" /> : <div className="container">
                <p className="fst-italic">Lifes Left-{lifes} | Bet-{money} eth | Money Left To Win-{((2 * money) / 5) * lifes} eth</p>
                {!onProgress ? <p className="fst-italic">{guide == "" ? "" : "Actual " + guide + " from your guessed number"}</p> : <p className="fst-italic">{guide + "Correct num is-" + fnum}</p>}
                <button type="button" class="btn btn-success" onClick={afterChoosing}>Enter</button>
            </div>}

        </div>
    )
}

export default NumberChoosing
