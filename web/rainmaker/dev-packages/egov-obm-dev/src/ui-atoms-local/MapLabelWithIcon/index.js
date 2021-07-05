import React from "react";
import { connect } from "react-redux";
import MapOnIcon from "../icons/MapOnIcon";
import {LabelContainer} from "egov-ui-framework/ui-containers";
import "./index.css";
import get from "lodash/get";

class MapLabelWithIcon extends React.Component {
  render() {
    let {labelKey,labelValue,jsonpath,preparedFinalObject} = this.props || [] ;
    let longitude = get(preparedFinalObject,jsonpath+".longitude");
    let latitude = get(preparedFinalObject,jsonpath+".latitude");
    return (
      <div style={{paddingLeft : "15px",display: 'flex',alignItems: 'center', paddingTop : "10px"}}>
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
        <a href = {`https://www.google.com/maps?q=${longitude},${latitude}`} 
                  target="_blank" 
                  style={{marginLeft : "10px", padding:"6px",borderRadius:"8px",backgroundColor:"#e2e2e2"}}>{ `Lat: ${longitude} , Long:  ${latitude}`}</a>
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
