import React, { useContext } from 'react'
import IncrementPriceTarget from '../Increment Price Target/IncrementPriceTarget'
import RatioPriceTargets from '../Ratio Price Targets/RatioPriceTargets'
import './TablePage.css'
import { themeContext } from "../../App";
import '../../Utils/Theme.css'
import MixUpTraz from './MixUpTraz';
import StateTokenTarget from '../StateTokenTargets/StateTokenTargets';


export default function TablePage() {
  const { theme } = useContext(themeContext);
  return (
    <div className={`w-100 tablepage_main ${theme === "dimTheme" && "dimTheme-index-class"}`}>
      <div className="container-xxl align_main postion-relative d-flex flex-row justify-content-around flex-wrap posRel">
        <div className="col-md-12 col-12 col-lg-6 col-sm-12 mb-sm-4 sec-1">
          <div className="container-fluid p-0">
            <RatioPriceTargets />
          </div>
        </div>
        <div className="col-md-12 col-12 col-lg-6 col-sm-12 mb-sm-4 sec-2">
          <div className="container-fluid p-0">
            <IncrementPriceTarget />
          </div>
        </div>
        {/* <div className="col-md-12 col-12 col-lg-6 col-sm-12 mb-sm-4 sec-2">
          <div className="container-fluid p-0">
            <MixUpTraz/>
          </div>
        </div> */}

        <StateTokenTarget/>
      </div>
    </div>
  )
}
