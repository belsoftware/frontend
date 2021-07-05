import React from "react";
import LocationOnIcon from "../../ui-atoms-local/icons/LocationOnIcon";
import {LabelContainer} from "egov-ui-framework/ui-containers";
import "./index.css";

class LocationLabelWithIcon extends React.Component {
  render() {
    let {labelKey,labelValue} = this.props;
    return (
      <div style={{paddingLeft : "15px",display: 'flex',alignItems: 'center', paddingTop : "10px"}}>
        <LocationOnIcon/>
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
      </div>
    );
  }
}
export default LocationLabelWithIcon ;
