import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import './InfoBox.css'
import { themeContext } from "../../App";
import '../Tracker/TrackingPage.css'



const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        // backgroundColor: theme.palette.common.black,
        backgroundColor: '#cac7c7',
        width: '170px', // Custom width
        height: 'fit-content',
        boxShadow: '0 0 11px rgba(33,33,33,.2)',
    },
}));


export default function InfoBox({ data }) {
    const { theme } = React.useContext(themeContext)
    return (
            <div className='d-flex align-items-end justify-content-end'>
                <BootstrapTooltip title={`${data}`}>
                    {/* <div className={`${theme === "lightTheme" && 'infoIcoxOuterBox' } ${theme === "dimTheme" && "infoIcoxOuterBox_theme"}`}>
                        <span className={`${theme === "lightTheme" && 'InfoIcon' } ${theme === "dimTheme" && "InfoIcon_theme"}`}>i</span>
                    </div> */}
                    <i className={`fas mx-2 fa-exclamation-circle ${theme}`}/>
                </BootstrapTooltip>
            </div>
    );
}