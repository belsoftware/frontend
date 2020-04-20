import React, { Component } from "react";
import  MultiDownloadCard  from "../../ui-molecules-local/MultiDownloadCard";
import { connect } from "react-redux";
import get from "lodash/get";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import "./index.scss";

class DownloadFileContainer extends Component {
  render() {
    const { data, documentData, bpaDetails, ...rest } = this.props;
    let isValid = window.location.pathname.includes('apply');
      {
        if(isValid && documentData) {
        for (let key in documentData) {
          documentData[key].previewdocuments &&
          documentData[key].previewdocuments.map(docs => {
            if (docs.wfState === "SEND_TO_CITIZEN") {
              docs.createdBy = "BPA Architect"
            }
            else if(docs.wfState === "DOC_VERIFICATION_PENDING") {
              docs.createdBy = "BPA Document Verifier"
            }
            else if (docs.wfState === "FIELDINSPECTION_PENDING") {
              docs.createdBy = "BPA Field Inspector"   
            }
            else if (docs.wfState === "NOC_VERIFICATION_PENDING") {
              docs.createdBy = "BPA Noc Verifier"    
            } else if(docs.wfState === "BACK_FROM_DOC_VERIFICATION") {
              docs.createdBy = "Back From Doc Verifier" 
            } else if(docs.wfState === "BACK_FROM_FI_VERIFICATION") {
              docs.createdBy = "Back From Field Inspector" 
            } else if(docs.wfState === "BACK_FROM_NOC_VERIFICATION") {
              docs.createdBy = "Back From Noc Verifier" 
            }
            data.push(docs);
          })
        }
    }
  } 
    return (
      <MultiDownloadCard data={data} documentData={documentData} {...rest} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const data = get(
    screenConfiguration.preparedFinalObject,
    ownProps.sourceJsonPath,
    []
  );
  const documentData = get(
    screenConfiguration.preparedFinalObject,
    "documentDetailsUploadRedux",
    []
  );
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  );
  return { data, documentData, bpaDetails };
};

export default connect(
  mapStateToProps,
  null
)(DownloadFileContainer);