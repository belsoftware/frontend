import React from "react";
import Grid from '@material-ui/core/Grid';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from '../../actions/apitransport/apitransport';
import { Typography } from '@material-ui/core';
import style from './styles';
import { withStyles } from '@material-ui/core/styles';
import Card from "../common/Card/Card";
import CardBody from "../common/Card/CardBody.js";
import CardHeader from "../common/Card/CardHeader.js";
import CardIcon from "../common/Card/CardIcon.js";
import CustomCard from '../common/CustomCard/CustomCard'
import Paper from '@material-ui/core/Paper';
import Variables from '../../styles/variables'
import Icons from '../common/Icon/Icon'
import getFilterObj from '../../actions/getFilterObj';
import history from '../../utils/web.history';
import _ from 'lodash';
import dashboardAPI from '../../actions/dashboardAPI';
import { isMobile } from 'react-device-detect';
import CustomizedMenus from '../Dashboard/download';
import CustomizedShare from '../Dashboard/share';
import FilterIcon from '@material-ui/icons/FilterList';
import Button from '@material-ui/core/Button';
import Menu from '../common/CustomMenu'
import getFinancialYearObj from '../../actions/getFinancialYearObj';
import mdmsAPI from '../../actions/mdms/mdms';
import moment from 'moment';
import {getQueryArg,capitalizeFirstLetter} from "../../actions/commons"
import constants from "../../actions/constants";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: this.props.GFilterData,
            page: _.get(this.props, 'match.params.pageId'),
            dontShowHeader: true,
            getFYobj:getFinancialYearObj(),
            dashboardConfigData: []
        };
    }

    async componentDidMount() {
        await this.workingOnLabelText()
    }

    lightenDarkenColor(col, amt) {
        var usePound = false;

        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }

        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;

        if (r > 255) r = 255;
        else if (r < 0) r = 0;

        var b = ((num >> 8) & 0x00FF) + amt;

        if (b > 255) b = 255;
        else if (b < 0) b = 0;

        var g = (num & 0x0000FF) + amt;

        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        let color = (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
        return color
    }

    handleOnClick(path) {
        history.push(`${process.env.PUBLIC_URL}/` + path)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dashboardConfigData !== this.props.dashboardConfigData) {
            this.setState({
                dashboardConfigData: this.props.dashboardConfigData
            })
        }
    }

    renderChart(data, index) {
        //console.log("Check the data nd index ",data,index,Variables.colors[index].light);
        let { chartLabelName } = this.state;
        let { classes, strings } = this.props;
        let filters = getFilterObj(this.props.GFilterData, this.props.mdmsData, this.state.page);
        let bgColor = Variables.colors[index].light
        let iconColor = Variables.colors[index].dark
        // switch(data.moduleLevel)
        // {
        //     case 'LAMS':
        //         bgColor = Variables.colors[4].light
        //         iconColor = Variables.colors[4].dark
        //         break;
        //     default: break; 
        // }
        let pageId = ''
        let moduleLevel = ''

        if (data) {
            if (data.ref && data.ref.url) {
                pageId = data.ref.url
            }
            if (data.moduleLevel) {
                moduleLevel = data.moduleLevel
                if (!filters['modulelevel']) {
                    filters.modulelevel = data.moduleLevel
                }
            }
        }
        if (data.vizType.toUpperCase() === 'COLLECTION') {
            return (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.paper} style={{ paddingBottom: '5px' }}>
                 <Card color="blue" bgColor={"rgba(33, 150, 243, 0.24)"} page={pageId}>
                        <CardHeader color="rose" icon page={pageId || 'overview'}>
                            <CardIcon  color="rose" bgColor={"#2196F3"}>
                                <Icons type={data.name}></Icons>
                            </CardIcon>
                            <div style={{ textAlign: 'left', color: 'black', }}>
                                <Typography className={classes.cardTitle}>{strings[data.name] || data.name}</Typography>
                            </div>

                        </CardHeader>
                        <CardBody page={pageId || 'overview'}>
                            <Grid container spacing={24}>
                                {
                                    data && data.charts && Array.isArray(data.charts) && data.charts.length > 0 && data.charts.map((d, i) => {
                                        return (
                                            <Grid item xs={12} sm={6} md={6} lg={4} xl={4} className={classes.customCard}>
                                                <CustomCard key={d.id} moduleLevel={moduleLevel} chartData={d} filters={filters} type="overview" page={window.location.pathname || ''}></CustomCard>
                                            </Grid>
                                        )  
                                    })
                                }   
                            </Grid>
                        </CardBody>
                </Card>
            </Grid>
            
                                            
            )
        }
        else {
            return (
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} className={classes.root} >

                    <Card color="blue" bgColor={bgColor} page={pageId}>
                        <CardHeader color="rose" icon page={pageId || 'overview'}>
                            <CardIcon color="rose" bgColor={iconColor}>
                                <Icons type={data.name}></Icons>
                            </CardIcon>
                            <div style={{ textAlign: 'left', color: 'black', }}>
                                <Typography className={classes.cardTitle}>{strings[data.name] || data.name}</Typography>
                            </div>

                        </CardHeader>
                        <CardBody page={pageId || 'overview'}>
                            <Grid container spacing={24}>
                                {
                                    data && data.charts && Array.isArray(data.charts) && data.charts.length > 0 && data.charts.map((d, i) => {
                                        return <Grid item xs={6} sm={12} md={6} lg={6} xl={6} className={classes.customCard}>
                                            <CustomCard chartLabelName={chartLabelName} key={d.id} moduleLevel={moduleLevel} chartData={d} filters={filters} type="module" page={window.location.pathname || ''}></CustomCard></Grid>
                                    })
                                }
                            </Grid>
                        </CardBody>
                    </Card>
                </Grid>
            )
        }

    }

    callDashboardAPI() {
        let dashboardApi = new dashboardAPI(20000);
        let overview = false
        if (_.toLower(this.state.page) === 'dashboard' || typeof this.state.page == 'undefined') {
            overview = true
        } else {
            this.setState({
                dontShowHeader: false
            })
        }

        let path = ''
        if(window.location.pathname && window.location.pathname.includes('citizen-home')){
            path= 'citizen-home'
        }
        else
        if (window.location.pathname && window.location.pathname.includes('ulb-')) {
            path = 'ulb-home'
        } else {
            path = 'home'

        }
        this.props.APITransport(dashboardApi, path || 'home');

    }

    setTenantIdfromUrl() {
        let cant = "pb."+getQueryArg(window.location.href,"cant");
        if(constants.VALID_TENANT_IDS.indexOf(cant) > -1)
        {
            localStorage.setItem("tenant-id", cant);
        }
        else
        {
            localStorage.setItem("tenant-id", "pb");
        }
    }

    setLangfromUrl() {
        let lang = getQueryArg(window.location.href,"lang");
        if(["en_IN","hi_IN","kn_IN","ml_IN","ta_IN", "te_IN","mr_IN"].indexOf(lang) > -1)
        {
            localStorage.setItem("Employee.locale", lang);
        }
        else
        {
            localStorage.setItem("Employee.locale", "en_IN");
        }
    }

    componentDidMount() {
        let newFilterData = this.state.filter
        newFilterData.duration.value.startDate = this.state.getFYobj.value.launchedDate
        newFilterData.duration.value.endDate = this.state.getFYobj.value.endDate

        this.setState({
            filter: newFilterData
        })

        let mdmsApi = new mdmsAPI(20000);
        this.props.APITransport(mdmsApi);

        if(window.location.pathname && window.location.pathname.includes('citizen-home')){
            this.setTenantIdfromUrl();
            this.setLangfromUrl();
        }

        this.callDashboardAPI();
    }

    getTitleText(strings){
        
        let title,fromTxt,toTxt;

        fromTxt = (strings["DSS_FROM"])? strings["DSS_FROM"] : "DSS_FROM";
        toTxt = (strings["DSS_TO"])? strings["DSS_TO"] : "DSS_TO";

        title = fromTxt + " " + moment.unix(this.state.getFYobj.value.startDate).format("MMM, DD YYYY") + " " +toTxt +" " + moment().format("MMM, DD YYYY")

        if(window.location.pathname && window.location.pathname.includes('citizen-home')){
            fromTxt = (strings["DSS_AS_ON"])? strings["DSS_AS_ON"] : "DSS_AS_ON";
            title = fromTxt + " " + moment().format("MMM, DD YYYY");
            return title;
        }

        return title;
    }

    getCantBoardName(){
        if(window.location.pathname && window.location.pathname.includes('citizen-home')){
            let cant = "pb."+getQueryArg(window.location.href,"cant");
            if(constants.VALID_TENANT_IDS.indexOf(cant) > -1)
            {
                if(constants.TENANT_NAMES[cant])
                    return constants.TENANT_NAMES[cant];
                return capitalizeFirstLetter(getQueryArg(window.location.href,"cant"));
            }
        }
        return "";
    }

    render() {
        let { classes, strings } = this.props;
        let { dashboardConfigData } = this.state;
        let tabsInitData = dashboardConfigData && Array.isArray(dashboardConfigData) && dashboardConfigData.length > 0 && dashboardConfigData[0] ? dashboardConfigData[0] : ''
        let dashboardName = dashboardConfigData && Array.isArray(dashboardConfigData) && dashboardConfigData.length >= 0 && dashboardConfigData[0] && dashboardConfigData[0].name && dashboardConfigData[0].name
        if(dashboardConfigData && Array.isArray(dashboardConfigData) && dashboardConfigData.length > 0)
        {
            return (

                <Grid container spacing={24} id="divToPrint">
                    <Grid container spacing={24} className={classes.actions}>

                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8} className={classes.pageHeader}>
                            {(this.props.strings[dashboardName] || dashboardName ) /*+" - " + this.getCantBoardName()*/} 
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={8} lg={8} xl={8} className={classes.pageHeader}
                            style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                            {this.getCantBoardName()} 
                        </Grid> */}
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                            {/* {isMobile && <div id="divNotToPrint" data-html2canvas-ignore="true" className={classes.posit}>

                                <Menu type="download" bgColor="white" color="black" fileHeader="SURE Dashboard" fileName={dashboardName}></Menu>
                                {!this.state.dontShowHeader &&
                                    <Button className={classes.btn1} data-html2canvas-ignore="true"
                                        onClick={this.handleFilters.bind(this)}
                                        fileName={dashboardName}
                                    >
                                        <FilterIcon></FilterIcon>
                                    </Button>
                                }
                            </div>
                            } */}

                            {!isMobile && <div id="divNotToPrint" className={classes.acbtn} style={{ display: 'flex', justifyContent: 'flex-end', }}>
                                
                            </div>}
                        </Grid>

                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography className={classes.filter}>{this.getTitleText(strings)}</Typography>
                    </Grid>
                    {isMobile && <div id="divNotToPrint" className={classes.acbtn} style={{ display: 'flex', justifyContent: 'flex-end', }}>
                        {/* <CustomizedMenus key="download" fileName={dashboardName} fileHeader="Cantonment Areas Real time Executive (CARE) Dashboard" />
                        <CustomizedShare key="share" fileName={dashboardName} /> */}
                    </div>}

                    {/* {tabsInitData.visualizations && Array.isArray(tabsInitData.visualizations) && tabsInitData.visualizations.length > 0 && this.gettingData(tabsInitData.visualizations)} */}
                    {tabsInitData.visualizations && Array.isArray(tabsInitData.visualizations) && tabsInitData.visualizations.length > 0 && tabsInitData.visualizations.map((k, v) => {
                        return (
                            k.vizArray && Array.isArray(k.vizArray) && k.vizArray.length > 0 && k.vizArray.map((data, index) => {
                                // if (data.vizType.toUpperCase() !== 'COLLECTION') { this.gettingData(data) }
                                return (this.renderChart(data, index))

                            })
                        )
                    })}

                </Grid>
            )
        }
        else
        {
            return null;
        }
    }
}

const mapStateToProps = state => ({
    strings: state.lang,
    dashboardConfigData: state.firstReducer.dashboardConfigData,
    mdmsData: state.mdmsData,
    GFilterData: state.GFilterData
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            APITransport: APITransport,
        },
        dispatch
    );

export default withStyles(style)(connect(
    mapStateToProps,
    mapDispatchToProps
)(Home));