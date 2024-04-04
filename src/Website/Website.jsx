import React, { useContext, useEffect } from "react";
import "./Website.css";
import { Link } from "react-router-dom";
import SystemStateBackground from "../Assets/High-Resolutions-Svg/Updated/SystemBg.svg";
import SystemStateLogo from "../Assets/High-Resolutions-Svg/Updated/logo.svg";
import TwitterXIcon from "../Assets/High-Resolutions-Svg/Updated/twitterx.svg";
import TelegramIcon from "../Assets/High-Resolutions-Svg/Updated/telegram.svg";
import { themeContext } from "../App";
import Quick_Guide from '../Assets/Docs/Quick Guide - System State.pdf'
import { Helmet } from "react-helmet";
export default function Website() {
  const { navigateToDEX } = useContext(themeContext);

  return (
    <>
   
      <div className="mainBg">
        <div>
          <div className="section1 section-padding SectionBg">
            <div className="container-fluid">
              <div className="web">
                <nav className="d-flex justify-content-lg-between justify-content-md-between justify-content-between align-items-sm-center flex-wrap main " id="media-query">
                  <div className="information">
                    <i className="fa-solid fa-circle-info"></i>
                    <div className="px-2">
                      <Link target="_blank" to={'https://system-state-documentation.gitbook.io/'}>Documentation</Link>
                    </div>
                    <div className="quick-desk px-1">
                      <Link target="_blank" to={Quick_Guide}>Quick Guide</Link>
                    </div>
                  </div>
                  <div className="quick-mob">
                    <Link target="_blank" to={Quick_Guide}>Quick Guide</Link>
                  </div>
                  <div className="enter " onClick={async () => await navigateToDEX()} >Enter</div>
                </nav>
              </div>
              <div className="DarkWaves my-5">
                <img src={SystemStateBackground} alt="DarkWaves images" className="" />
              </div>
              <div className="paddingBottomS1 res-2">
                <div className="State d-flex flex-wrap justify-content-center justify-content-sm-start">
                  <div className="under-state">
                    <img src={SystemStateLogo} alt="SystemStateLogo " className="SystemStateLogo" />
                  </div>
                  <p className="state-text">System State</p>
                </div>
                <div className="d-flex state-main res-1">
                  <div className="col-md-9 text-justify mt-2 text-center text-lg-start">
                    {/* Unlock Yield with Smart Contracts: Leveraging Increments,
                    Ratios, and the Velocity of Money Theory. Our smart contracts
                    employ incremental strategies and precise ratios to generate
                    gains with every deposit. They also securely lock up tokens
                    in escrow, ensuring consistent, long-term gains. */}
                    Our protocol employs meticulous incremental strategies and precise ratios to ensure that every deposit results in gains. By
                    securely locking up tokens in our smart escrow vaults, we guarantee consistent, long-term profits for our users. Leveraging
                    the power of natural market forces and entropy, our protocol generates sustainable and reliable yields, enabling you to grow
                    your crypto assets for years to come. The yield originates from blockchain inflation driven by node operators or miners, with
                    our escrow vaults effectively capturing and maximizing this inflation.
                  </div>
                  <div className="icons d-flex justify-content-between width-icons">
                    <div className="TwitterXIcon-main">
                      <div className="TwitterXIcon">
                        <div className="imageIcon">
                          <Link target="_blank" to={'https://twitter.com/thestate_x'}>  <img src={TwitterXIcon} alt="TwitterXIcon" /></Link>
                        </div>
                      </div>
                    </div>
                    <div className="TelegramIcon">
                      <Link target="_blank" to={'https://t.me/pSystemstate'}>  <img src={TelegramIcon} alt="TelegramIcon" /></Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer text-center text-lg-start pb-2">Copyright © 2024 System State - - All rights reserved - - Swap impermanent loss for perpetual gain.</div>
            </div>
          </div>

          {/* <div className="section2 SectionBg">
            <div className="row w-100 h-100">
              <div className="col-md-6 height-section_2 sec-text">
                <p className="text-center text-lg-start">
                  System-State is the missing piece in safeguarding your
                  cryptocurrency assets. In a high-risk crypto market,
                  protecting your assets is paramount. Rest assured, all our
                  smart contracts are renounced and devoid of admin keys,
                  ensuring your financial security.
                </p>
              </div>
              <div className="col-md-6 section-imageBg">
                <div className="background-images d-flex align-items-end ">
                  <img
                    src={RightWave}
                    className="waves"
                    alt="LightWavesRight"
                  />
                  <div className="tip-main">
                    <p>
                      Tips: Build your Escrow vaults value in the smart contract
                      and receive perpeptual gains for many years.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-3-1 px-3 d-flex flex-wrap paddings-tb " id="bg-color-section">
            <div className="col-md-6 col-sm-12 under-sec3">
              <div className="my-auto fs-6 d-flex flex-column justify-content-center align-items-center">
                <div className="content1">
                  <h5 className="my-2 text-center text-lg-start">How Does It Work?</h5>
                  <p className="m-0 text-center text-lg-start">
                    Our smart contracts employ incremental strategies and
                    precise ratios to generate profits with every deposit. They
                    also securely lock up tokens in escrow vaults, ensuring
                    long-term gains.
                  </p>
                </div>
                <div className="content2 text-center text-lg-start">
                  <h5 className="my-2">Let's Dive Deeper</h5>
                  <p className="m-0">
                    The heart of our system lies in creating Incremental Price
                    Targets (iPTs) and Ratio Price Targets (rPT). We achieve
                    this by applying Fibonacci ratios to 61.8% of each deposit,
                    resulting in an impressive 58% gain. Furthermore, 26.30% of
                    each deposit is placed into an escrow vault contract,
                    guaranteeing perpetual payouts whenever the token achieves a
                    1X gain.
                  </p>
                </div>
                <div className="content3 text-center text-lg-start">
                  <h5 className="my-2">Here's an Example</h5>
                  <p className="m-0">
                    Imagine depositing $1000 and receiving $1580 in return.
                    Additionally, every time the token's price increases by 1X,
                    you'll receive the equivalent value of your escrow funds. If
                    the token moons by 400X, you'll receive your escrow funds'
                    value a staggering 400 times over. It's the ultimate way to
                    safeguard your crypto assets.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-image-3-1 col-md-6 col-sm-12 mt-4 escrow-vault-tips">
              <img src={sectionImages} alt="background" className="image-section-3 trans-3d" />
              <div className="tip-section3">
                <p className="mb-0">
                  Tip: The smart contract is an Escrow vault with locked value.
                  Wallet management is crucial and must be viewed as an
                  inheritance instrument
                </p>
              </div>
            </div>
          </div>
          <div className=" section2 SectionBg" id="background-color">
            <div className="row m-0 px-5 w-100 h-100">
             
              <div className="col-md-6 sec-list-text text-color pt-5 d-flex flex-column flex-section3">
                <p className="text-justify mt-4 text-lg-start" id="text-color">
                  Cryptocurrency fosters communities, and these communities fuel
                  growth, which is intricately connected to the velocity of
                  money theory, leading to sustained and perpetual gains.
                </p>
                <div className="text-sm-justify w-100" id="text-color">
                  <p id="text-color">Escrow Vaults will be available on</p>
                  <ul className="" id="text-color list-itmes">
                    <li>Base</li>
                    <li>Binance Smart Chain</li>
                    <li>Polygon</li>
                    <li>Avalanche</li>
                    <li>Fantom</li>
                    <li>Optimism</li>
                    <li>Arbitrum</li>
                    <li>Moonbeam</li>
                    <li>Evmos</li>
                    <li>Pulsechain</li>
                    <li>X1 Fastnet</li>
                  </ul>
                </div>
                <p id="text-color">Users holding the $State token share the
                  4.75% protocol fees.</p>
              </div>
              <div className="col-md-6 section3-main-wave pt-5 image-align ">
                <div className="waves-div">
                  <img
                    src={LightWavesRight}
                    className="width-Bgh"
                    alt="LightWavesRight"
                  />
                  <div className="section3tip-main">
                    <p className="text-sm-justify mb-0">
                      Tip: Holding $State tokens gives you
                      a share of the protocol fees for
                      every token listed on the chain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="footer-section px-3 py-2 d-flex justify-content-between flex-wrap">
            <div className="text-center footer-margin text-lg-start">Copyright © 2023 System State - - All rights reserved - - Swap impermanent loss for perpetual gain.</div>
          </div> */}
        </div>
      </div>
    </>
  );
}
