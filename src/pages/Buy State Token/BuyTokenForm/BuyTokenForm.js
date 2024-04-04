import React, { useContext } from 'react'
import './BuyTokenForm.css'
import '../../../Utils/Theme.css'
import { themeContext } from '../../../App'


export default function BuyTokenForm() {
    const { theme } = useContext(themeContext);
    let dark = theme === "lightTheme" && "text-dark";
    const borderDarkDim = (theme === "darkTheme" && "trackingBorder") || (theme === "dimTheme" && "dimThemeTrackBorder")
    let block = (theme === "lightTheme" && theme + " ") || (theme === "darkTheme" && theme + " transdark") || (theme === "dimTheme" && theme + " transdim");
    const shadow = theme === "lightTheme" && "lightSh" || theme === "dimTheme" && 'dimSh' || theme === "darkTheme" && "darkSh"
    return (
        <>
            <div className={` container-xxl my-3   `}>
                <div className={` font-family ${shadow} ${theme}  me-auto card d-flex flex-wrap py-3 px-3 ${(theme === "darkTheme" && "Theme-block-container") || (theme === "dimTheme" && "dimThemeBg")}`}>
                    <form className='w-100  '>
                    <p className='font-family'>Find other contracts with similar source code.</p>
                        <div className='row '>
                            <div className={`col-lg-4 col-md-6 sm-col-12 border-right  ${borderDarkDim}`}>
                                <div className='w-100  '>
                                    <div className=''>
                                        <p className={` mb-0 font-family  ${theme === "darkTheme" && "depositInputDark darkColor"} `}>Contract Address *</p>
                                        <input className={`font-family   form-control inputactive ${block} ${theme === "lightTheme" && "depositInputLight" || theme === "dimTheme" && "depositInputGrey darkColor"} ${theme === "darkTheme" && "depositInputDark darkColor"}`}
                                            pattern={`[0-9,.]*`}
                                            type="text"
                                            placeholder="0x..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`col-lg-4 col-md-6 sm-col-12 border-right ${borderDarkDim}`}>
                                <div className='w-100  '>
                                    <div className=''>
                                        <p className={` mb-0 font-family ${theme === "darkTheme" && "depositInputDark darkColor"} `}>Similarity</p>
                                        <select defaultValue="deposit" className={`font-family   form-control inputactive ${block} ${theme === "lightTheme" && "depositInputLight" || theme === "dimTheme" && "depositInputGrey darkColor"} ${theme === "darkTheme" && "depositInputDark darkColor"}`} aria-label="Name Tags" >
                                            <option className={`${theme} font-family opt-hover option-list`} >Similarity</option>
                                            <option className={`${theme} font-family option-list`} value="buy"> Exact</option>
                                            <option className={`${theme} font-family option-list`} value="claim Refund">Similar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4 col-md-12 sm-col-12 d-flex justify-content-center align-items-center flex-wrap'>
                                <div className='w-100'>
                                    <p className={`mb-0 font-family  ${theme === "darkTheme" && "depositInputDark darkColor"} `}>Chains</p>
                                    <select defaultValue="deposit" className={` font-family  form-control inputactive ${block} ${theme === "lightTheme" && "depositInputLight" || theme === "dimTheme" && "depositInputGrey darkColor"} ${theme === "darkTheme" && "depositInputDark darkColor"}`} aria-label="Name Tags" >
                                        <option className={`${theme} font-family opt-hover option-list`} >Chains</option>
                                        <option className={`${theme} font-family option-list`} value="buy"> Exact</option>
                                        <option className={`${theme} font-family option-list`} value="claim Refund">Similar</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}