import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import detectEtherumProvider from '@metamask/detect-provider';
import {loadContract} from './utils/loadContract';

function App() {
  
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null);
  const [contractBalance, setContractBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [reload, shouldReload] = useState(false);

  const reloadEffect = () => shouldReload(!reload);

  useEffect(() =>{
 
    const loadProvider = async () =>{
    const provider = await detectEtherumProvider();  
    const contract = await loadContract('Funder', provider); 
    
    if(provider){              // provider = metamask detected.
      console.log(provider);
      provider.request({method:'eth_requestAccounts'}); // calling this method trigger a user interface(metamask) 
                                                        // that allow user to approve/reject account access for a dapp.      
      setWeb3Api({
        web3: new Web3(provider),
        provider,
        contract
      })
    }
    else{
      console.error('Please install metamask!');  // metamask not detected.
    }
      // if(window.ethereum){
      //   provider = window.ethereum;

      //   try{
      //     await provider.enable();
      //   }catch(err){
      //     console.log(err);
      //   }

      // }
      // else if(window.web3){
      //   provider = window.web3.currentProvider;
      // }
      // else if(!process.env.production){
      //   provider = new Web3.providers.HttpProvider('http://localhost:7545');
      // }

      
    }

    loadProvider();
   }, []);


  useEffect(() => {
    const getAccount = async () =>{
      const accounts = await web3Api.web3.eth.getAccounts();  // returns the list of accounts you can access.
      setAccount(accounts[0]);
    }
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);


  useEffect(() =>{
    const getBalance = async () =>{
      const {web3, contract} = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setContractBalance(web3.utils.fromWei(balance, 'ether'));
    }
    web3Api.contract && getBalance();
  }, [web3Api, reload]);

  useEffect(() =>{
    const getAccBal = async () =>{
      const AccountBalance = await web3Api.web3.eth.getBalance(account);
      setAccountBalance(web3Api.web3.utils.fromWei(AccountBalance, 'ether'));
    }
    getAccBal();
  }, [account, reload])

  const transferFund = async () =>{
    const {web3, contract} = web3Api;
    await contract.transfer({
      from: account,
      value: web3.utils.toWei('2', 'ether'),
    })
    reloadEffect();
  }

  const withdrawFund = async () =>{
    const {web3, contract} = web3Api;
    const withdrawAmount = web3.utils.toWei('2', 'ether');
    await contract.withdraw(withdrawAmount,{
      from: account
    })
    reloadEffect();
  }

  return (
    <>
      <div className="heading">
        Funding
      </div>

      <div className="content">
        <div><b>Contract Balance: {contractBalance} ETH</b></div>
        <br/>
        <div>Account: {account ? account : 'Not Connected'}</div>
        <br />
        <div>Account Balance: {accountBalance}</div>
      </div>
      <div className="btn-container">

        {/* <button className="bg-[#1cb11c] text-[#695b5b] px-3 py-2 m-1 rounded-md" 
                onClick={async () => { 
                  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                  console.log(accounts); 
        }}>
          Connect to metamask
        </button> */}
        <button className="t-btn" onClick={transferFund}>Transfer</button>
        <button className="w-btn" onClick={withdrawFund}>Withdraw</button>
      
      </div>  
         
    </>
  );
}

export default App;