import React, { useCallback, useContext, useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import '../Tracker/TrackingPage.css'
import '../../Utils/Theme.css';
import { themeContext } from "../../App";
import { useLocation, Link } from 'react-router-dom';
import { functionsContext } from '../../Utils/Functions';
import { Web3WalletContext } from '../../Utils/MetamskConnect';
import { BigNumber, ethers } from 'ethers';
import InfoBox from '../InfoIconBox/InfoBox';
import firstPump from '../../Assets/fistPumpBox.svg'
import fisrtPumpBrt from '../../Assets/High-Resolutions-Svg/Updated/fist pump small.svg'
import { PSD_ADDRESS, STATE_TOKEN_ADDRES, allInOnePopup, conciseAddress } from '../../Utils/ADDRESSES/Addresses';

export default function TrackingPage() {
    const { theme } = useContext(themeContext)
    const textTheme = (theme === "darkTheme" && "darkColor") || (theme === "dimTheme" && "text-white")
    const textTitle = (theme === "darkTheme" && "darkColorTheme") || (theme === "dimTheme" && "darkColorTheme")
    const spanDarkDim = (theme === "darkTheme" && "TrackSpanText") || (theme === "dimTheme" && "TrackSpanText")
    const borderDarkDim = (theme === "darkTheme" && "trackingBorder") || (theme === "dimTheme" && "dimThemeTrackBorder")
    const shadow = theme === "lightTheme" && "lightSh" || theme === "dimTheme" && 'dimSh' || theme === "darkTheme" && "darkSh"
    const location = useLocation();
    const isHome = location.pathname == "/Create-Vaults";
    const isHei = !isHome && 'hei'

    const {
        socket,
        getToBeClaimed,
        getPrice,
        getFormatEther,
        getDepositors,
        getParityDollarClaimed,
        getUserUsdValue,
        getTotalValueLockedInDollar,
        getParityDollardeposits,
        getParityTokensDeposits,
        get_PSD_Claimed,
        get_PST_Claimed,
        getParityAmountDistributed,
        getRatioPriceTargets,
        getIncrementPriceTargets,
        getParityReached,
        getUsdcSpendOnInscription,
        getStateTokenHolding,
        getProtocolFee,
        contractAddress,
        NumberOfUser,
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
        getTotalNumberOfReward,
        getNumberOfStateProtocolUsers,
        getLastStateTokenPriceUpdateTimestamp
        
    } = useContext(functionsContext)
    const { accountAddress, networkName, userConnected, WalletBalance, currencyName, } = useContext(Web3WalletContext)
    const [toBeClaimed, setToBeClaimed] = useState('0')
    const [totalValueLocked, setTotalValueLocked] = useState('0')
    const [parityDollardeposits, setParityDollardeposits] = useState('0')
    const [parityTokensDeposits, setParityTokensDeposits] = useState('0')
    const [parityDollarClaimed, setParityDollarClaimed] = useState('0')
    const [parityTokensClaimed, setParityTokensClaimed] = useState('0')
    const [IsParityReached, setIsParityReached] = useState(false)
    const [perpeptualYieldLocked, setPerpetualYieldLocked] = useState('0')

    const [amountInscription, setAmountInscription] = useState('0')
    const [stateTokenHoldPercentage, setStateTokenHoldPercentage] = useState('0')
    const [stateTokenHold, setStateTokenHold] = useState('0')
    const [protocolFee, setProtocolFee] = useState('0')
    const [parityAmountDistributed, setParityAmountDistributed] = useState('0')
    const [DayStamp, setDayStamp] = useState('0')
    const [currentStateTokenSupply, setCurrentStateTokenSupply] = useState('0')
    const [createVaultDays, setCreateVaultDays] = useState('0')
    const [claimX1, setClaimX1] = useState('0')
    const [claimInscriptionRefund, setClaimInscriptionRefund] = useState('0')
    const [inscriptionPrice, setInscriptionPrice] = useState('0')
    const [toBeClaimedReward, setToBeClaimedReward] = useState('')
    const [navigateToExplorer, setNavigateToExplorer] = useState('')
    const [balance, setBalance] = useState('Enter Amount')
    const [NumberOfStateProtocolUsers, setNumberOfStateProtocolUsers] = useState(0);
    const [remainingTimeForStateTokenPriceUpdate, setRemainingTimeForStateTokenPriceUpdate] = useState('0')

    const explorer_URL = async () => {
        if (await networkName === 'Polygon Mumbai') {
            return `https://mumbai.polygonscan.com/address`
        } 
        else if(await networkName === 'Pulsechain Testnet'){
            return `https://scan.v4.testnet.pulsechain.com/#/address`
        }
        else {
            return `https://mumbai.polygonscan.com/address`
        }
    }
    const navToExplorer = async () => {
        const baseUrl = await explorer_URL()
        if (isHome) {
            return `${baseUrl}/${PSD_ADDRESS}`
        }
        else {
            return `${baseUrl}/${STATE_TOKEN_ADDRES}`
        }
    }

    // Done
    const ToBeClaimed = async () => {
        try {
            // let toBeClaimed = await getToBeClaimed(accountAddress)
            // let formattedToBeClaimed = ethers.utils.formatEther(toBeClaimed ? toBeClaimed : '0')
            // let fixed = Number(formattedToBeClaimed).toFixed(4) + ' ' + currencyName
            // setToBeClaimed(fixed)

            let userBucketBalance = await getToBeClaimed(accountAddress)
            let formattedToBeClaimed = await getFormatEther(userBucketBalance || '0')

            let ParityShareTokensDetail = await getParityDollarClaimed(accountAddress)
            let parityClaimableAmount = ParityShareTokensDetail?.parityClaimableAmount
            let parityClaimableAmountFormatted = await getFormatEther(parityClaimableAmount)

            let protocolFee = await getProtocolFee(accountAddress);
            let protocolAmount = await protocolFee?.protocolAmount

            let AllFee = Number(formattedToBeClaimed) + Number(parityClaimableAmountFormatted) + Number(protocolAmount)
            let fixed = (AllFee.toFixed(4) === 'NaN' ? '0' : AllFee.toFixed(4))
            setToBeClaimed(fixed)
        } catch (error) {
            console.log('error:', error);
        }
    }
    // Done
    const TotalValueLockedInDollar = async () => {
        try {
            let totalPsdShare = await getTotalValueLockedInDollar()
            let formattedTotalPsdShare = ethers.utils.formatEther(totalPsdShare || '0')
            let fixed = Number(formattedTotalPsdShare).toFixed(2)
            setTotalValueLocked(fixed)
        } catch (error) {
            console.log('error:', error);
        }
    }
    // Done
    const ParityDollardeposits = async () => {
        try {
            let ParityDollardeposits = await getParityDollardeposits(accountAddress)
            let formattedParityDollardeposits = ethers.utils.formatEther(ParityDollardeposits || '0')
            let fixed = Number(formattedParityDollardeposits).toFixed(2)
            setParityDollardeposits(fixed)
        } catch (error) {
            console.error(error);
        }
    }
    // Done
    const ParityTokensDeposits = async () => {
        try {
            let ParityTokensDeposits = await getParityTokensDeposits(accountAddress)
            let formattedParityTokensDeposits = ethers.utils.formatEther(ParityTokensDeposits || '0')
            let fixed = Number(formattedParityTokensDeposits).toFixed(4) + ' ' + currencyName
            setParityTokensDeposits(fixed)
        } catch (error) {
            console.error(error);
        }
    }
    const PSDClaimed = async () => {
        try {
            let PSDClaimed = await get_PSD_Claimed(accountAddress)
            let formatted_PSD_Claimed = ethers.utils.formatEther(PSDClaimed || '0')
            let fixed = Number(formatted_PSD_Claimed).toFixed(2)
            // let PSTClaimed = await get_PST_Claimed(accountAddress)
            // let formatted_PST_Claimed = ethers.utils.formatEther(PSTClaimed || '0')
            // let PST_Claimed_InDollar = await getUserUsdValue(formatted_PST_Claimed || '0')
            // let fixed = Number(PST_Claimed_InDollar).toFixed(2)
            setParityDollarClaimed(fixed)
        } catch (error) {
            console.error('error:', error);
        }
    }
    const PSTClaimed = async () => {
        try {
            let PSTClaimed = await get_PST_Claimed(accountAddress)
            let formatted_PST_Claimed = ethers.utils.formatEther(PSTClaimed || '0')
            let fixed = Number(formatted_PST_Claimed).toFixed(4) + ' ' + currencyName
            setParityTokensClaimed(fixed)
        } catch (error) {
            console.error('error:', error);
        }
    }
    const ParityAmountDistributed = async () => {
        try {
            let ParityAmountDistributed = await getParityAmountDistributed(accountAddress)
            let formatted_ParityAmountDistributed = await getFormatEther(ParityAmountDistributed || '0')
            let fixed = Number(formatted_ParityAmountDistributed).toFixed(4) + ' ' + currencyName
            setParityAmountDistributed(fixed)
        } catch (error) {
            console.log('ParityAmountDistributed error: ', error);
        }
    }

    const isParityReached = async () => {

        try {
            let isReached = await getParityReached(accountAddress)
            setIsParityReached(isReached)
        } catch (error) {
            console.error('error: ', error);
        }
    }

    const PERPETUAL_YIELD_LOCKED = async () => {
        // if (accountAddress && currencyName) {
        let perpetual_yield_locked = 0;
        let price = await getPrice();
        let formattedPrice = Number(ethers.utils.formatEther(price || '0'))
        try {
            // let incrementPriceTarget = await getIncrementPriceTargets(accountAddress)
            let allDepositorsAddress = await getDepositors()
            let incrementPriceTarget = []
            for (let index = 0; index < allDepositorsAddress?.length; index++) {
                const address = allDepositorsAddress[index];
                let PriceTargets = await getIncrementPriceTargets(address)
                incrementPriceTarget.push(...PriceTargets || [])
            }

            if (incrementPriceTarget) {
                for (let index = 0; index < incrementPriceTarget?.length; index++) {
                    const element = incrementPriceTarget[index];
                    const escrowAmountInTokens = element?.totalFunds.toString()
                    perpetual_yield_locked += Number(ethers.utils.formatEther(escrowAmountInTokens || '0'))
                }
            }
        } catch (error) {
            console.error('error:', error);
        }
        let perpetual_yield_locked_In_Dollar = perpetual_yield_locked * formattedPrice;
        let fixedFloat = perpetual_yield_locked_In_Dollar.toFixed(2)
        setPerpetualYieldLocked(fixedFloat)
        // }
    }

    const UsdcSpendOnInscription = async () => {
        try {
            let usdcSpendOnInscription = await getUsdcSpendOnInscription(accountAddress)
            let isUndefined = usdcSpendOnInscription != (undefined && NaN) ? usdcSpendOnInscription : '0'
            let fixed = Number(isUndefined).toFixed(2)
            setAmountInscription(fixed)
        } catch (error) {
            console.error('error:', error);
        }
    }
    const StateTokenHold = async () => {
        try {
            let stateTokenHold = await getStateTokenHolding(accountAddress)
            let stateTokenHoldPercentage = stateTokenHold?.percentage
            let isUndefinedPercentage = stateTokenHoldPercentage !== undefined && !isNaN(stateTokenHoldPercentage) ? stateTokenHoldPercentage : '0'
            let fixedPercentage = Number(isUndefinedPercentage).toFixed(2)

            let stateTokenHoldNumber = stateTokenHold?.tokenHolds
            let isUndefinedTokens = stateTokenHoldNumber != (undefined && NaN) ? stateTokenHoldNumber : '0'
            let fixedTokens = Number(isUndefinedTokens).toFixed(0)
            setStateTokenHold(fixedTokens)
            setStateTokenHoldPercentage(fixedPercentage)
        } catch (error) {
            console.error('error:', error);
        }
    }

    const ProtocolFee = async () => {
        try {
            let protocolFee = await getProtocolFee(accountAddress);
            let protocolAmount = await protocolFee?.protocolAmount
            let fixed = Number(protocolAmount).toFixed(4) + ' ' + currencyName
            setProtocolFee(fixed)
        } catch (error) {
            console.error('error:', error);
        }
    }

    const getDay = async () => {
        const Day = await getTimeStampForCreateValut();
        setDayStamp(Day)
    }

    //Changing Hexadecimal number into Integer number
    const HexNumberToIntegerNum = (hexNum) => {
        try {
            const bigNumberObject = BigNumber.from(hexNum || '0');
            const integerValue = bigNumberObject.toNumber();
            return integerValue;

        } catch {

        }
    }
    const getCurrentStateTokenSupply = async () => {
        try {
            const supply = await getTotalSupply();
            const integerNum = ethers.utils.formatEther(supply);
            setCurrentStateTokenSupply(Math.round(integerNum));
        } catch (err) {
            console.log(err)
        }
    }

    const getVaultDays = async () => {
        try {
            const days = await getCeateVaultTime();
            console.log('days:',days);
            setCreateVaultDays(days)
        } catch (error) {
            console.error(error);
        }
    }

    const getClaimX1 = async (accountAddress) => {
        try {
            const claim = await getX1allocationClaimableBucket(accountAddress);
            const claimInEth = ethers.utils.formatEther(claim)
            setClaimX1(claimInEth)
        } catch (error) {

        }
    }

    const getClaimRefund = async (accountAddress) => {
        try {
            const refundClaim = await getRefundRewardClaimableBucket(accountAddress);
            const refundClaimInEth = ethers.utils.formatEther(refundClaim)
            setClaimInscriptionRefund(refundClaimInEth);
        } catch (error) {
            console.log(error)
        }
    }


    Number.prototype.noExponents = function () {
        let data = String(this).split(/[eE]/);
        if (data.length == 1) return data[0];

        let z = '',
            sign = this < 0 ? '-' : '',
            str = data[0].replace('.', ''),
            mag = Number(data[1]) + 1;

        if (mag < 0) {
            z = sign + '0.';
            while (mag++) z += '0';
            return z + str.replace(/^\-/, '');
        }
        mag -= str.length;
        while (mag--) z += '0';
        return str + z;
    }
    let n = 2E-7;

    const getInscriptionPrice = async () => {
        try {
            const inscrPrice = await getStateTokenPrice();
            const pureInscriptionPrice = HexNumberToIntegerNum(inscrPrice);
            const inEthValue = ethers.utils.formatEther(pureInscriptionPrice);
            setInscriptionPrice(inEthValue);

        } catch (err) {
            console.log(err)
        }
    }

    const claimAllReward = async () => {

        console.log('Number(toBeClaimed):',Number(toBeClaimed));
        console.log('Number(toBeClaimed):',toBeClaimed);
        if (Number(toBeClaimed) > 0) {
            
            try {
                const allReward = await getClaimAllReward(accountAddress);
                setToBeClaimedReward(allReward);
                allInOnePopup(null, 'Successful Claimed', null, `OK`, null)

            } catch (err) {
                allInOnePopup(null, 'Transaction Reverted. Please Try Again.', null, `OK`, null)
                console.log('Reward To be Claim', err?.data?.message)
            }
        } else {
            allInOnePopup(null, 'Insufficient Balance', null, `OK`, null)
            return;
        }
    }

    const getX1Reward = async (accountAddress) => {
        try {
            const x1RewardClaim = await getwithdrawX1allocationReward(accountAddress);
            console.log('x1RewardClaim', x1RewardClaim)
        } catch (error) {
            console.log(error.message)
        }
    }

    const getInscriptionRefund = async () => {
        try {
            const inscriptionRefuund = await getWithdrawRefundReward();
            console.log('inscriptionRefuund', inscriptionRefuund)
        } catch (error) {
            console.log(error.message)
        }

    }

    const getRewardPerc = async () => {
        try {
            const reward = await getTotalNumberOfReward();
        } catch (err) {
            console.log(err)
        }
    }

    // const getLastPriceUpdate = useCallback(async () => {
    //     const days = await getLastPriceUpdateDate();
    //     let day = (36.9 - Number(days)) == 0 ? 36.9 : (36.9 - Number(days));
    //     // let day = (24 - hourse) == 0 ? 24 : (24 - hourse);
    //     setPriceUpdateDate(day)
    // }, [setPriceUpdateDate])

    useEffect(() => {
        try {
            navToExplorer().then((res) => {
                setNavigateToExplorer(res)
            }).catch((error) => { })
            if (!userConnected) {
                let fixedBalance = Number(WalletBalance || '0').toFixed(4) + ' ' + currencyName
                setBalance(fixedBalance)
            }
        } catch (error) {

        }
    }, [accountAddress, networkName])

    const getStateTokenUserInNumber = async() =>{
        try {
            let users = await getNumberOfStateProtocolUsers();
            let usersInStr = await users?.toString()
            setNumberOfStateProtocolUsers(usersInStr)
        } catch (error) {
            console.error('getStateTokenUserInNumber: ',error);
        }
    }


    function getRemainingTime(timestamp) {
        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        const oneDay = 86400
        const priceUpdateInSeconds = Number(process.env.REACT_APP_STATE_TOKEN_PRICE_UPDATE_AFTER_IN_DAY) * oneDay


        const difference = (Number(timestamp) + priceUpdateInSeconds) - now; // Difference in seconds
    
        if (difference <= 0) {
            return 'Timestamp has already passed';
        }
    
        const days = Math.floor(difference / (24 * 60 * 60));
        const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((difference % (60 * 60)) / 60);
        const seconds = difference % 60;
    
        let remainingTime = '';
        if (days > 0) {
            remainingTime += `${days} DAY${days > 1 ? 'S' : ''}`;
        } else if (hours > 0) {
            remainingTime += `${hours} HOUR${hours > 1 ? 'S' : ''}`;
        } else {
            remainingTime += `${minutes} MINUTE${minutes > 1 ? 'S' : ''}`;
        }
    
        return remainingTime;
    }
    
    
    const getRemainingTimeForStateTokenPriceUpdate = async() =>{
        const timeStamp = await getLastStateTokenPriceUpdateTimestamp()
        const remainTime = await getRemainingTime(timeStamp)
        setRemainingTimeForStateTokenPriceUpdate(remainTime)
    }
    useEffect(() => {
        if (userConnected) {
            TotalValueLockedInDollar()
            ToBeClaimed()
            ParityDollardeposits()
            ParityTokensDeposits()
            PSDClaimed()
            PSTClaimed()
            ParityAmountDistributed()
            PERPETUAL_YIELD_LOCKED()
            isParityReached()
            UsdcSpendOnInscription()
            StateTokenHold()
            ProtocolFee()
            getDay()
            getCurrentStateTokenSupply();
            getVaultDays();
            getClaimX1(accountAddress);
            getClaimRefund(accountAddress);
            getInscriptionPrice();
            getRewardPerc();
            getStateTokenUserInNumber()
            getRemainingTimeForStateTokenPriceUpdate()
        }
    }, [accountAddress, currencyName, socket, NumberOfUser])

    const tooltip = theme === "dimTheme" && 'dim-tooltip' || theme === "darkTheme" && "dark-tooltip"

    //Testing purpose this code written here

    return (
        <>
            <div className={`top-container ${(theme === "darkTheme" && "darkThemeTrackingBg") || (theme === "dimTheme" && "dimTheme-index-class")}`}>
                <div className={`top-container ${isHei} container-xxl  ${(theme === "darkTheme" && "darkThemeTrackingBg") || (theme === "dimTheme" && "dimTheme-index-class")}`}>
                    <div className={`main-section ${shadow} me-auto card d-flex flex-wrap py-3 px-3 ${(theme === "darkTheme" && "Theme-block-container") || (theme === "dimTheme" && "dimThemeBg")}`}>
                        {
                            isHome ?
                                <div className='row g-lg-10'>
                                    <div className={`col-md-4 border-right ${borderDarkDim} col-lg-3 d-flex flex-column justify-content-between`}>
                                        <div>
                                            <div className={`d-flex uniqHeightxyz`}>
                                                <div className=' margin-right'>
                                                    <i className={`iconSize fa-solid fa-money-bill-transfer ${theme}`}></i>
                                                </div>
                                                <div className={`flex-grow-1 fontSize text-start d-flex justify-content-between ${textTheme}`}>
                                                    <div>
                                                        <div className={`${textTitle}`}>TO BE CLAIMED</div>
                                                        <div className='varSize'><span className={`spanText ${spanDarkDim}`}>{toBeClaimed  + ' ' + currencyName}</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center pumpBoxImg'>
                                                <button
                                                    onClick={() => { claimAllReward() }}
                                                    className={`first_pump_boxIcon ${(theme === "darkTheme" && "firstdumDark") || (theme === "dimTheme" && "dimThemeBg")} `}>
                                                    <img src={fisrtPumpBrt} className="w-100 h-100" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* <hr className="my-2" />
                                        <div className="d-flex">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-solid fa-comments-dollar ${theme}`}></i>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start ${textTheme}`}>
                                                <div className={`${textTitle}`}>TOTAL VALUE LOCKED</div>
                                                <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim}`}>$ {totalValueLocked}</span></div>
                                            </div>
                                        </div> */}
                                        <hr className="my-2" />
                                        <div className="d-flex customeHeight">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-solid fa-comments-dollar ${theme}`}></i>
                                            </div>
                                            <div className={`flex-grow-1 newBlockAdd flex-md-column fontSize text-start ${textTheme}`}>
                                                <div>
                                                    <div className={`${textTitle}`}>CONTRACT ADDRESS</div>
                                                    <div className={`varSize ${spanDarkDim}`}>
                                                        <span className={`spanTextAdd ${spanDarkDim}`}>
                                                            <Link to={navigateToExplorer} target="_blank" className={`spanTextAdd ${spanDarkDim}`} >
                                                                {
                                                                    isHome ? conciseAddress(PSD_ADDRESS) : conciseAddress(STATE_TOKEN_ADDRES)
                                                                }
                                                            </Link>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='w-100 d-flex align-items-end justify-content-between'>
                                                    <div>
                                                        <div className={`${textTitle}`}>CONTRACT STATUS</div>
                                                        <div className={`varSize ${spanDarkDim}`}><span className={`spanTextAdd ${spanDarkDim}`}>DISCOVERY - NOT RENOUNCED YET</span></div>
                                                    </div>
                                                    {/* <InfoBox data='See whitepaper under ”TokenListings”' /> */}

                                                    <span className={`${tooltip} hoverText tooltipAlign`} data-tooltip="See whitepaper under ”Token Listings”" data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className={`col-md-4 border-right col-lg-3 d-flex flex-column justify-content-center ${borderDarkDim}`}>
                                        <hr className='d-block d-lg-none d-md-none ' />
                                        <div className="d-flex h-50">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-regular fa-money-bill-1 ${theme}`}></i>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start d-flex justify-content-between ${textTheme}`}>
                                                <div>
                                                    <div className={`${textTitle}`}>DEPOSITS IN $ - PSD</div>
                                                    <div className={`varSize `}><span className={`spanText ${spanDarkDim}`}> $ {parityDollardeposits}</span></div>
                                                </div>
                                                {/* <InfoBox data='Parity Shares in Dollars. Indicating the total $ value deposited' /> */}
                                                <div className='d-flex align-items-end pb-3'>
                                                    <span className={`${tooltip} heightfixBug hoverText tooltipAlign`} data-tooltip='Parity Shares in Dollars. Indicating the total $ value deposited' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="my-3" />
                                        <div className="d-flex h-50">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-solid fa-circle-dollar-to-slot ${theme} `}></i>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start d-flex justify-content-between ${textTheme}`}>
                                                <div>
                                                    <div className={`${textTitle}`}>DEPOSITS IN TOKENS - PST </div>
                                                    <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim}`}> {parityTokensDeposits}</span></div>
                                                </div>
                                                {/* <InfoBox data='Parity Shares in Tokens. Indicating the total number of tokens
                                                    deposited'/> */}
                                                <div className='d-flex align-items-end pb-3'>
                                                    <span className={`${tooltip} heightfixBug hoverText tooltipAlign`} data-tooltip='Parity Shares in Tokens. Indicating the total number of tokens
                                                    deposited' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`col-md-4 border-right col-lg-3 d-flex flex-column justify-content-center ${borderDarkDim}`}>
                                        <hr className='d-block d-lg-none d-md-none ' />

                                        <div className="d-flex h-50">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-solid fa-arrow-up-right-dots ${theme}`}></i>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start d-flex justify-content-between ${textTheme}`}>
                                                <div>
                                                    <div className={`${textTitle}`}>REWARDS BASED ON PSD</div>
                                                    <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim}`}>$ {parityDollarClaimed}</span></div>
                                                </div>
                                                {/* <InfoBox data='Indicating the total $ value claimed' /> */}
                                                <div className='d-flex align-items-end pb-3'>
                                                    <span className={`${tooltip} hoverText tooltipAlign`} data-tooltip='Indicating the total $ value claimed' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="my-3" />
                                        <div className="d-flex h-50">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-solid fa-money-check-dollar ${theme}`}></i>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start d-flex justify-content-between ${textTheme}`}>
                                                <div>
                                                    <div className={`${textTitle}`}>REWARDS BASED ON PST</div>
                                                    <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim}`}>
                                                        {parityTokensClaimed}

                                                        {
                                                            IsParityReached &&

                                                            <span className={`${tooltip} hoverText hoverText`} data-tooltip="You reached maximum claim for parity tokens. Deposit more tokens to get parity token reward again." data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                                        }
                                                    </span></div>
                                                    <div className={`varSize parity-distributed ${spanDarkDim}`}><span className={`spanText parity-distributed ${spanDarkDim}`}>
                                                        {parityAmountDistributed}
                                                    </span></div>
                                                </div>
                                                {/* <InfoBox data='Indicating the total number of tokens claimed' /> */}
                                                <div className='d-flex align-items-end pb-3'>
                                                    <span className={`${tooltip} hoverText tooltipAlign`} data-tooltip="Indicating the total number of tokens claimed" data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className=" col-lg-3 extraFlex">
                                        <hr className='d-lg-none d-block my-3' />
                                        <div className="d-flex pt-1">
                                            <div className='margin-right'>
                                                {/* <i className={`iconSize fa-solid fa-vault ${theme}`}></i> */}
                                                {/* <InfoBox data='Days since deployment. Measuring time to reach 1000000% rewards' /> */}
                                                <span className={`${tooltip} hoverText`} data-tooltip='Days since deployment. Measuring time to reach 1000000% rewards' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div className={`${textTitle} `}>DAY</div>
                                                {/* <div className={`${textTitle} `}>ESCROW VAULTS</div> */}
                                                <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}> {DayStamp}</span></div>
                                            </div>
                                        </div>
                                        <div className="d-flex pt-1">
                                            <div className='margin-right'>
                                                {/* <i className={`iconSize fa-solid fa-vault ${theme}`}></i> */}
                                                {/* <InfoBox data='Total % rewards claimed by users to date' /> */}
                                                <span className={`${tooltip} hoverText`} data-tooltip='Total % rewards claimed by users to date' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div className={`${textTitle} `}>TOTAL % REWARDS</div>
                                                {/* <div className={`${textTitle} `}>ESCROW VAULTS</div> */}
                                                <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}> {Math.round(reward)} %</span></div>
                                            </div>
                                        </div>
                                        <div className="d-flex pt-1">
                                            <div className='margin-right'>
                                                {/* <i className={`iconSize fa-solid fa-vault ${theme}`}></i> */}
                                                {/* <InfoBox data='Number of active wallets opening vaults' /> */}
                                                <span className={`${tooltip} hoverText tooltipAlign`} data-tooltip='Number of active wallets opening vaults' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div className={`${textTitle} `}>NUMBER OF USERS</div>
                                                {/* <div className={`${textTitle} `}>ESCROW VAULTS</div> */}
                                                {/* <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}>{perpeptualYieldLocked}</span></div> */}
                                                {/* <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}>{perpeptualYieldLocked}</span></div> */}
                                                <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}> {NumberOfStateProtocolUsers}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='row g-lg-10'>
                                    <div className={`col-md-4 border-right ${borderDarkDim} col-lg-3 d-flex flex-column justify-content-center `}>
                                        <div className={`d-flex uniqHeight`}>
                                            <div className=' margin-right'>
                                                <i className={`iconSize fa-solid fa-coins fa-money-bill-transfer ${theme}`}></i>
                                            </div>
                                            <div>
                                                <div className={`flex-grow-1 fontSize text-start ${textTheme}`}>
                                                    <div className={`${textTitle}`}>AMOUNT SPENT ON INSCRIPTION</div>
                                                    <div className='varSize'><span className={`spanText ${spanDarkDim}`}>$ {amountInscription}</span></div>
                                                </div>
                                                <div className={`flex-grow-1 fontSize text-start ${textTheme}`}>
                                                    <div className={`${textTitle}`}>INSCRIPTION PRICE</div>
                                                    <div className='varSize'><span
                                                        className={`spanTextAdd ${spanDarkDim}`}>
                                                        $ {(inscriptionPrice)} - THIS PRICE WILL CHANGE IN {remainingTimeForStateTokenPriceUpdate}
                                                        {" "}
                                                        TO ${(Number(inscriptionPrice) + 0.0000001).noExponents()}
                                                    </span></div>
                                                </div>
                                            </div>
                                            {/* <InfoBox data='The inscription price changes every 36,9 days' /> */}
                                            <div className='d-flex align-items-end pb-2'>
                                                <span className={`${tooltip} hoverText tooltipAlign`} data-tooltip='The inscription price changes every 36,9 days' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                        </div>
                                        <hr className="my-3" />
                                        <div>
                                            <div className={`d-flex `}>
                                                <div className=' margin-right'>
                                                    {/* <i class="fa-solid fa-link"></i> */}

                                                    <i className={`iconSize fa-solid fa-solid fa-link ${theme}`}></i>
                                                </div>
                                                <div className='contractClass w-100 d-flex flex-column'>
                                                    <div className={`flex-grow-1 fontSize text-start ${textTheme}`}>
                                                        <div className={`${textTitle}`}>CONTRACT ADDRESS</div>
                                                        <div className='varSize'><span className={`spanTextAdd ${spanDarkDim}`}>
                                                            {/* {createVaultContractAddress.slice(0, 4)}....{createVaultContractAddress.slice(-4) */}
                                                            <Link to={navigateToExplorer}
                                                                target="_blank"
                                                                className={`spanTextAdd ${spanDarkDim}`}
                                                            >
                                                                {
                                                                    isHome ? conciseAddress(PSD_ADDRESS) : conciseAddress(STATE_TOKEN_ADDRES)
                                                                }
                                                            </Link>
                                                        </span>
                                                        </div>
                                                    </div>
                                                    <div className={`d-flex `}>
                                                        <div className={`flex-grow-1 fontSize text-start ${textTheme}`}>
                                                            <div className={`${textTitle}`}>CONTRACT STATUS</div>
                                                            <div className='varSize'><span className={`spanTextAdd ${spanDarkDim}`}>DISCOVERY - NOT RENOUNCED YET</span></div>
                                                        </div>
                                                        {/* <InfoBox data='See whitepaper under ”TokenListings' /> */}
                                                        <div className='d-flex align-items-end pb-2'>
                                                            <span className={`${tooltip} hoverText hoverText`} data-tooltip='See whitepaper under ”Token Listings"' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`col-md-4 border-right col-lg-3 d-flex flex-column justify-content-between my-1 ${borderDarkDim}`}>
                                        <hr className='d-block d-lg-none d-md-none ' />
                                        <div className="d-flex">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-solid fa-hand-holding-dollar ${theme}`}></i>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div>
                                                    <div className={`${textTitle}`}>CLAIM X1 (XN) REFUND</div>
                                                    {/* <div className={`varSize `}><span className={`spanText ${spanDarkDim}`}>{stateTokenHold} / {stateTokenHoldPercentage}%</span></div> */}
                                                    <div className={`varSize `}><span className={`spanText ${spanDarkDim}`}>$ {claimX1}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex align-items-center pumpBoxImg'>
                                                {/* <img src={firstPump} alt="firstPump" /> */}
                                                <button
                                                    onClick={() => getX1Reward(accountAddress)}
                                                    className={`first_pump_boxIcon ${(theme === "darkTheme" && "firstdumDark") || (theme === "dimTheme" && "dimThemeBg")} `}>
                                                    <img src={fisrtPumpBrt} className="w-100 h-100" />
                                                </button>
                                            </div>
                                            {/* <InfoBox data='$ value to be claimed' /> */}
                                            <div className='d-flex align-items-end pb-2'>
                                                <span className={` tooltipAlign ${tooltip} hoverText `} data-tooltip='$ value to be claimed' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`col-md-4 border-right col-lg-3 d-flex flex-column justify-content-between my-1  ${borderDarkDim}`}>
                                        <hr className='d-block d-lg-none d-md-none ' />

                                        <div className="d-flex">
                                            <div className='margin-right'>
                                                <i className={`iconSize fa-solid fa-cubes-stacked ${theme}`}></i>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div>
                                                    <div className={`${textTitle} `}>CLAIM INSCRIPTION REFUND</div>
                                                    {/* <div className={`varSize `}><span className={`spanText ${spanDarkDim}`}>{stateTokenHoldPercentage}%</span></div> */}
                                                    <div className={`varSize `}><span className={`spanText ${spanDarkDim}`}>$ {claimInscriptionRefund}</span></div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <div className='d-flex align-items-center pumpBoxImg'>
                                                {/* <img src={firstPump} alt="firstPump" /> */}
                                                <button
                                                    onClick={getInscriptionRefund}
                                                    className={`first_pump_boxIcon ${(theme === "darkTheme" && "firstdumDark") || (theme === "dimTheme" && "dimThemeBg")} `}>
                                                    <img src={fisrtPumpBrt} className="w-100 h-100" />
                                                </button>
                                            </div>
                                            {/* <InfoBox data='$ value to be claimed' /> */}
                                            <div className='d-flex align-items-end pb-3'>
                                                <span className={`${tooltip} tooltipAlign hoverText `} data-tooltip='$ value to be claimed' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" col-lg-3 extraFlex">
                                        <hr className='d-lg-none d-block my-3' />
                                        <div className="d-flex pt-1">
                                            <div className='margin-right'>
                                                {/* <i className={`iconSize fa-solid fa-magnifying-glass-dollar ${theme}`}></i> */}
                                                {/* <InfoBox data='Days since deploymen' /> */}
                                                <span className={`${tooltip} hoverText`} data-tooltip='Days since deploymen' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div className={`${textTitle} `}>DAY</div>
                                                {/* <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}>$ {amountInscription}</span></div> */}
                                                <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}>{createVaultDays}</span></div>
                                            </div>
                                        </div>
                                        <hr className='d-lg-none d-block my-3' />
                                        <div className="d-flex pt-1">
                                            <div className='margin-right'>
                                                {/* <i className={`iconSize fa-solid fa-magnifying-glass-dollar ${theme}`}></i> */}
                                                {/* <InfoBox data='Number & % State tokens you own' /> */}
                                                <span className={`${tooltip} hoverText`} data-tooltip='Number & % State tokens you own' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div className={`${textTitle} `}>NUMBER / % STATE TOKENS</div>
                                                {/* <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}>$ {amountInscription}</span></div> */}
                                                <div className={`varSize `}><span className={`spanText fs-5 ${spanDarkDim}`}>{Number(stateTokenHold).toLocaleString()} / {stateTokenHoldPercentage}%</span></div>
                                            </div>
                                        </div>
                                        <hr className='d-lg-none d-block my-3' />
                                        <div className="d-flex pt-1">
                                            <div className='margin-right'>
                                                {/* <i className={`iconSize fa-solid fa-magnifying-glass-dollar ${theme}`}></i> */}
                                                {/* <InfoBox data='Total number of State tokens minted' /> */}
                                                <span className={`${tooltip} hoverText`} data-tooltip='Total number of State tokens minted' data-flow="bottom"> <i className={`fas mx-2 fa-exclamation-circle ${theme}`}></i></span>
                                            </div>
                                            <div className={`flex-grow-1 fontSize text-start  ${textTheme}`}>
                                                <div className={`${textTitle} `}>CURRENT STATE TOKEN SUPPLY</div>
                                                <div className={`varSize ${spanDarkDim}`}><span className={`spanText ${spanDarkDim} fs-5`}>{Number(currentStateTokenSupply).toLocaleString()}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
