import React from "react";
import { connect } from "react-redux";
import MapOnIcon from "../icons/MapOnIcon";
import {LabelContainer} from "egov-ui-framework/ui-containers";
//import "./index.css";
import get from "lodash/get";

class MapLabelWithIcon extends React.Component {
  render() {
    let {labelKey,labelValue,jsonpath,preparedFinalObject} = this.props || [] ;
    var  geoLocation =get(preparedFinalObject,jsonpath+".geoLocation");
    var locationarray=geoLocation.split(',');
    return (
      <div style={{paddingLeft : "5px",display: 'flex',alignItems: 'center', paddingTop : "10px"}}>
        <MapOnIcon/>
        <LabelContainer
          labelKey={labelKey}
          style ={{marginLeft : "10px"}}
        />
        <LabelContainer
          labelKey={labelValue}
          style={{
            marginLeft : 10
          }}
        />
        <a href = {`https://www.google.com/maps?q=${locationarray[0]},${locationarray[1]}`} 
                  target="_blank" 
                  style={{marginLeft : "10px", padding:"6px",borderRadius:"8px",backgroundColor:"#e2e2e2"}}>{ `Lat: ${locationarray[0]} , Long:  ${locationarray[1]}`}</a>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject};
};

export default connect(
    mapStateToProps
  )(MapLabelWithIcon);
