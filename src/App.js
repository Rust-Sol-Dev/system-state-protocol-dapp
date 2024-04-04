import React, { createContext, useEffect, useState } from "react";
import Layout from "./Protected Route/Layout";
import { Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Landing Page/Index";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCloudMoon, faGasPump, faMoon, faSun, fas } from '@fortawesome/free-solid-svg-icons'
import MetamskConnect from "./Utils/MetamskConnect";
import Website from "./Website/Website";
import BuyStateToken from "./pages/Buy State Token/BuyStateToken";
import Functions from "./Utils/Functions";
import TablePage from './pages/PriceTable/TablePage'
import MixedIptAndRpt from "./pages/MixedIptAndRpt/MixedIptAndRpt";
import StateTokenTarget from "./pages/StateTokenTargets/StateTokenTargets";
library.add(fas, faGasPump, faSun, faMoon, faCloudMoon)


export const themeContext = createContext();

function App() {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light');
  const lightTheme = themeMode === 'light' && 'lightTheme'
  const darkTheme = themeMode === 'dark' && 'darkTheme'
  const dimTheme = themeMode === 'dim' && 'dimTheme'
  const theme = lightTheme || darkTheme || dimTheme

  
  const navigate = useNavigate();
  const navigateToDEX = async () => {
    navigate('/Create-Vaults')
  }
  const navigateToDocs = async () => {
    navigate('/')
  }

  useEffect(()=>{

  },[theme, setThemeMode])
  return (
    <>
      <themeContext.Provider value={
        {
          theme, themeMode, setThemeMode, navigateToDEX, navigateToDocs
        }
      }>
        <MetamskConnect >
          <Functions>
            <Routes>
              <Route path="/" element={<Website />} />
              <Route path="/" element={<Layout />}>
                <Route path="Create-Vaults" element={<Index />} />
                <Route path="inscription" element={<BuyStateToken />} />
                {/* <Route path="ipt&rptTanzHistory" element={<TablePage />} /> */}
                <Route path="TanzHistory" element={<MixedIptAndRpt />} />
                  {/* <Route index path="ipt&rptHistory" element={<MixedIptAndRpt />} />
                  <Route path="statetokenTransaction" element={<StateTokenTarget />} /> */}
              </Route>

            </Routes>
          </Functions>
        </MetamskConnect>
      </themeContext.Provider>
    </>
  );
}

export default App;
