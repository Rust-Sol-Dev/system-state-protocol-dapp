import React, { useCallback, useContext, useEffect, useState } from 'react';
import './CreateVaultGraph.css';
import Graph from '../../../Components/GraphChart/Graph';
import { themeContext } from '../../../App';
import { functionsContext } from '../../../Utils/Functions'
import { Web3WalletContext } from '../../../Utils/MetamskConnect'
import { ethers } from 'ethers';

export default function CreateVaultGraph() {
    const { theme } = useContext(themeContext);
    const { accountAddress, currencyName, userConnected } = useContext(Web3WalletContext)

    const {
        getProtocolFee,
        getParityDollardeposits,
        get_PSD_Claimed,
        getParityTokensDeposits,
        get_PST_Claimed,
        getDepositeValues,
        depositedAmount,

    } = useContext(functionsContext)

    const [protocolFee, setProtocolFee] = useState(0)
    const [parityDollardeposits, setParityDollardeposits] = useState(0)
    const [parityDollarClaimed, setParityDollarClaimed] = useState(0)
    const [parityTokensDeposits, setParityTokensDeposits] = useState(0)
    const [parityTokensClaimed, setParityTokensClaimed] = useState(0)
    const [protocolfeePercentage, setProtocolfeePercentage] = useState(0)
    const [parityTokenPrecenatge, setParityTokenPrecenatge] = useState(0)
    const [iptPecentage, setIptPecentage] = useState(0)
    const [rtpPercentage, setRtpPercentage] = useState(0)


    const data = [
        { name: 'Parity Token fees', value: parityTokenPrecenatge },
        { name: 'rPT', value: rtpPercentage },
        { name: 'Protocol fees', value: protocolfeePercentage },
        { name: 'iPT', value: iptPecentage },
    ];
    console.log('parityTokensClaimed / (parityTokensDeposits + parityTokensClaimed)) * 100', typeof parityDollarClaimed, ' ', Number(parityTokensClaimed))
    const data2 = [
        //ternary operator use for testing purpose after testing done it will remove. parityTokensClaimed < 0 ? 1 : 
        { name: 'Rewards Tokens - PST', value: parityTokensClaimed < 0 ? 1 : (parityTokensClaimed / (parityTokensDeposits + parityTokensClaimed)) * 100 },
        { name: 'Deposits Tokens - PST', value: parityTokensDeposits < 0 ? 1 : (parityTokensDeposits / (parityTokensDeposits + parityTokensClaimed)) * 100 },

    ];

    const data1 = [
        // { name: 'Rewards - PSD', value: Math.ceil(parityDollarClaimed) },
        { name: 'Rewards - PSD', value: (parityDollarClaimed * 100) / (parityDollarClaimed + parityDollardeposits) },
        // { name: 'Deposits - PSD', value: Math.ceil(parityDollardeposits) },
        { name: 'Deposits - PSD', value: (parityDollardeposits * 100) / (parityDollarClaimed + parityDollardeposits) },

    ];

    console.log('parityDollarClaimed-:', parityDollarClaimed, '---', 'parityDollardeposits', parityDollardeposits)

    const protocolFeeRatio = async () => {
        const token = await getProtocolFee(accountAddress);
        setProtocolFee(token?.holdTokens)
        console.log('Protocol fees =', token?.holdTokens)
    }

    const ParityDollardeposits = async () => {
        try {
            let ParityDollardeposits = await getParityDollardeposits(accountAddress)
            let formattedParityDollardeposits = ethers.utils.formatEther(ParityDollardeposits || '0')
            let fixed = Number(formattedParityDollardeposits).toFixed(2)
            setParityDollardeposits(Number(fixed))
            console.log('psd-deposite', fixed)
        } catch (error) {
            console.error(error);
        }
    }

    const PSDClaimed = useCallback(async () => {
        try {
            let PSDClaimed = await get_PSD_Claimed(accountAddress)
            console.log('psdClaimzztest')
            let formatted_PSD_Claimed = ethers.utils.formatEther(PSDClaimed || '0')
            let fixed = Number(formatted_PSD_Claimed).toFixed(2)
            setParityDollarClaimed(Number(fixed))
            console.log('psdClaimzz', fixed, ' ', parityDollarClaimed,' - ',PSDClaimed)
        } catch (error) {
            console.error('errorpsdClaimzz:', error);
        }
    },[setParityDollarClaimed, parityDollarClaimed])

    const ParityTokensDeposits = async () => {
        try {
            let ParityTokensDeposits = await getParityTokensDeposits(accountAddress)
            let formattedParityTokensDeposits = ethers.utils.formatEther(ParityTokensDeposits || '0')
            let fixed = Number(formattedParityTokensDeposits).toFixed(4)
            setParityTokensDeposits(Number(fixed))
            console.log('pstDeposite00', fixed, ' ', parityTokensDeposits)

        } catch (error) {
            console.error(error);
        }
    }
    const PSTClaimed = async () => {
        try {
            let PSTClaimed = await get_PST_Claimed(accountAddress)
            let formatted_PST_Claimed = ethers.utils.formatEther(PSTClaimed || '0')
            let fixed = Number(formatted_PST_Claimed).toFixed(4);
            setParityTokensClaimed(Number(fixed))
            console.log('pstClaimxxoo', fixed, ' ', parityTokensClaimed)
        } catch (error) {
            console.error('error:', error);
        }
    }

    const getDepositedValue = async () => {
        try {
            const depositeAmtResponse = await getDepositeValues();
            const depositeAmount = await depositeAmtResponse[0]?.depositAmount
            const totalDeposited = Number(depositeAmount)
            console.log('depositeAmount',depositeAmtResponse,'--', depositeAmount, totalDeposited)

            const protocolFees = totalDeposited * (12.82 / 100)
            const parityTokenFees = totalDeposited * (7.69 / 100)
            const rpt = totalDeposited * (30.76 / 100)
            const ipt = totalDeposited * (48.72 / 100)

            setProtocolfeePercentage(protocolFees);
            setParityTokenPrecenatge(parityTokenFees);
            setIptPecentage(ipt);
            setRtpPercentage(rpt)

            console.log('name@---', protocolFees, parityTokenFees, rpt, ipt)
        } catch (error) {
            console.log(error)
        }

        /*  Protocol fees = 5 tokens (12,82%)
          Parity token fees = 3 tokens (7,69%
          Rpt = 12 tokens (30,76%)
          Ipt = 19 tokens (48,72%) */




    }

    useEffect(() => {
        protocolFeeRatio();
        ParityDollardeposits();
        PSDClaimed();
        ParityTokensDeposits();
        PSTClaimed();
        getDepositedValue()
    }, [parityDollarClaimed, parityTokensDeposits, parityTokensClaimed, protocolfeePercentage, iptPecentage])

    return (
        <div className={`container-xxl sizemax_align ${theme=='dimTheme' && 'graphDimThemeCusm'}`}>
            <div className='garph_box'>
                <p className='graph_boxPara'>YOUR REWARDS BREAKDOWN </p>
                <div className={`${theme === 'lightTheme' && 'garph_has' || theme === 'dimTheme' && 'graph_has_theme' || theme == 'darkTheme' && 'graph_has_theme'}`}>
                    <Graph data={data} />
                </div>
            </div>
            <div className='garph_box'>
                <p className='graph_boxPara'>PSD</p>
                <div className={`${theme === 'lightTheme' && 'garph_has' || theme === 'dimTheme' && 'graph_has_theme' || theme == 'darkTheme' && 'graph_has_theme'}`}>
                    <Graph data={data1} />
                </div>
            </div>
            <div className='garph_box'>
                <p className='graph_boxPara'>PST </p>
                <div className={`${theme === 'lightTheme' && 'garph_has' || theme === 'dimTheme' && 'graph_has_theme' || theme == 'darkTheme' && 'graph_has_theme'}`}>
                    <Graph data={data2} />
                </div>
            </div>
        </div>
    );
}
