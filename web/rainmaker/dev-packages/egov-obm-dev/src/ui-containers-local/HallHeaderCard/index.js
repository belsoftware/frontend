import React,{Component } from "react";
import { connect} from "react-redux";
import { Card,CardContent, Grid, Typography, Button } from "@material-ui/core";
//import Icon from "@material-ui/core/Icon";
import {CardMedia } from "egov-ui-framework/ui-atoms";
import Container from "egov-ui-framework/ui-atoms/Layout/Container";
//import {Card} from '@material-ui/core/Card';
//import Image from "components";
import {Image } from "components";
import ImageLoader from "react-load-image";
import Label from "egov-ui-kit/utils/translationNode";
import LocationLabelWithIcon from "../../ui-atoms-local/LocationLabelWithIcon";
import MapLabelWithIcon from "../../ui-atoms-local/MapLabelWithIcon";
import MapOn from "../../ui-atoms-local/icons/MapOnIcon";
import{Carousel} from "egov-ui-framework/ui-molecules";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions"; 
import get from "lodash/get";
import {Div} from "egov-ui-framework/ui-atoms/HtmlElements/Div";
import {LabelContainer,TextFieldContainer} from "egov-ui-framework/ui-containers";
import TextField from '@material-ui/core/TextField';
import { getCommonCard,getCommonContainer,getLabelWithValue,getCommonGrayCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import {RadioButtonsGroup} from "egov-ui-framework/ui-containers";
import { divide } from "lodash";
import "./index.css";
//import {Div} from "egov-ui-framework/ui-atoms/HtmlElements";

const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};
class HallHeaderCard extends Component {
  
  state = {
    results: [],
    searchTerm: "",
    selectedEmployeeId: "",
    dataSource: [],
  };

  componentDidMount = () => {

  };

  componentWillReceiveProps = (nextProps) => {

  };

  appCardHeaderStyle = (colorOne = "#ec407a", colorTwo = "#d81b60") => {
    return {
      color: "#FFFFFF",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50px",
      padding: "15px",
      marginTop: "-36px",
      borderRadius: "3px",
      background: `linear-gradient(60deg,${colorOne} ,${colorTwo} )`,
      boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)"
    };
  };
  
  imageClick = (portalUrl)=> {
    window.open(portalUrl, '_blank');
  }

  render() {
  
    let {jsonPath,preparedFinalObject} = this.props || [];
    let HallName = get(preparedFinalObject,jsonPath+".name");
    let Halladdress = get(preparedFinalObject,jsonPath+".address");
    let HallDescription =get(preparedFinalObject,jsonPath+".hallDescription");
    let contactNo =get(preparedFinalObject,jsonPath+".contactDetails");
    let headerImageUrl =get(preparedFinalObject,jsonPath+".headerImageUrl");
    let portalUrl =get(preparedFinalObject,jsonPath+".portalUrl");

    return ( 
             <div>
                    <Card>
                      
                    <div style={{display:"flex"}}>
                          <div><CardMedia  image={headerImageUrl}   onClick={()=>this.imageClick(portalUrl)} style = {{height: 200, width : 200, margin: 5 }}/> </div>
                          <div><div style={{paddingTop: "5px",paddingLeft : "10px"}} ><LabelContainer
                                labelKey={`OBM_HALL_NAME :  ${HallName}`} style={{
                                  fontSize: "20px",
                                  }}
                                /></div>
                          <div><LocationLabelWithIcon labelKey={"OBM_ADDRESS_LOCATION_KEY"} labelValue={Halladdress}  /></div>
                          <div><MapLabelWithIcon labelKey={"OBM_ADDRESS_MAP_KEY"} labelValue={"OBM_ADDRESS_MAP_VALUE"} jsonpath={jsonPath} ></MapLabelWithIcon></div>
                          <div style={{paddingTop: "5px",paddingLeft : "10px"}}><LabelContainer
                                labelKey={`OBM_HALL_DESCRIPTION :  ${HallDescription}`}/></div>
                          <div style={{paddingTop: "10px",paddingLeft : "10px"}} ><LabelContainer labelKey={`   ContactNo :  ${contactNo}`} /></div>
                          </div>
                            
                 </div>
                  </Card>
             </div>     
       )
};
}
const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPath };
};
export default connect(
    mapStateToProps
  )(HallHeaderCard);