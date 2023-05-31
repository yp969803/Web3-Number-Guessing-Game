import { ethers } from 'ethers'

import React from 'react'
import { Link } from 'react-router-dom'
const Navigation = ({account,setAccount}) => {
    const connectHandler=async()=>{
        const accounts=await window.ethereum.request({method:'eth_requestAccounts'});
        console.log(accounts,"upsc")
        const account= ethers.utils.getAddress(accounts[0]);  
        setAccount(account);
        console.log(account)
        console.log("Loading...")
    }
  return (
   
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">NumPy</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/rule">Rules</Link>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/playerTransaction">PlayerTransactios</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/gameTransaction">NumpyTransactions</a>
        </li>
        
      
      </ul>
     
      {account?(<button type="button" className="btn btn-outline-success">
            {account.slice(0,6)+'...'+account.slice(38,42)}
         </button>):<button type="button" className="btn btn-outline-success" onClick={connectHandler}>
            Connect</button>}
    </div>
  </div>
</nav>
    
  )
}

export default Navigation
