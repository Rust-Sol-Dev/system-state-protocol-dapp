import React, { useEffect } from 'react'
import { useState } from 'react';
import { createContext } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding'
import { ethers } from 'ethers';


export const Web3WalletContext = createContext();

export default function MetamskConnect({ children }) {


  const [userConnected, setUserConnected] = useState(false);
  const [accountAddress, setAccountAddress] = useState(ethers.constants.AddressZero);
  const [WalletBalance, setWalletBalance] = useState('0');
  const [networkName, setNetworkName] = useState('')
  const [currencyName, setCurrencyName] = useState('')
  const onboarding = new MetaMaskOnboarding();

  // console.log('accountAddress........',accountAddress)
  const ProvidermetamaskLogin = async (e) => {
    if (typeof window?.ethereum !== "undefined") {
      getMetamaskAccount().then(async (response) => {
        if (response) {
          setUserConnected(true);
          setAccountAddress(response);
          getMetamaskBalance(response);
        }
      }).catch((err) => { });

    }
 

  }
  const disconnectUser = async () => {
    setAccountAddress('');
    setUserConnected(false);
    setNetworkName('');
    setWalletBalance('');
    setCurrencyName('')
  }


  const getMetamaskAccount = async () => {
    let metamaskAccounts;
    try {
      metamaskAccounts = await window?.ethereum?.request({
        method: "eth_requestAccounts",
      });
      // console.log(metamaskAccounts, "Metamask Account");
      if (window?.ethereum?.networkVersion == '943' || window?.ethereum?.networkVersion == '11155111' || window?.ethereum?.networkVersion == '5' || window?.ethereum?.networkVersion == '69' || window?.ethereum?.networkVersion == '80001') {
        return metamaskAccounts[0]
      } else {
        window.alert("Connect to Mumbai , Sepolia , Mumbai, Pulsechain")
        throw "Connect to Mumbai Network"
      }
      // let balance = await window.ethereum.metaMask.getBalanceOf(metamaskAccounts[0])
      // console.log(balance, "metamask");
      console.log(metamaskAccounts)
    } catch (error) {
      console.error(error, "hi")
      // eslint-disable-next-line
      if (error.code == -32002) {
        window.alert('Please Manually connnect to metamask')
      }
    }

  }

  const getMetamaskBalance = async (response) => {
    try {


      let balance = await window?.ethereum?.request({
        method: 'eth_getBalance',
        params: [await response, 'latest']
      }).then(balance => {
        // Return string value to convert it into int balance
        // console.log('Metamask Balance Hex Value', balance)
        // Yarn add ethers for using ethers utils or
        // npm install ethers
        // console.log('Metamask Balance Decimal value' ,ethers.utils.formatEther(balance))
        if (window?.ethereum?.networkVersion == '80001') {
          setWalletBalance(ethers?.utils?.formatEther(balance || '0'))
          setNetworkName('Polygon Mumbai')
          setCurrencyName(`MATIC`)
        }
        else if (window?.ethereum?.networkVersion == '5') {
          setWalletBalance(ethers?.utils?.formatEther(balance || '0'))
          setNetworkName('Goerli Testnet')
          setCurrencyName(`ETH`)
        }
        else if (window?.ethereum?.networkVersion == '11155111') {
          setWalletBalance(ethers?.utils?.formatEther(balance || '0'))
          setNetworkName('Sepolia Testnet')
          setCurrencyName(`ETH`)
        }
        else if (window?.ethereum?.networkVersion == '1') {
          setWalletBalance(ethers?.utils?.formatEther(balance || '0'))
          setNetworkName('Ethereum Mainnet')
          setCurrencyName(`ETH`)
        }
        else if (window?.ethereum?.networkVersion == '943') {
          setWalletBalance(ethers?.utils?.formatEther(balance || '0'))
          setNetworkName('Pulsechain Testnet')
          setCurrencyName(`PLS`)
        }

      }).catch(err => { })
    } catch (error) {

    }

  }

  return (
    <>
      <Web3WalletContext.Provider value={{
        example: 'example',
        userConnected,
        accountAddress,
        networkName,
        WalletBalance,
        currencyName,
        ProvidermetamaskLogin,
        disconnectUser,
        getMetamaskAccount,
      }} >
        {children}
      </Web3WalletContext.Provider>
    </>
  )
}
