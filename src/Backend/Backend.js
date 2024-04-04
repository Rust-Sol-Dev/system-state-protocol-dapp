import { BigNumber, Contract, Wallet, ethers } from 'ethers';
import { PSD_ADDRESS, STATE_TOKEN_ADDRES } from '../Utils/ADDRESSES/Addresses';
import { useEffect } from 'react';
import State_Token_ABI from '../Utils/ABI/STATE_TOKEN_ABI_UP.json'

export default function Backend() {
    const artifacts = {
        PSD_CONTRACT: require("../Utils/ABI/PSD_ABI_UP.json"),
        STATE_TOKEN: require("../Utils/ABI/STATE_TOKEN_ABI_UP.json")
    };
    const Provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER);
    const PSD_CONTRACT = new Contract(PSD_ADDRESS, artifacts.PSD_CONTRACT, Provider)
    const STATE_TOKEN_CONTRACT = new Contract(STATE_TOKEN_ADDRES, artifacts.STATE_TOKEN, Provider)

    let isAlreadyClicked_Escrow = false
    let isAlreadyClicked_Targets = false
    let isAlreadyClicked_State_Token_Targets = false;
    let isAlreadyClicked_State_Token_Price_Update = false;

    const getCurrentPrice = async () => {
        try {
            const current_price = await PSD_CONTRACT.connect(Provider).price()
            const formatted_Current_Price = Number(BigNumber.from(current_price || '0').toString())
            return formatted_Current_Price
        } catch (error) {

        }
    }
    //Price update for test in every 24 hourse.
    // const StateTokenUpdatePriceTest = async () => {
    //     try {
    //         const getLastPriceUpdate = await New_STATE_TOKEN_CONTRACT.connect(Provider).lastPriceUpdate();

    //     } catch (error) {
    //         console.log('getLastPriceUpdate', error)
    //     }
    //     try {

    //         let currentTime = Date.now()
    //         console.log('lastPrice')


    //         const getLastPriceUpdate = await STATE_TOKEN_CONTRACT.connect(Provider).lastPriceUpdate();
    //         // const getLastPriceUpdateTime = await STATE_TOKEN_CONTRACT.connect(Provider).lastPriceUpdate();
    //         let isUpdateTime = (currentTime - Number(getLastPriceUpdate)) / (60 * 60 * 1000)

    //         let fullTime = new Date(Number(getLastPriceUpdate)).getHours();
    //         console.log('lastPrices--', new Date(Number(getLastPriceUpdate)).getHours(), '---', fullTime)
    //         console.log('getLastPriceUpdateTime', Number(getLastPriceUpdate), ' - ', currentTime, ' - ', isUpdateTime)
    //         const gettateTokenPriceForTest = await STATE_TOKEN_CONTRACT.connect(signer).setStateTokenPriceForTest();
    //         console.log('gettateTokenPriceForTest', gettateTokenPriceForTest)
    //         if (fullTime == 23) {
    //         }
    //     } catch (error) {
    //         console.log('StateTokenUpdatePriceTest', error)
    //     }
    // }


    const getDepositors = async () => {
        try {
            const depositors = await PSD_CONTRACT.connect(Provider).getDepositors()
            return depositors || []
        } catch (error) {

        }
    }
    const getStateTokenHolders = async () => {
        try {
            const holders = await STATE_TOKEN_CONTRACT.connect(Provider).getHolders()
            return holders || []
        } catch (error) {

        }
    }
    const isAny_RPT_Achived = async (depositors, currentPrice) => {
        try {
            let is_ClaimEscrowByBackend_Call = false;
            const escrowData_RPT = []
            for (let index = 0; index < depositors.length; index++) {
                const address = depositors[index];
                const escrowTargets_RPT = await PSD_CONTRACT.connect(Provider).getEscrowDetails(address)
                escrowData_RPT.push(...escrowTargets_RPT || [])
            }

            for (let index = 0; index < escrowData_RPT.length; index++) {
                const priceTarget = escrowData_RPT[index].priceTarget;
                const priceTargetFormatted = Number(BigNumber.from(priceTarget).toString())
                if (currentPrice >= priceTargetFormatted) {
                    is_ClaimEscrowByBackend_Call = true
                }
            }

            return is_ClaimEscrowByBackend_Call;
        } catch (error) {

        }
    }

    const isAny_Target_IPT_Achived = async (depositors, currentPrice) => {
        try {
            let is_ClaimTargetsByBackend_Call = false;
            const targetsData_IPT = []
            for (let index = 0; index < depositors.length; index++) {
                const address = depositors[index];
                const Targets_RPT = await PSD_CONTRACT.connect(Provider).getTargets(address)
                targetsData_IPT.push(...Targets_RPT || [])
            }

            for (let index = 0; index < targetsData_IPT.length; index++) {
                const isClosed = targetsData_IPT[index].isClosed
                if (!isClosed) {
                    const price_target = targetsData_IPT[index].ratioPriceTarget;
                    const priceTargetFormatted = Number(BigNumber.from(price_target).toString())
                    if (currentPrice >= priceTargetFormatted) {
                        is_ClaimTargetsByBackend_Call = true
                    }
                }
            }
            return is_ClaimTargetsByBackend_Call
        } catch (error) {

        }

    }

    const IsAny_State_Token_Target_IPT_Achived = async (holders, currentPrice) => {
        try {
            let is_ClaimTargetsByBackend_Call = false;
            const targetsData_IPT = []
            for (let index = 0; index < holders.length; index++) {
                const address = holders[index];
                const Targets_RPT = await STATE_TOKEN_CONTRACT.connect(Provider).getTargets(address)
                targetsData_IPT.push(...Targets_RPT || [])
            }

            for (let index = 0; index < targetsData_IPT.length; index++) {
                const isClosed = targetsData_IPT[index].isClosed
                if (!isClosed) {
                    const price_target = targetsData_IPT[index].ratioPriceTarget;
                    const priceTargetFormatted = Number(BigNumber.from(price_target).toString())
                    if (currentPrice >= priceTargetFormatted) {
                        is_ClaimTargetsByBackend_Call = true
                    }
                }
            }
            return is_ClaimTargetsByBackend_Call
        } catch (error) {

        }

    }
    const isStateTokenPriceAchived = async () => {
        let priceUpdateInDay = Number(process.env.REACT_APP_STATE_TOKEN_PRICE_UPDATE_AFTER_IN_DAY)

        let lastStateTokenPriceUpdate = await STATE_TOKEN_CONTRACT.connect(Provider).lastPriceUpdate()
        let lastPriceUpdateTimestamp = lastStateTokenPriceUpdate.toString()

        let currentTimestamp = Math.floor(Date.now() / 1000);

        const OneDayInSeconds = priceUpdateInDay * 24 * 60 * 60;

        const timeDifferenceInSeconds = Number(currentTimestamp) - Number(lastPriceUpdateTimestamp);
        console.log('timeDifferenceInSeconds:',timeDifferenceInSeconds);

        if (timeDifferenceInSeconds >= OneDayInSeconds) {
            return true;
        } else {
            return false;
        }
    }
    
    const main = async () => {

        const depositors = await getDepositors()
        const currentPrice = await getCurrentPrice()

        const isAny_rpt_achived = await isAny_RPT_Achived(depositors, currentPrice)
        console.log('isAny_rpt_achived:', isAny_rpt_achived);
        if (isAny_rpt_achived && !isAlreadyClicked_Escrow) {
            handle_Claim_Escrow_By_Backend(isAny_rpt_achived)
        }


        const isAny_IPT_Targets_Achived = await isAny_Target_IPT_Achived(depositors, currentPrice)
        console.log('isAny_IPT_Targets_Achived:', isAny_IPT_Targets_Achived);

        if (isAny_IPT_Targets_Achived && !isAlreadyClicked_Targets) {
            handle_Claim_Targets_By_Backend(isAny_IPT_Targets_Achived)
        }

        const getHolders = await getStateTokenHolders()
        const isAny_State_Token_Target_IPT_Achived = await IsAny_State_Token_Target_IPT_Achived(getHolders, currentPrice)
        console.log('isAny_State_Token_Target_IPT_Achived:', isAny_State_Token_Target_IPT_Achived);
        if (isAny_State_Token_Target_IPT_Achived && !isAlreadyClicked_State_Token_Targets) {
            handle_Claim_State_Token_Targets_By_Backend(isAny_State_Token_Target_IPT_Achived)
        }
        
        const IsStateTokenPriceAchived = await isStateTokenPriceAchived()
        console.log('IsStateTokenPriceAchived:', IsStateTokenPriceAchived);
        if (IsStateTokenPriceAchived && !isAlreadyClicked_State_Token_Price_Update) {
            handleStateTokenPriceUpdate(IsStateTokenPriceAchived)
        }
    }


    const handle_Claim_Escrow_By_Backend = async (is_Achived) => {

        try {
            if (is_Achived && !isAlreadyClicked_Escrow) {
                isAlreadyClicked_Escrow = true
                const wallet = new Wallet(`0x${process.env.REACT_APP_SECRET_KEY}`)
                const signer = wallet.connect(Provider)
                const claim_Escrow_By_Backend_TX = await PSD_CONTRACT.connect(signer).claimEscrowByBackend()
                // const claim_Escrow_By_Backend_TX = 'await PSD_CONTRACT.connect(signer).claimEscrowByBackend()'
                claim_Escrow_By_Backend_TX.wait()

                console.log('claim_Escrow_By_Backend_TX - ', claim_Escrow_By_Backend_TX);
                console.log('claim Escrow Transaction hash - ', claim_Escrow_By_Backend_TX.hash);
                isAlreadyClicked_Escrow = false

            }
        } catch (error) {
            isAlreadyClicked_Escrow = false
            console.error('handle_Claim_Escrow_By_Backend error::::::::::::: ', error);
        }
    }
    const handle_Claim_Targets_By_Backend = async (is_Achived) => {
        try {
            if (is_Achived && !isAlreadyClicked_Targets) {
                isAlreadyClicked_Targets = true
                const wallet = new Wallet(`0x${process.env.REACT_APP_SECRET_KEY}`)
                const signer = wallet.connect(Provider)
                const claim_Targets_By_Backend = await PSD_CONTRACT.connect(signer).claimTargetsByBackend()
                claim_Targets_By_Backend.wait()

                console.log('claim_Targets_By_Backend - ', claim_Targets_By_Backend);
                console.log('claim Targets Transaction hash - ', claim_Targets_By_Backend.hash);
                isAlreadyClicked_Targets = false
            }
        } catch (error) {
            isAlreadyClicked_Targets = false
            console.error('handle_Claim_Targets_By_Backend error::::::::::::: ', error);
        }
    }

    const handle_Claim_State_Token_Targets_By_Backend = async (is_Achived) => {
        try {
            if (is_Achived && !isAlreadyClicked_State_Token_Targets) {
                isAlreadyClicked_State_Token_Targets = true
                const wallet = new Wallet(`0x${process.env.REACT_APP_SECRET_KEY}`)
                const signer = wallet.connect(Provider)
                const claim_State_Token_Targets_By_Backend = await STATE_TOKEN_CONTRACT.connect(signer).claimTargetsByBackend()
                claim_State_Token_Targets_By_Backend.wait()

                console.log('claim_State_Token_Targets_By_Backend - ', claim_State_Token_Targets_By_Backend);
                console.log('claim State Token Targets Transaction hash - ', claim_State_Token_Targets_By_Backend.hash);
                isAlreadyClicked_State_Token_Targets = false
            }
        } catch (error) {
            isAlreadyClicked_State_Token_Targets = false
            console.error('handle_Claim_State_Token_Targets_By_Backend error::::::::::::: ', error);
        }
    }



    const handleStateTokenPriceUpdate = async (is_Achived) => {
        try {
            if (is_Achived && !isAlreadyClicked_State_Token_Price_Update) {
                isAlreadyClicked_State_Token_Price_Update = true
                const wallet = new Wallet(`0x${process.env.REACT_APP_SECRET_KEY}`)
                const signer = wallet.connect(Provider)
                const stateTokenPriceUpdate_by_Backend = await STATE_TOKEN_CONTRACT.connect(signer).setStateTokenPriceForTest()
                stateTokenPriceUpdate_by_Backend.wait()

                console.log('stateTokenPriceUpdate_by_Backend - ', stateTokenPriceUpdate_by_Backend);
                console.log('State Token Price Update Transaction hash - ', stateTokenPriceUpdate_by_Backend.hash);
                isAlreadyClicked_State_Token_Price_Update = false
            }
        } catch (error) {
            isAlreadyClicked_State_Token_Price_Update = false
            console.error('handleStateTokenPriceUpdate error::::::::::::: ', error);
        }

    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            main().then((res) => {
                console.log(res);
            }).catch((err) => {
                console.log(err);
            })

        }, 30000);

        return () => clearInterval(intervalId);
    }, [])
    // main().then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // })

    // return (
    //     <div>Backend</div>
    // )
}
