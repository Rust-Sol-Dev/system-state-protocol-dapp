import React, { useContext, useState } from "react";
import "../Ratio Price Targets/RatioPriceTargets.css";
import "../../Utils/Theme.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { themeContext } from "../../App";
import { Web3WalletContext } from "../../Utils/MetamskConnect";
import { functionsContext } from "../../Utils/Functions";
import { useEffect } from "react";
import { ethers } from "ethers";


export default function MixUpTraz() {
    const { theme } = useContext(themeContext);
    const shadow = theme === "lightTheme" && "lightSh" || theme === "dimTheme" && 'dimSh' || theme === "darkTheme" && "darkSh"
    const { accountAddress, currencyName, userConnected } = useContext(Web3WalletContext)
    const { socket, getRatioPriceTargets, getPrice, getDepositors } = useContext(functionsContext)
    const [ratioPriceTargets, setRatioPriceTargets] = useState([])
    const [price, setPrice] = useState('0')
    const [seeFullPage, setseeFullPage] = useState(false)

    const RatioPriceTargets = async () => {
        if (accountAddress) {
          try {
            let price = await getPrice();
            let formattedPrice = await ethers.utils.formatEther(price || '0')
            setPrice(formattedPrice)
    
    
            let All_USERS_TARGETS = []
    
            let allDepositorsAddress = await getDepositors()
            
            for (let index = 0; index < allDepositorsAddress.length; index++) {
              const address = allDepositorsAddress[index];
              let targets = await getRatioPriceTargets(address)
              All_USERS_TARGETS.push(...targets || [])
            }
            
            // Correct: Create a new array or object
            const sortedArray = [...All_USERS_TARGETS || []].sort((a, b) => {
              const formattedRatioTargetA = ethers.utils.formatEther(a?.ratioPriceTarget.toString());
              const formattedRatioTargetB = ethers.utils.formatEther(b?.ratioPriceTarget.toString());
    
              const numericValueA = Number(formattedRatioTargetA);
              const numericValueB = Number(formattedRatioTargetB);
    
              return numericValueA - numericValueB;
            });
            
            try {
              let items = await Promise.all(sortedArray.map((target, index) =>
                processTargets(target, index, currencyName))
              );
              setRatioPriceTargets(items.filter(Boolean));
            } catch (error) {
              console.error('Error processing targets:', error);
            }
          } catch (error) {
            console.error('error:', error);
          }
        }
      }
    
      const processTargets = async (target, index, currencyName) => {
        try {
          const formattedRatioTarget = ethers.utils.formatEther(target?.ratioPriceTarget.toString())
          const ratioPriceTarget = Number(formattedRatioTarget).toFixed(4);
          const formattedTargetAmount = ethers.utils.formatEther(target?.TargetAmount.toString())
          const targetAmount = Number(formattedTargetAmount).toFixed(4) + ' ' + currencyName ?? currencyName;
          const givenTimestamp = target?.Time.toString()
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const timeDifferenceInSeconds = currentTimestamp - Number(givenTimestamp);
          const timeDifference = await formatTimeDifference(Number(timeDifferenceInSeconds));
    
    
    
          if (!target.isClosed) return (
            <div key={index} className={`box-items  ${(theme === "darkTheme" && "Theme-box-item") || (theme === "dimTheme" && "dim-theme-items" && "dim-theme-items-border") || "viewItemsTop"}`} >
              <div className="box-1" id="box1">
                {/* <span className={`cube-icon ${(theme === "darkTheme" && "Theme-background-logo") || (theme === "dimTheme" && "dimThemeBlockIcon")}`}>
                  <FontAwesomeIcon icon={faCube} style={{ color: "#96989c", width: "20px", height: "20px" }} />
                </span> */}
                <div> <p> <span>Transaction</span> </p>
                  <p className={`${(theme === "darkTheme" && "Theme-block-time") || (theme === "dimTheme" && "Theme-block-time") || "time-opacity "}`}>{timeDifference} ago</p>
                </div>
              </div>
              <div className="box-1 box-2" id="box2">
                <p className={`d-flex flex-column para-column-fit  ${(theme === "darkTheme" && "Theme-col2-para") || (theme === "dimTheme" && "Theme-col2-para")}`} >Target Price<span> Target Price : $ {ratioPriceTarget}
                </span> </p>
              </div>
              <p className={`box-3  ${(theme === "darkTheme" && "Theme-btn-block") || (theme === "dimTheme" && "dimThemeBtnBg")}`}> {targetAmount}</p>
            </div>
          )
        } catch (error) {
          console.log('error:', error)
        }
      }
      const formatTimeDifference = async (seconds) => {
        if (seconds >= 60 * 60 * 24) {
          const days = Math.floor(seconds / (24 * 60 * 60));
          return `${days} day${days > 1 ? 's' : ''}`;
        } else if (seconds >= 60 * 60) {
          const hours = Math.floor(seconds / (60 * 60));
          return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (seconds >= 60) {
          const minutes = Math.floor(seconds / 60);
          return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
          return `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }
    
      }

      
      useEffect(() => {
        if (userConnected) {
          RatioPriceTargets()
        }
      }, [accountAddress, currencyName, theme, socket])
    return (
        <>
        <div className=" ">
          <div
            className={`container-1 ${(theme === "darkTheme" && "Theme-block-container") || (theme === "dimTheme" && "dimThemeBg") || shadow} `} >
            <div className={`box-title mx-3 ${theme === "darkTheme" && ""} `} id={``} >
              <h1 className={`box-title mb-3 ${(theme === "darkTheme" && "bg-dark" && "text-white") || (theme === "dimTheme" && "title-color")}`}>
                Ratio Price Targets (rPT)
              </h1>
            </div>
            <div className={`${seeFullPage ? 'seenFullContent':''}reponsive-box1 `}>
              {ratioPriceTargets}
              {/* {
                ratioPriceTargets.map((target, index) => {
                  const formattedRatioTarget = ethers.utils.formatEther(target?.ratioPriceTarget.toString())
                  const ratioPriceTarget = Number(formattedRatioTarget).toFixed(4);
                  const formattedTargetAmount = ethers.utils.formatEther(target?.TargetAmount.toString())
                  const targetAmount = Number(formattedTargetAmount).toFixed(4) + ' ' + currencyName ?? currencyName;
  
                  return (
                    <div key={index} className={`box-items  ${(theme === "darkTheme" && "Theme-box-item") || (theme === "dimTheme" && "dim-theme-items" && "dim-theme-items-border") || "viewItemsTop"}`} >
                      <div className="box-1" id="box1">
                        <span className={`cube-icon ${(theme === "darkTheme" && "Theme-background-logo") || (theme === "dimTheme" && "dimThemeBlockIcon")}`}>
                          <FontAwesomeIcon icon={faCube} style={{ color: "#96989c", width: "20px", height: "20px" }} />
                        </span>
                        <div> <p> <span>Transaction</span> </p>
                          <p className={`${(theme === "darkTheme" && "Theme-block-time") || (theme === "dimTheme" && "Theme-block-time") || "time-opacity "}`}>12 secs ago</p>
                        </div>
                      </div>
                      <div className="box-1 box-2" id="box2">
                        <p className={`d-flex flex-column para-column-fit  ${(theme === "darkTheme" && "Theme-col2-para") || (theme === "dimTheme" && "Theme-col2-para")}`} >Target Price<span> Target Price : {ratioPriceTarget}
                        </span> </p>
                      </div>
                      <p className={`box-3  ${(theme === "darkTheme" && "Theme-btn-block") || (theme === "dimTheme" && "dimThemeBtnBg")}`}> {targetAmount}</p>
                    </div>
                  )
                })
              } */}
            </div>
            <div className="view-main">
              <div className={`view-page  ${(theme === "darkTheme" && "Theme-view-page") || (theme === "dimTheme" && "dimThemeBlockView" && "dim-theme-items-border")} `} >
                <Link
                onClick={()=>setseeFullPage(!seeFullPage)} 
                className={`${(theme === "darkTheme" && "text-white") || (theme === "dimTheme" && "dimThemeBlockView" && "dimThemeBlockView")} `} >
                  VIEW ALL TRANSACTIONS {seeFullPage ?<span> &uarr;</span>	: <span> &darr;</span>}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}
