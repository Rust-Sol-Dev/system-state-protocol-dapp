import React, { useCallback, useContext, useEffect, useState } from 'react'
import DataTable, { createTheme } from 'react-data-table-component';
import icon2 from '../../../Assets/Token List Icon/2.svg'
import icon3 from '../../../Assets/Token List Icon/3.svg'
import icon4 from '../../../Assets/Token List Icon/4.svg'
import icon5 from '../../../Assets/Token List Icon/5.svg'
import MetamaskIcon from '../../../Assets/Icons/icn-metamask.svg'
import './TokenList.css'
import './InscriptionGraph.css'
import { themeContext } from '../../../App';
import { STATE_TOKEN_ADDRES } from '../../../Utils/ADDRESSES/Addresses';
import { functionsContext } from '../../../Utils/Functions';
import Graph from '../../../Components/GraphChartForInscription/GraphChart';
import { Web3WalletContext } from '../../../Utils/MetamskConnect'
import { BigNumber, ethers } from 'ethers';
import RatioPriceTargets from '../../Ratio Price Targets/RatioPriceTargets';
import MixedIptAndRpt from '../../MixedIptAndRpt/MixedIptAndRpt'

export default function TokenList() {

    const { theme } = useContext(themeContext);
    const metamaskBg = theme == 'lightTheme' && 'metaLight ' || theme == 'dimTheme' && 'metaDim ' || theme == 'darkTheme' && 'metaDark'

    const { accountAddress, currencyName, userConnected } = useContext(Web3WalletContext)
    const {
     
        getcSpendOnInscription,
        getinscriptionRewardClaim,
        getX1allocationBucketClaim,

    } = useContext(functionsContext)

    const [claimX1, setClaimX1] = useState('0')
    const [inscribeValueClaim, setinscribeValueClaim] = useState('0')
    const [totalInscribeValue, setTotalInscribeValue] = useState(0)
    const [inscriptionRefundProcess, setIncriptionRefundProcess] = useState(0)
    const [inscriptionClaimPercentage, setinscriptionClaimPercentage] = useState(0)
    const [spendInscriptionUsdc, setSpendInscriptionUsdc] = useState(0)
    const [x1RewardClaimedProcess, setX1RewardClaimedProcess] = useState(0)



    const columns = [
        {
            name: '#',
            selector: (row) => (<div className='d-flex justify-content-center align-items-center'><p className='mb-0'>{row.srNo}</p></div>),
            width: '50px'

        },
        {
            name: 'Token',
            selector: row =>
                <div className='d-flex justify-content-center align-items-center'>
                    <img src={row.img} height='30px' width='30px' alt='Logo' />
                    <p className='mx-1 mb-0'>{row.name}</p>
                </div>,
        },
        {
            name: 'Price',
            selector: row => <div className='my-1'>
                <p className='mb-0'>{row.price}</p>
            </div>,
        },
        {
            name: 'Change (%)',
            selector: row => <div className=''> {row.change}%</div>,
            conditionalCellStyles: [
                {
                    when: row => row.change < 0,
                    style: {
                        color: 'red',
                    },
                },],

        },
        {
            name: 'EVM Chains',
            selector: row => <div>{row.EVM_Chain}</div>,
        },
        {
            name: 'Add token to Metamask',
            selector: (row) => <button onClick={() => AddTokenToMetaMask(row.address, row.name, row.decimals)} className={`${metamaskBg} flex metamask-btn gap-2 items-center dark:bg-[#212121] bg-[#DEDEDE] justify-center rounded-[10px] py-[8px] px-8 font-medium dark:text-[#B3B3B3] text-black" fdprocessedid="xrxpsci`}><img src={row.icon} width="20" height="20" alt="" /><span className='addToMetaMask'>Add to Metamask.</span></button>,
        },
    ];
    const data = [
        {
            id: 1,
            srNo: 1,
            name: 'State',
            decimals: 18,
            price: '0.0000001',
            volume: '$21,153,721,172.00',
            change: 0,
            EVM_Chain: 'Pulsechain',
            img: icon5,
            icon: MetamaskIcon,
            address: STATE_TOKEN_ADDRES
        },
        {
            id: 2,
            srNo: 2,
            name: 'PLS',
            decimals: 18,
            price: '0.00006210',
            volume: '$21,153,721,172.00',
            change: +9.45,
            EVM_Chain: 'Pulsechain',
            img: icon4,
            icon: MetamaskIcon,
            address: STATE_TOKEN_ADDRES
        },
        {
            id: 3,
            srNo: 3,
            name: 'PLSX',
            decimals: 18,
            price: '0.00001819',
            volume: '$21,153,721,172.00',
            change: -1.88,
            EVM_Chain: 'Pulsechain',
            img: icon2,
            icon: MetamaskIcon,
            address: STATE_TOKEN_ADDRES
        },
        {
            id: 4,
            srNo: 4,
            name: 'pXEN',
            decimals: 18,
            price: '0.000000002116',
            volume: '$21,153,721,172.00',
            change: +22.78,
            EVM_Chain: 'Pulsechain',
            img: icon3,
            icon: MetamaskIcon,
            address: STATE_TOKEN_ADDRES
        },

    ]
    createTheme('solarLight', {
        text: {
            primary: '#000000',
            secondary: '#000000',
        },
        background: {
            default: '#ffffff',
        }
    });
    createTheme('solarDim', {
        text: {
            primary: '#ffffff',
            secondary: '#ffffff',
        },
        background: {
            default: '#111a2e',
        }
    });
    createTheme('solarDark', {
        text: {
            primary: '#ffffff',
            secondary: '#ffffff',
        },
        background: {
            default: '#111111',
        },
    });
    const shadow = theme == 'lightTheme' && 'shadowLight' || theme == 'dimTheme' && 'shadowDim' || theme == 'darkTheme' && 'shadowDark'

    const { addTokenToMetaMask } = useContext(functionsContext)

    const AddTokenToMetaMask = async (address, name, decimals) => {
        console.log('address, name, symbol::', address, name, decimals);
        if (address, name, decimals) {
            try {
                await addTokenToMetaMask(address, name, decimals)
            } catch (error) {
                console.error('error:', error);
            }
        }
    }

    const HexNumberToIntegerNum = (hexNum) => {
        const bigNumberObject = BigNumber.from(hexNum || '0');
        const integerValue = bigNumberObject.toNumber();
        return integerValue;
    }

    const inscribeRefundClaimPercent = useCallback(() => {

        //Process percentage for inscription graph process
        const process = spendInscriptionUsdc - inscribeValueClaim;
        // const processPercentage = (process / 100) * 100;
        setIncriptionRefundProcess(process);
    }, [spendInscriptionUsdc, inscribeValueClaim, setIncriptionRefundProcess, inscriptionRefundProcess])

    const X1RewardClaimedProcess = useCallback(() => {
        const x1rewardProcess = spendInscriptionUsdc - claimX1;
        setX1RewardClaimedProcess(x1rewardProcess);
    }, [spendInscriptionUsdc, setX1RewardClaimedProcess, spendInscriptionUsdc, claimX1])

    const getInscriptionClaimed = async (accountAddress) => {
        const inscriptionClaim1 = await getinscriptionRewardClaim(accountAddress);
        const inscriptionClaimPure = HexNumberToIntegerNum(inscriptionClaim1)
        // console.log('inscriptionClaimPure',ethers.utils.formatEther(inscriptionClaim1), '  ',inscriptionClaimPure)
        setinscribeValueClaim(inscriptionClaimPure);
    }

    const getSpendInscriptionUsdc = useCallback(async (accountAddress) => {
        try {
            const spendInscription = await getcSpendOnInscription(accountAddress);

            setSpendInscriptionUsdc(spendInscription);

        } catch (error) {
            console.log('spendInscriptionxex', error)
        }

    }, [setSpendInscriptionUsdc, spendInscriptionUsdc])


    const getX1claim = useCallback(async (accountAddress) => {
        const x1Claim = await getX1allocationBucketClaim(accountAddress)
        const x1ClaimPure = HexNumberToIntegerNum(x1Claim);
        setClaimX1(x1ClaimPure)
    }, [setClaimX1])

    useEffect(() => {
        inscribeRefundClaimPercent();
    }, [setIncriptionRefundProcess])

    useEffect(() => {
        // getClaimX1();
        // getTotalInscribeValue(accountAddress);
        inscribeRefundClaimPercent();
        getinscriptionRewardClaim(accountAddress)
        getSpendInscriptionUsdc(accountAddress)
        getInscriptionClaimed(accountAddress)
        getX1claim(accountAddress);
        X1RewardClaimedProcess();

    }, [inscriptionRefundProcess, x1RewardClaimedProcess, totalInscribeValue, inscribeValueClaim, spendInscriptionUsdc, claimX1])

    return (
        <div className='container-xxl py-3 pb-5'>
            <div className={` graph_inscription_main row py-3 table-section`}>
                <MixedIptAndRpt/>
              
            </div>
        </div>
    )
}
