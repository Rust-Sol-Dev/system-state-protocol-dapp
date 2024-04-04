import React, { createContext, useContext, useEffect, useState } from 'react'
import PSD_ABI_UP from '../Utils/ABI/PSD_ABI_UP.json'
import STATE_TOKEN_ABI_UP from '../Utils/ABI/STATE_TOKEN_ABI_UP.json'
import { PSD_ADDRESS, STATE_TOKEN_ADDRES, allInOnePopup } from './ADDRESSES/Addresses';
import { Web3WalletContext } from './MetamskConnect';
import { BigNumber, ethers } from 'ethers';
export const functionsContext = createContext();

export default function Functions({ children }) {
    const { ProvidermetamaskLogin, userConnected, accountAddress, WalletBalance, networkName, currencyName } = useContext(Web3WalletContext)
    const [socket, setSocket] = useState(false);
    const [reward, setReward] = useState('0')
    const [depositedAmount, setDepositedAmount] = useState('0')

    const getProvider = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            return provider;
        } catch (error) {
            console.error('getProvider error:', error);
        }
    }
    const getPsdContract = async () => {
        try {
            const provider = await getProvider();
            const signer = provider.getSigner();
            const psd_contract = new ethers.Contract(PSD_ADDRESS, PSD_ABI_UP, signer);

            return psd_contract;
        } catch (error) {
            console.error('getPsdContract:', error);
        }
    }
    const getParseEther = async (amount) => {
        try {
            amount = amount.replace(/,/g, '')
            const value = ethers.utils.parseEther(amount || '0').toString()
            console.log('getParseEther', amount, ' ', value)
            return value;
        } catch (error) {
            console.error('getParseEther:', error);
        }
    }
    const getFormatEther = async (amount) => {
        try {
            const value = ethers.utils.formatEther(amount || '0').toString()
            return value;
        } catch (error) {
            console.error('getFormatEther error:', error);
        }
    }
    const getPrice = async () => {
        try {
            const contract = await getPsdContract()
            const price = await contract?.price();
            const priceInStr = await price?.toString()
            return priceInStr
        } catch (error) {
            console.error('getPrice error:', error);
        }
    }
  

    const getTimeStampForCreateValut = async () => {
        try {
            const contract = await getPsdContract();

            if (!contract) {
                console.error('Contract not available.');
                return; // Or handle the absence of the contract instance.
            }
            const daysTimeStamp = await contract.Deployed_Time();
            const timestampInSeconds = daysTimeStamp;
            const timestampInMilliseconds = timestampInSeconds * 1000;
            const currentTimeInMilliseconds = Date.now();
            const timeDifferenceInMilliseconds = currentTimeInMilliseconds - timestampInMilliseconds;
            const daysDifference = timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000);
            const netValue = Math.ceil(daysDifference)
            return netValue;

        } catch (error) {
            console.error('getTimeStampForCreateValut:', error);
        }
    }


    const getTotalNumberOfReward = async () => {
        const contract = await getPsdContract();
        try {

            const profit = await contract?.percentProfit();
            const bigNumber = ethers.utils.formatEther(profit);

            // Convert BigNumber to JavaScript number
            setReward(bigNumber)
            return Number(bigNumber)
        } catch (err) {
            console.log(err)
        }
    }
    const getUserUsdValue = async (amount) => {
        try {
            let price = await getPrice();
            let formattedPrice = await ethers.utils.formatEther(price)
            let userUsdValue = await (Number(amount) * Number(formattedPrice))
            return userUsdValue
        } catch (error) {
            console.error('getUserUsdValue error:', error);
        }
    }
    const handleDeposit = async (amount) => {
        console.log('amountx:', amount);
        // let userUsdValue = await getUserUsdValue(amount)
        // if (Number(amount) == '' || userUsdValue <= 1) {
        //     // allInOnePopup(`warning`, `Invalid input`, `Please enter amount is greater then 1 dollar.`, `OK`, true)
        //     allInOnePopup(null, `Please enter amount is greater then 1 dollar.`, null, `OK`, null)
        //     return
        // };
        try {
            // allInOnePopup(null, 'Connecting...', 'Please wait for Depositing.', `OK`, null)
            allInOnePopup(null, 'Processing Deposit', null, `OK`, null)
            const parsedAmount = await getParseEther(amount);
            let contract = await getPsdContract();
            let depositTx = await contract.deposit({
                value: parsedAmount
            })
            await depositTx.wait();
            // allInOnePopup(`success`, `Successful Deposit`, null, `OK`, true)
            allInOnePopup(null, 'Successful Deposit', null, `OK`, null)
            console.log('depositTx:', depositTx);
            setSocket(prevBool => !prevBool);
            return true
        } catch (error) {
            // allInOnePopup(`error`, `Error`, `An error occurred. Please try again.`, `OK`, true);
            allInOnePopup(null, 'An error occurred. Please try again.', null, `OK`, null)
            console.error('handleDeposit error:', error);
        }
    }
    const handle_Claim_IPT_and_RPT = async (address) => {
        if (address) {
            let bucketBalance = await getToBeClaimed(address)
            let formattedValue = await getFormatEther(bucketBalance)
            if (0 >= Number(formattedValue)) {
                // allInOnePopup(`info`, `Insufficient Balance`, `You don't have balance in "IPT and RPT".`, `OK`, true)
                allInOnePopup(null, 'Insufficient Balance', null, `OK`, null)
                return
            }
            allInOnePopup(null, 'Processing Claim', null, `OK`, null)
            try {
                let contract = await getPsdContract()
                let withdrawBucketTx = await contract?.WithdrawBucket();
                await withdrawBucketTx.wait()
                // allInOnePopup(`success`, `Successful Claimed`, null, `OK`, true)
                allInOnePopup(null, 'Successful Claimed', null, `OK`, null)
                console.log('withdrawBucketTx:', withdrawBucketTx);
                setSocket(prevBool => !prevBool);
            } catch (error) {
                // allInOnePopup(`error`, `Error`, `An error occurred. Please try again.`, `OK`, true);
                allInOnePopup(null, 'An error occurred. Please try again.', null, `OK`, null)
                console.error('handle_Claim_IPT_and_RPT error:', error);
            }
        }
    }
    const getProtocolFee = async (address) => {
        if (address) {
            try {
                let contract = await getPsdContract()
                let protocolFee = await contract.getProtocolFee(address)
                let protocolAmount = await protocolFee?.protocolAmount
                let formattedValue = await getFormatEther(protocolAmount)
                let holdTokens = await protocolFee?.holdTokens
                let formatted_holdTokens = await getFormatEther(holdTokens)
                return { protocolAmount: Number(formattedValue), holdTokens: Number(formatted_holdTokens) }
            } catch (error) {
                console.error('getProtocolFee error:', error);
            }
        }
    }

    const handle_Claim_Protocol_Fee = async (address) => {
        if (address) {
            let contract = await getPsdContract()
            let protocolFee = await contract.getProtocolFee(address)
            let protocolAmount = await protocolFee?.protocolAmount
            let formattedValue = await getFormatEther(protocolAmount)
            console.log('protocol fee:', Number(formattedValue));

            if (0 >= Number(formattedValue)) {
                // allInOnePopup(`info`, `Insufficient Balance`, `You don't have protocol fee for claim.`, `OK`, true)
                allInOnePopup(null, `You don't have protocol fee for claim.`, null, `OK`, null)
                return
            }
            allInOnePopup(null, 'Processing Claim', null, `OK`, null)

            try {
                let claimProtocolFee = await contract.claimProtoColFees();
                await claimProtocolFee.wait()
                // allInOnePopup(`success`, `Successful Claimed`, null, `OK`, true)
                allInOnePopup(null, `Successful Claimed`, null, `OK`, null)
                console.log('claimProtocolFee:', claimProtocolFee);
                setSocket(prevBool => !prevBool);
            } catch (error) {
                // allInOnePopup(`error`, `Error`, `An error occurred. Please try again.`, `OK`, true);
                allInOnePopup(null, `An error occurred. Please try again.`, null, `OK`, null)
                console.error('handle_Claim_Protocol_Fee error:', error);
            }
        }
    }

    const getParityReached = async (address) => {
        if (address) {
            try {
                // let ParityShareTokensDetail = await getParityDollarClaimed(address)
                // let parityAmount = ParityShareTokensDetail?.parityAmount
                // let ParityAmountFormatted = await getFormatEther(parityAmount)
                // let parityAmountInNumer = Number(ParityAmountFormatted)

                let PST_Deposit = await getParityTokensDeposits(accountAddress)
                let PST_Deposit_formatted = ethers.utils.formatEther(PST_Deposit || '0')
                let PST_DepositInNumber = Number(PST_Deposit_formatted)

                let ParityAmountDistributed = await getParityAmountDistributed(accountAddress)
                let ParityAmountDistributed_formatted = await getFormatEther(ParityAmountDistributed || '0')
                let ParityAmountDistributed_InNumer = Number(ParityAmountDistributed_formatted)

                let isParityReached = PST_DepositInNumber - ParityAmountDistributed_InNumer

                // console.log({
                //     PST_DepositInNumber: PST_DepositInNumber,
                //     ParityAmountDistributed_InNumer: ParityAmountDistributed_InNumer,
                //     isParityReached: isParityReached
                // });

                if ((isParityReached == 0 || isParityReached < 0) && (PST_DepositInNumber > 0)) {
                    return true
                }
                else {
                    return false
                }

            } catch (error) {
                console.error('getParityReached error:', error);
            }
        }
    }

    const handle_Claim_Parity_Tokens = async (address) => {
        if (address) {
            try {
                let ParityShareTokensDetail = await getParityDollarClaimed(address)
                let parityClaimableAmount = ParityShareTokensDetail?.parityClaimableAmount
                let parityClaimableAmountFormatted = await getFormatEther(parityClaimableAmount)

                if (0 >= Number(parityClaimableAmountFormatted)) {
                    // allInOnePopup(`info`, `Insufficient Balance`, `You don't have parity tokens for claim.`, `OK`, true)
                    allInOnePopup(null, `You don't have parity tokens for claim.`, null, `OK`, null)
                    return
                }
                // allInOnePopup(null, 'Processing Claim', `Please wait for Claiming Parity Tokens : ${parityClaimableAmountFormatted + ' ' + currencyName}. `, `OK`, null)
                allInOnePopup(null, 'Processing Claim', null, `OK`, null)
                let contract = await getPsdContract()
                let claimParityAmount_Tx = await contract.claimParityAmount()
                await claimParityAmount_Tx.wait()
                // allInOnePopup(`success`, `Successful Claimed`, null, `OK`, true)
                allInOnePopup(null, `Successful Claimed`, null, `OK`, null)
                console.log('claimParityAmount_Tx', claimParityAmount_Tx);
                setSocket(prevBool => !prevBool);

            } catch (error) {
                // allInOnePopup(`error`, `Error`, `An error occurred. Please try again.`, `OK`, true);
                allInOnePopup(null, `An error occurred. Please try again.`, null, `OK`, null)
                console.error('handle_Claim_Parity_Tokens Error: ', error);
            }
        }
    }
    const handle_Claim_All_Reward_Amount = async (address) => {
        if (address) {
            try {
                let userBucketBalance = await getToBeClaimed(accountAddress)
                let formattedToBeClaimed = await getFormatEther(userBucketBalance || '0')

                let ParityShareTokensDetail = await getParityDollarClaimed(accountAddress)
                let parityClaimableAmount = ParityShareTokensDetail?.parityClaimableAmount
                let parityClaimableAmountFormatted = await getFormatEther(parityClaimableAmount)

                let protocolFee = await getProtocolFee(accountAddress);
                let protocolAmount = await protocolFee?.protocolAmount

                let AllFee = Number(formattedToBeClaimed) + Number(parityClaimableAmountFormatted) + Number(protocolAmount)
                let fixed = AllFee.toFixed(4)
                if (0 >= Number(fixed)) {
                    allInOnePopup(null, `You don't have any reward for claim.`, null, `OK`, null)
                    return
                }
                allInOnePopup(null, 'Processing Claim', null, `OK`, null)
                let contract = await getPsdContract()

                let claimAllRewardAmount_Tx = await contract.claimAllReward()
                await claimAllRewardAmount_Tx.wait()
                allInOnePopup(null, `Successful Claimed`, null, `OK`, null)
                console.log('claimParityAmount_Tx', claimAllRewardAmount_Tx);
                setSocket(prevBool => !prevBool);

            } catch (error) {
                allInOnePopup(null, `An error occurred. Please try again.`, null, `OK`, null)
                console.error('handle_Claim_All_Reward_Amount Error: ', error);
            }
        }
    }
    const getToBeClaimed = async (accountAddress) => {
        try {
            if (accountAddress) {
                let contract = await getPsdContract()
                let userBucketBalance = await contract.userBucketBalances(accountAddress)
                let BucketInStr = await userBucketBalance.toString()
                return BucketInStr
            }
        } catch (error) {
            console.error('getToBeClaimed error:', error);
        }
    }
    const getTotalValueLockedInDollar = async () => {
        try {
            let contract = await getPsdContract()
            // let getTotalPsdShare = await contract.getTotalPsdShare()
            // let getTotalPsdShare = await contract.getActualTotalPsdShare()
            let contractBalance_Matic = await contract.getContractBalance()
            let contractBalance_Matic_Str = contractBalance_Matic?.toString()
            let contractBalanceUsdValue = await getUserUsdValue(contractBalance_Matic_Str || '0')
            let getTotalPsdShareInStr = await contractBalanceUsdValue.toString()
            return getTotalPsdShareInStr
        } catch (error) {
            console.error('getTotalValueLockedInDollar error:', error);
        }
    }
    const getParityDollardeposits = async (address) => {
        try {
            if (address) {
                let contract = await getPsdContract()
                // let PSD_Share_This_User = await contract.PSDdistributionPercentageMapping(address)
                let PSD_Share_This_User = await contract.PSDSharePerUser(address)
                let PSD_Share_This_User_InStr = await PSD_Share_This_User.toString()
                return PSD_Share_This_User_InStr
            }
        } catch (error) {
            console.error('getParityDollardeposits error:', error);
        }
    }
    const getParityTokensDeposits = async (address) => {
        try {
            if (address) {
                let contract = await getPsdContract()
                // let PST_Share_This_User = await contract.PSTdistributionPercentageMapping(address)
                let PST_Share_This_User = await contract.PSTSharePerUser(address)
                let PST_Share_This_User_InStr = await PST_Share_This_User.toString()
                return PST_Share_This_User_InStr
            }
        } catch (error) {
            console.error('getParityTokensDeposits error:', error);
        }
    }
    const getParityAmountDistributed = async (address) => {
        try {
            if (address) {
                let contract = await getPsdContract()
                let ParityAmountDistributed = await contract.getParityAmountDistributed(address)
                let ParityAmountDistributed_InStr = await ParityAmountDistributed.toString()
                return ParityAmountDistributed_InStr;
            }
        } catch (error) {
            console.log('getParityAmountDistributed error: ', error);
        }

    }
    const get_PSD_Claimed = async (address) => {
        try {
            if (address) {
                let contract = await getPsdContract()
                let PSD_Claimed_This_User = await contract.getPSDClaimed(address)
                let PSD_Claimed_This_User_InStr = await PSD_Claimed_This_User.toString()
                return PSD_Claimed_This_User_InStr
            }
        } catch (error) {
            console.error('get_PSD_Claimed error:', error);
        }
    }
    const get_PST_Claimed = async (address) => {
        try {
            if (address) {
                let contract = await getPsdContract()
                let PST_Claimed_This_User = await contract?.getPSTClaimed(address)
                let PST_Claimed_This_User_InStr = await PST_Claimed_This_User.toString()
                return PST_Claimed_This_User_InStr
            }
        } catch (error) {
            console.error('get_PST_Claimed error:', error);
        }
    }
    // unused
    const getParityDollarClaimed = async (address) => {
        // address = accountAddress
        try {
            if (address) {
                let contract = await getPsdContract()
                let ParityShareTokensDetail = await contract.getParityShareTokensDetail(address)
                let parityAmount = await ParityShareTokensDetail.parityAmount.toString()
                let claimableAmount = await ParityShareTokensDetail.claimableAmount.toString()
                return { parityAmount: parityAmount, parityClaimableAmount: claimableAmount }
            }
        } catch (error) {
            console.error('getParityDollarClaimed error:', error);
        }
    }

    const getRatioPriceTargets = async (address) => {
        try {
            if (address) {
                let contract = await getPsdContract()
                let getTargets = await contract.getTargets(address)
                return getTargets
            }
        } catch (error) {
            console.error('getRatioPriceTargets error:', error);
        }
    }

    const getIncrementPriceTargets = async (address) => {
        try {
            if (address) {
                let contract = await getPsdContract()
                let getIncrementPriceTarget = await contract.getEscrowDetails(address)
                return getIncrementPriceTarget
            }
        } catch (error) {
            console.error('getIncrementPriceTargets error:', error);
        }
    }





    // Buy State tokens functions 

    const getStateTokenContract = async () => {
        try {
            const provider = await getProvider();
            const signer = provider.getSigner();
            const State_Token_Contract = new ethers.Contract(STATE_TOKEN_ADDRES, STATE_TOKEN_ABI_UP, signer);
            return State_Token_Contract;
        } catch (error) {
            console.error('getStateTokenContract error:', error);
        }
    }

    const handle_Buy_State_Token = async (address, amount) => {
        if (address) {
            try {
                const parsedAmount = await getParseEther(amount)
                if (parsedAmount === undefined) {
                    allInOnePopup(null, 'Please Enter Valid Amount', null, `OK`, null)
                    return;
                }
                // let userUsdValue = await getUserUsdValue(amount)
                // if (Number(amount) == '' || userUsdValue <= 1) {
                //     // allInOnePopup(`warning`, `Invalid input`, `Please enter amount is greater then 1 dollar.`, `OK`, true)
                //     allInOnePopup(null, `Please enter amount is greater then 1 dollar.`, null, `OK`, null)
                //     return
                // };
                console.log('parsedAmount12', parsedAmount)
                let contract = await getStateTokenContract()
                allInOnePopup(null, 'Processing Deposit', null, `OK`, null)
                // allInOnePopup(null, 'Processing Deposit', `Please wait for Buy State Tokens.`, `OK`, null)
                let inscribeTx = await contract.inscribe({
                    value: parsedAmount
                })
                await inscribeTx.wait()
                console.log('inscribeTx: ', inscribeTx);
                // allInOnePopup(`success`, `Successful Buy.`, `Operation has been completed successfully.`, `OK`, true)
                allInOnePopup(null, `Successful inscribed.`, null, `OK`, null)
                setSocket(prevBool => !prevBool);
                return true
            } catch (error) {
                console.error('handle_Buy_State_Token error:', error);
                // allInOnePopup(`error`, `Error`, `An error occurred. Please try again.`, `OK`, true);
                allInOnePopup(null, `Transaction Reverted, Please Try Again.`, null, `OK`, null)
            }
        }
    }
    const addTokenToMetaMask = async (tokenAddress, tokenSymbol, decimals) => {
        try {
            // Request MetaMask to add the token
            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: decimals,
                    },
                },
            });
            // allInOnePopup(`success`, `Successful Added.`, `Your token has been added to MetaMask successfully.`, `OK`, true)
            allInOnePopup(null, `Your token has been added to MetaMask successfully.`, null, `OK`, null)
            console.log('Token added to MetaMask successfully!');
            setSocket(prevBool => !prevBool);
        } catch (error) {
            console.error('Error adding token to MetaMask:', error);
            // allInOnePopup(`error`, `Error`, `An error occurred. Please try again.`, `OK`, true);
            allInOnePopup(null, `An error occurred. Please try again.`, null, `OK`, null)
        }
    };
    const getUsdcSpendOnInscription = async (address) => {
        if (address) {
            try {
                let contract = await getStateTokenContract()
                let getUsdcSpendOnInscription = await contract.getUsdcSpendOnInscription(address)
                let value_In_Str = getUsdcSpendOnInscription.toString()
                let formatted_Value = await getFormatEther(value_In_Str)
                return Number(formatted_Value)
            } catch (error) {
                console.error('getUsdcSpendOnInscription error:', error);
            }
        }
    }

    const getClaimX1Refund = async () => {
        const contract = await getStateTokenContract();
        const claim = await contract?.totalSupply;

    }
    
    const getStateTokenHolding = async (address) => {
        if (address) {
            try {
                let contract = await getStateTokenContract()
                let balanceOf = await contract.balanceOf(address)
                let balanceOf_InStr = balanceOf.toString()
                let formatted_balanceOf = await getFormatEther(balanceOf_InStr)

                let totalSelledToken = await contract.getTotalSelledTokens()
                let totalSelledToken_InStr = await totalSelledToken.toString()
                let formatted_totalSelledTokens = await getFormatEther(totalSelledToken_InStr)

                let percentage = (Number(formatted_balanceOf) * 100) / Number(formatted_totalSelledTokens)
                let tokenHolds = Number(formatted_balanceOf)
                return { tokenHolds: tokenHolds, percentage: percentage }
            } catch (error) {
                console.error('getStateTokenHolding error:', error);
            }
        }
    }

    const getDepositors = async () => {
        try {
            let contract = await getPsdContract()
            let Depositors_Address = await contract.getDepositors()
            return Depositors_Address || []
        } catch (error) {
            console.error('getDepositors error:', error);
        }
    }

    const getTotalSupply = async () => {
        const contract = await getStateTokenContract();
        try {
            if (!contract) {
                console.error('Contract not available.');
                return;
            }
            // const contract = await getPsdContract();
            const supply = await contract.totalSupply();
            return supply;

        } catch (err) {
            console.log('totalSupply :', err)
        }

    }

    const getCeateVaultTime = async () => {
        const contract = await getStateTokenContract();
        try {
            if (!contract) {
                console.error('Contract not available.');
                return;
            }
            const timeInSecond = await contract?.Deployed_Time();
            const timestampInMilliseconds = timeInSecond * 1000;
            const currentTimeInMilliseconds = Date.now();
            const timeDifferenceInMilliseconds = currentTimeInMilliseconds - timestampInMilliseconds;
            const daysDifference = timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000);

            return Math.ceil(daysDifference);

        } catch (err) {
            console.log('DeployTime', err)
        }
    }

    const getX1allocationClaimableBucket = async (address) => {
        const contract = await getStateTokenContract();
        try {
            const claimX1 = await contract?.X1allocationClaimableBucket(address);
            return claimX1;

        } catch (error) {
            console.error('X1allocationClaimableBucket :', error)
        }
    }

    const getX1allocationBucket = async (address) => {
        const contract = await getStateTokenContract();
        try {
            const x1ClamedInscribe = await contract?.X1allocationBucket(address)
            return x1ClamedInscribe;
        } catch (error) {

        }
    }

    const getRefundRewardClaimableBucket = async (accountAddress) => {
        const contract = await getStateTokenContract();
        try {
            const RefundCalim = await contract.refundRewardClaimableBucket(accountAddress);
            return RefundCalim;
        } catch (err) {
            console.error(err, 'getRefundRewardClaimableBucket method error')
        }
    }

    const getStateTokenPrice = async () => {
        const contract = await getStateTokenContract();
        try {
            const stateTokenPrice = await contract?.StateTokenPrice();
            return stateTokenPrice;
        } catch (err) {
            console.error(err, 'stateTokenPrice method error')
        }
    }

    const getInscriptionContractAddress = async () => {
        try {
            const contract = await getStateTokenContract();
            const contractAddress = contract?.address;
            return contractAddress;
        }
        catch (err) {
            console.log('getInscriptionContractAddress:', err)
        }
    }

    const getClaimAllReward = async (address) => {
        const contract = await getPsdContract();
        try {
            const claimAllReward = await contract?.claimAllReward();

            await claimAllReward.wait();
            setSocket(prevBool => !prevBool);
            return claimAllReward;
        } catch (err) {
            allInOnePopup(null, 'Claim failed. Please try again.', null, `OK`, null)
            console.log('claimAllReward', err)
        }
    }

    const getWithdrawRefundReward = async () => {
        const contract = await getStateTokenContract();
        const RefundCalim = await contract.refundRewardClaimableBucket(accountAddress);
        try {
            allInOnePopup(null, 'Processing Please Wait', null, `OK`, null)
            if (RefundCalim <= 0) {
                allInOnePopup(null, 'Insufficient Rewards', null, `OK`, null)
                return;

            }
            // withdrawRefundReward (0xd8e1b051)
            const reward = await contract?.withdrawRefundReward();
            await reward.wait();
            allInOnePopup(null, 'Successful Claimed', null, `OK`, null)
        } catch (err) {
            allInOnePopup(null, 'Transaction Reverted. Please Try Again.', null, `OK`, null)
        }

    }

    const getwithdrawX1allocationReward = async (address) => {
        const contract = await getStateTokenContract();
        try {

            const claimX1 = await contract?.X1allocationClaimableBucket(address)
            allInOnePopup(null, 'Processing Transaction', null, `OK`, null)
            if (claimX1 <= 0) {
                allInOnePopup(null, 'Insufficient Rewards', null, `OK`, null)
                return;
            } else {
                const x1Reward = await contract?.withdrawX1allocationReward();
                await x1Reward.wait();
            }
            // withdrawX1allocationReward (0xc2e41d29)
            allInOnePopup(null, 'Successful Claimed', null, `OK`, null)

        } catch (error) {
            allInOnePopup(null, 'Transaction Reverted. Please Try Again.', null, `OK`, null)
            console.error('Transaction reverted:', error.message);
            // Handle the error or take appropriate action
        }
    }

    //Functions defined for Graph analytics

    const getcSpendOnInscription = async (address) => {
        const contract = await getStateTokenContract();
        try {
            const usdSpendonInscription = await contract?.getUsdcSpendOnInscription(address)
            return ethers.utils.formatEther(usdSpendonInscription);
        } catch (error) {

        }
    }
    // getcSpendOnInscription()
    const getinscriptionRewardClaim = async (address) => {
        const contract = await getStateTokenContract()
        try {
            const refundReward = await contract?.refundRewardBucket(address)
            return refundReward;
        } catch (error) {

        }
    }
    // getinscriptionRewardClaim()

    const getX1allocationBucketClaim = async (address) => {
        const contract = await getStateTokenContract();
        try {
            const X1allocationBucket = await contract?.X1allocationBucket(address)
            return X1allocationBucket;
        } catch (error) {
            console.log(error)
        }
    }

    const getDepositeValues = async () => {
        const contract = await getPsdContract();
        try {
            const _id = await contract?.ID();
            const depostedValues = await contract?.getDeposited(1);
            setDepositedAmount(depostedValues[0].depositAmount)
            return depostedValues;

        } catch (error) {
        }
    }

    const getLastStateTokenPriceUpdateTimestamp = async () => {
        const contract = await getStateTokenContract();
        try {
            const timeStamp = await contract?.lastPriceUpdate();
            const timeStampInStr =timeStamp ?  timeStamp?.toString() : '0'
            return timeStampInStr;
            
        } catch (error) {

        }
    }

    const getStateTokenTargets = async (address) => {
        const contract = await getStateTokenContract()
        try {
            const target = await contract?.getTargets(address);
            return target;
        } catch (error) {

        }
    }

    const getStateTokenHolders = async () => {
        const contract = await getStateTokenContract();
        try {
            const StateTokenHolder = await contract?.getHolders();
            return StateTokenHolder
        } catch (error) {
        }
    }

    //For testing purpose update price next day

    const getUpdateStateTokenPriceForTest = async () => {
        const contract = await getStateTokenContract();
        try {
            const priceUpdate = contract?.setStateTokenPriceForTest();
            console.log('updatePrice', priceUpdate)
        } catch (error) {
            console.log('updatePrice', error)
        }
    }

    const getNumberOfStateProtocolUsers = async() =>{
        try {
            let contract = await getPsdContract();
            let users = await contract?.NumberOfUser();
            const usersInStr = await users?.toString()
            return usersInStr
        } catch (error) {
            console.error('getNumberOfStateProtocolUsers: ', error);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            userConnected && setSocket((prevBool) => !prevBool);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [accountAddress, setReward]);


    return (
        <>

            <functionsContext.Provider value={{
                getFormatEther,
                socket,
                getParityReached,
                handleDeposit,
                handle_Claim_IPT_and_RPT,
                handle_Claim_Protocol_Fee,
                handle_Claim_Parity_Tokens,
                handle_Claim_All_Reward_Amount,
                getPrice,
                getToBeClaimed,
                getTotalValueLockedInDollar,
                getParityDollardeposits,
                getParityTokensDeposits,
                get_PSD_Claimed,
                get_PST_Claimed,
                getParityDollarClaimed,
                getParityAmountDistributed,
                getRatioPriceTargets,
                getIncrementPriceTargets,
                getProtocolFee,
                getDepositors,
                handle_Buy_State_Token,
                getUsdcSpendOnInscription,
                getStateTokenHolding,
                addTokenToMetaMask,
                getUserUsdValue,
                getTotalNumberOfReward,
                reward,
                getTimeStampForCreateValut,
                getTotalSupply,
                getCeateVaultTime,
                getX1allocationClaimableBucket,
                getRefundRewardClaimableBucket,
                getStateTokenPrice,
                getInscriptionContractAddress,
                getClaimAllReward,
                getwithdrawX1allocationReward,
                getWithdrawRefundReward,
                getX1allocationBucket,
                getcSpendOnInscription,
                getinscriptionRewardClaim,
                getX1allocationBucketClaim,
                getDepositeValues,
                depositedAmount,
                getStateTokenTargets,
                getStateTokenHolders,
                getUpdateStateTokenPriceForTest,
                getNumberOfStateProtocolUsers,
                getLastStateTokenPriceUpdateTimestamp,
            }}>
                {children}
            </functionsContext.Provider>
        </>
    )
}
