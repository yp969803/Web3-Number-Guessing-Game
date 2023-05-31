import React from 'react'

const Rules = () => {
  return (
    <div>
      <div className="container">
      <h1 class="display-4">Rules and Guide</h1>
      <div className="container">
         <h3 className='h3 my-2'>1. Should have matamask and metamask browser extension</h3>
         <h3 className="h3 my-2">2. Should have sepolia ethers.Connect to sepolia account</h3>
         <h3 className="h3 my-2">3. Top-up your wallet balance.You can withdraw your money anytime.</h3>
         <h3 className="h3 my-2">4. Choose your bet</h3>
         <h3 className="h3 my-2">5. Maximum winning amount is twice the bet.</h3>
         <h3 className="h3 my-2">6. You have to guess the computer generated random number which is from 1 to 20.</h3>
         <h3 className='h3 my-2'>7. You will get 6 chances.After every wrong guess winning amonut is decreased by 20% of maximum winning amount.</h3>
         <h3 className="h3 my-2">8. You will get hints after every guess.Too large or too small means difference is greater than or equal 15</h3>
      </div>
      </div>

    </div>
  )
}

export default Rules
