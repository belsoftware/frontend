import React from "react";
import PropertyTaxIcon from '../../../images/property-tax.svg'
import DashBoardIcon from '../../../images/dashboards.svg'
import ComplaintsIcon from '../../../images/complaints.svg'
import TradeIcon from '../../../images/trade-license.svg'
import WaterSewerage from '../../../images/water_sewerage.svg'
import LeaseIcon from '../../../images/lease.svg'
import BirthIcon from '../../../images/birth.svg'
import DeathIcon from '../../../images/death.svg'
import mCollectIcon from '../../../images/mCollect.svg'
import Sewerage from '../../../images/sewerage.svg'
import Style from './Styles'
import { withStyles } from '@material-ui/core/styles';

import SVG from 'react-inlinesvg';

class Icon extends React.Component {
    constructor(props) {
        super(props);

    }

    renderIcons(type) {
        let { classes } = this.props;
        switch (type.toLowerCase()) {
            case 'overview':
            case 'dss_overview':
                return <SVG src={DashBoardIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px', color: 'white' }}></SVG>
            case 'property tax':
            case 'dss_property_tax':
                return <SVG src={PropertyTaxIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'trade license':
            case 'dss_trade_licence':
                return <SVG src={TradeIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'complains':
            case 'dss_complains':
                return <SVG src={ComplaintsIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'dss_sewerage':
                return <SVG src={Sewerage} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'water':
            case 'dss_water':
                return <SVG src={WaterSewerage} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'lease':
            case 'dss_lease':
                return <SVG src={LeaseIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'birth':
            case 'dss_birth':
                return <SVG src={BirthIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'death':
            case 'dss_death':
                return <SVG src={DeathIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'mCollect':
            case 'dss_m_collect':
                return <SVG src={mCollectIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            default:
                return <div></div>

        }


    }

    render() {
        return (
            <div>{this.renderIcons(this.props.type)}</div>
        )
    }
}

export default withStyles(Style)(Icon);