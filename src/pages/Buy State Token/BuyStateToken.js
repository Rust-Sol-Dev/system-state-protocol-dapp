import React, { useContext } from 'react'
import '../../Utils/Theme.css'
import './BuyStateToken.css'
import { themeContext } from '../../App'
import Searchbar from '../../Components/SearchBar/Searchbar'
import TrackingPage from '../../Components/Tracker/TrackingPage'
import TokenList from './TokenList/TokenList'
import BuyTokenForm from './BuyTokenForm/BuyTokenForm'

export default function BuyStateToken() {
  const { theme } = useContext(themeContext);

  return (
    <div className={`${theme} index-main ${theme === "lightTheme" && "lightThemeBack"||(theme === "darkTheme" && "darkThemeTrackingBg") || (theme === "dimTheme" && "dimTheme-index-class")}`}>
      <Searchbar />
      <TrackingPage />
      {/* <BuyTokenForm /> */}
      <TokenList />
    </div>
  )
}
