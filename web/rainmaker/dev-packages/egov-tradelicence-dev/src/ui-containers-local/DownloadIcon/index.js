import React from "react";

import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from "@material-ui/icons/GetApp";
import get from "lodash/get";
import { connect } from "react-redux";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { Component } from "react";

class DownloadIcon extends Component {
  render(){
    return (
      <div>
        <label htmlFor="icon-button-file">
          <IconButton
            onClick={e => {
              // window.location.href=downloadUrl;
              window.open("https://github.com/belegovgithub/egov-mdms-data/raw/BEL-CB-Impl/data/pb/TLHelp/TradeTypeSubtypeDetails_Secunderabad.pdf");
            }}
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <GetAppIcon />
          </IconButton>
        </label>
      </div>
    );
  
    }
   
};

const mapStateToProps = (state, ownprops) => {
    let fieldValue = "";
    //const { jsonPath } = ownprops;
    const { screenConfiguration } = state;
    const { preparedFinalObject } = screenConfiguration;
    
   // const pdfUrl = get(preparedFinalObject,"applyScreenMdmsData.tenant$.tenants[?(@.code== '"+getTenantId+"')].TLhelpUrl");
    //console.info("pdf url====",pdfUrl)
   // console.info("ownprops==",jsonPath)
    // if (jsonPath) {
    //   fieldValue = get(preparedFinalObject, jsonPath);
    // }
  
    return { fieldValue };
  };
  
  export default connect(mapStateToProps)(DownloadIcon);



// export default function UploadButtons({
//   downloadUrl = "https://github.com/belegovgithub/egov-mdms-data/raw/BEL-CB-Impl/data/pb/TLHelp/TradeTypeSubtypeDetails_Secunderabad.pdf"
// }) {
//   return (
//     <div>
//       <label htmlFor="icon-button-file">
//         <IconButton
//           onClick={e => {
//             // window.location.href=downloadUrl;
//             window.open(downloadUrl);
//           }}
//           color="primary"
//           aria-label="upload picture"
//           component="span"
//         >
//           <GetAppIcon />
//         </IconButton>
//       </label>
//     </div>
//   );
// }