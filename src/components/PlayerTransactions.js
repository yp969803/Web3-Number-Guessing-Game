import React from 'react'

import { useState, useEffect } from 'react'
import Navigation from './Navigation'
import { ethers } from 'ethers'
import TabbleContent from './TabbleContent'
const PlayerTransactions = ({ account, setAccount,pTopUp,pWithdraw }) => {

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h1 class="display-6 text-center">Player Transactions</h1>
      <div class="container my-3">
        <div class="row">
          <div class="col border">
          <h1 class="display-6 text-center">Wallet TopUps</h1>
          <div className="container">
            {pTopUp.map((e)=>{
              let str=e.args.value
              // return <TabbleContent val={str}/>
              str=Number(str.toString())/(10**18)
              console.log(str)
              return <div className="container">
                <TabbleContent val={str}/>
              </div>
            })}
          </div>
          </div>
          <div class="col border">
          <h1 class="display-6 text-center">Wallet WithDraw</h1>
          <div className="container">
            {pWithdraw.map((e)=>{
              let str=e.args.value
              
              str=Number(str.toString())/(10**18)
              console.log(str)
              return <div className="container">
                <TabbleContent val={str}/>
              </div>
            })}
          </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default PlayerTransactions
