import React from "react";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Container, Item } from "egov-ui-framework/ui-atoms";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import {
  getWorkFlowData,
  getDomainLink,
  isWorkflowExists,
  getWaterSource,getSearchResults,findAndReplace
} from "../../ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";
import store from "ui-redux/store";
import { 
  isModifyMode,
  isFreezeMode
} from "../../ui-utils/commons";
import { showHideAdhocPopup ,ifUserRoleExists,convertDateToEpoch} from "../../ui-config/screens/specs/utils";
// import { getRequiredDocData, showHideAdhocPopup } from "egov-billamend/ui-config/screens/specs/utils"

let applicationStatus;

const moveToSuccess = (state,combinedArray, dispatch) => {
  const tenantId = get(combinedArray[0].property, "tenantId") || getQueryArg(window.location.href, "tenantId");
  let purpose = "apply";
  const status = "success";
  //let applicationStatus = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus");
  if(applicationStatus === "PENDING_FOR_CONNECTION_DEACTIVATION" && ifUserRoleExists('WS_CLERK'))
  purpose = "deactivate";
  const applicationNoWater = get(combinedArray[0], "applicationNo");
  const applicationNoSewerage = get(combinedArray[1], "applicationNo");
  let mode = (isModifyMode()) ? "&mode=MODIFY" : (isFreezeMode()) ? "&mode=FREEZE" : ""
  console.log("mode---",mode);
  if (applicationNoWater && applicationNoSewerage) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${applicationNoWater}&applicationNumberSewerage=${applicationNoSewerage}&tenantId=${tenantId}${mode}`
      )
    );
  } else if (applicationNoWater) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoWater}&tenantId=${tenantId}${mode}`
      )
    );
  } else {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoSewerage}&tenantId=${tenantId}${mode}`
      )
    );
  }
};

const parserFunction = (state) => {
  let queryObject = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0]", {})));
  let applyScreenData = JSON.parse(JSON.stringify(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {})));
  console.log("plumber info---"+JSON.stringify(applyScreenData.plumberInfo));
  let parsedObject = {
      roadCuttingArea: parseInt(queryObject.roadCuttingArea),
      meterInstallationDate: convertDateToEpoch(queryObject.meterInstallationDate),
      connectionExecutionDate: convertDateToEpoch(queryObject.connectionExecutionDate),
      dateEffectiveFrom: convertDateToEpoch(queryObject.dateEffectiveFrom),
      proposedWaterClosets: parseInt(queryObject.proposedWaterClosets),
      proposedToilets: parseInt(queryObject.proposedToilets),
      noOfTaps: parseInt(queryObject.noOfTaps),
      noOfWaterClosets: parseInt(queryObject.noOfWaterClosets),
      noOfToilets: parseInt(queryObject.noOfToilets),
      proposedTaps: parseInt(queryObject.proposedTaps),
      propertyId: (queryObject.property) ? queryObject.property.propertyId : null,
      plumberInfo : (applyScreenData.plumberInfo) ? applyScreenData.plumberInfo : null,
      deactivationDate : convertDateToEpoch(applyScreenData.connectionDeactivationDate),
      additionalDetails: {
          initialMeterReading: (
              queryObject.additionalDetails !== undefined &&
              queryObject.additionalDetails.initialMeterReading !== undefined
          ) ? parseFloat(queryObject.additionalDetails.initialMeterReading) : null,
          detailsProvidedBy: (
            applyScreenData.additionalDetails !== undefined &&
            applyScreenData.additionalDetails.detailsProvidedBy !== undefined &&
            applyScreenData.additionalDetails.detailsProvidedBy !== null
          ) ? applyScreenData.additionalDetails.detailsProvidedBy : "",
          lastMeterReading:(
            applyScreenData.additionalDetails !== undefined &&
            applyScreenData.additionalDetails.lastMeterReading !== undefined
        ) ? parseFloat(applyScreenData.additionalDetails.lastMeterReading) : null,
      }
  }
  if(queryObject.id) delete queryObject.id;
  if(queryObject.applicationStatus) queryObject.applicationStatus = "SUBMIT_APPLICATION";
  if(queryObject.processInstance) queryObject.processInstance.action = "SUBMIT_APPLICATION";
  if(queryObject.applicationType) queryObject.applicationType = "FREEZE_WATER_CONNECTION";
  if (typeof parsedObject.additionalDetails !== 'object') {
    parsedObject.additionalDetails = {};
  }
  parsedObject.additionalDetails.locality = queryObject.property.address.locality.code;
  if(!parsedObject.additionalDetails.detailsProvidedBy) 
  {
    if(applyScreenData.plumberInfo)
    parsedObject.additionalDetails.detailsProvidedBy = "ULB";
  } 
  else
  {
    if(parsedObject.additionalDetails.detailsProvidedBy ==="Self")
    parsedObject.plumberInfo = [];

  }
   console.log("parsedObject.additionalDetails.locality---"+JSON.stringify(parsedObject.additionalDetails))
   let input = JSON.stringify(queryObject);
   input = input.replace(/"NA"/g, null);
   let output = JSON.parse(input);  
  queryObject = { ...output, ...parsedObject }
  return queryObject;
}

const validateConnection = (queryObject) =>{   

if(queryObject.plumberInfo && queryObject.deactivationDate && queryObject.additionalDetails.lastMeterReading)
{
  console.log("returning true");
return true;
}
else
{ 
  console.log("returning false");
return false;
}
}

const getWaterObjectForOperations = (state,queryObject) =>{     
  let queryObjectForUpdate =  get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
  //let applicationStatus =  get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus");
 // let waterSource = get(state,"screenConfiguration.preparedFinalObject.DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSourceType", null);
 // let waterSubSource = get(state, "screenConfiguration.preparedFinalObject.DynamicMdms.ws-services-masters.waterSource.selectedValues[0].waterSubSource", null);
  set(queryObjectForUpdate, "tenantId", get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.tenantId"));
  queryObjectForUpdate = { ...queryObjectForUpdate, ...queryObject }
  if(applicationStatus === "PENDING_FOR_CONNECTION_DEACTIVATION" && ifUserRoleExists('WS_CLERK'))
  {
  set(queryObjectForUpdate, "processInstance.action", "DEACTIVATE_CONNECTION");
  set(queryObjectForUpdate, "status", "Inactive");
  console.log("setting status----");
  }
  else
  {
    console.log("else conition---")
    set(queryObjectForUpdate, "processInstance.action", "VERIFY_AND_FORWARD");
  }
 // let finalWaterSource = getWaterSource(queryObjectForUpdate.waterSource, queryObjectForUpdate.waterSubSource);
 // set(queryObjectForUpdate, "waterSource",finalWaterSource);
 // set(queryObjectForUpdate, "waterSourceSubSource", finalWaterSource);
  //set(queryObjectForUpdate, "waterSource", getWaterSource(queryObjectForUpdate.waterSource, queryObjectForUpdate.waterSubSource));
   if (typeof queryObjectForUpdate.additionalDetails !== 'object') {
      queryObjectForUpdate.additionalDetails = {};
  }
  queryObjectForUpdate.additionalDetails.locality = queryObjectForUpdate.property.address.locality.code;
  queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
 //Remove null value from each tax heads
  queryObjectForUpdate.wsTaxHeads.forEach(item => {
      if (!item.amount) {
        item.amount = 0;
      }
    });
    queryObjectForUpdate.roadTypeEst.forEach(item => {
      if (!item.length) {
          item.length = 0;
        }
        if (!item.breadth) {
          item.breadth = 0;
        }
        if (!item.depth) {
          item.depth = 0;
        }
        if (!item.rate) {
          item.rate = 0;
        }

    });
    return queryObjectForUpdate;
}

class Footer extends React.Component {
  state = {
    open: false,
  };
  render() {
    let isFormValid = true;
    let downloadMenu = [];
    //Connection number was not properly populated(Old application was populating) in edit window
    const {
      //connectionNumber,
      tenantId,
      toggleSnackbar,
     // applicationNo,
      applicationNos,
      
      bill,
      state
    } = this.props;
  
     const submitButton = {
      label: "Submit",
      labelKey: "WF_EMPLOYEE_NEWWS1_SUBMIT_APPLICATION",
      link: async () => {     
     
     let method;
     applicationStatus = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus");
     console.log("application status data---"+applicationStatus);
     if(applicationStatus === "PENDING_FOR_CONNECTION_DEACTIVATION" || applicationStatus === "PENDING_FOR_CLERK_APPROVAL" && ifUserRoleExists('WS_CLERK'))
      method =  "UPDATE"
      else
      method = "CREATE";
     let queryObject = parserFunction(state);
     try {
     //console.log("queryObject object---" + JSON.stringify(queryObject));
     console.log("method------"+method)
     if (method === "UPDATE") {
          
        let queryObjectForUpdate = getWaterObjectForOperations(state,queryObject);
       // console.log("queryObjectForUpdate------"+JSON.stringify(queryObjectForUpdate))
        if(applicationStatus === "PENDING_FOR_CONNECTION_DEACTIVATION" && ifUserRoleExists('WS_CLERK'))
        {
        if(validateConnection(queryObject))
        {
        await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdate });
        }
        else
        {
          store.dispatch(toggleSnackbar(true, { labelName: "Enter Plumber details and meter reading" }, "error"));
          console.log(error);
          return false;
        }
        }
        else
        {
        await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: queryObjectForUpdate });
        }
        let searchQueryObject = [{ key: "tenantId", value: queryObjectForUpdate.tenantId }, { key: "applicationNumber", value: queryObjectForUpdate.applicationNo }];
        let searchResponse = await getSearchResults(searchQueryObject);
        store.dispatch(prepareFinalObject("WaterConnection", searchResponse.WaterConnection));
        let combinedArray = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
        moveToSuccess(state,combinedArray, store.dispatch)
     }
     else
     {
     let response = await httpRequest("post", "/ws-services/wc/_create", "", [], { WaterConnection: queryObject });
     store.dispatch(prepareFinalObject("WaterConnection", response.WaterConnection));
     store.dispatch(prepareFinalObject("applyScreen.motorInfo", response.WaterConnection[0].motorInfo));
     store.dispatch(prepareFinalObject("applyScreen.authorizedConnection", response.WaterConnection[0].authorizedConnection));
     store.dispatch(prepareFinalObject("applyScreen.usageCategory", response.WaterConnection[0].usageCategory));
     store.dispatch(prepareFinalObject("applyScreen.pipeSize", response.WaterConnection[0].pipeSize));
     store.dispatch(prepareFinalObject("applyScreen.noOfTaps", response.WaterConnection[0].noOfTaps));
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");

      if (true) { moveToSuccess(state,combinedArray, store.dispatch) }
     }
      
      }catch (error) {
        store.dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
        console.log(error);
        return false;
    }
  
 
      },
    };

     const cancelButton = {
      label: "Cancel",
      labelKey: "WS_ADD_HOC_CHARGES_POPUP_BUTTON_CANCEL",
      link: async () => {     
      console.log("Cancel clicked---");
           store.dispatch(
            setRoute(
              `/wns/search`
            )
          );
 
      },
    };
    //if(applicationType === "MODIFY"){
    //let applicationStatus = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus");
    if(applicationStatus === "PENDING_FOR_CONNECTION_DEACTIVATION" && ifUserRoleExists('WS_CLERK'))
    {
      submitButton.label = "Deactivate Connection";
      submitButton.labelKey = "WS_DEACTIVATE_CONNECTION_BUTTON";
    }
    downloadMenu && downloadMenu.push(submitButton,cancelButton);
   
   /* if (
      businessService.includes("ws-services-calculation") ||
      businessService.includes("sw-services-calculation")
    ) {
      if (bill.Bill && bill.Bill.length > 0) {
        downloadMenu && downloadMenu.push(BillAmendment);
      }
    }*/

    //}
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          marginRight: 15,
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "200px",
        },
      },
      menu: downloadMenu,
    };

    return (
      <div className="wf-wizard-footer" id="custom-atoms-footer">
        <Container>
          <Item xs={12} sm={12} className="wf-footer-container">
            <MenuButton data={buttonItems} />
          </Item>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let connectionObj = get(
    state.screenConfiguration.preparedFinalObject,
    "WaterConnection",
    []
  );



  /* For WorkFlow check */
  let applicationNos = get(
    state.screenConfiguration.preparedFinalObject,
    "applicationNos",
    []
  );
  let bill = get(
    state.screenConfiguration.preparedFinalObject,
    "BILL_FOR_WNS",
    ""
  );
  let connectDetailsData = get(
    state.screenConfiguration.preparedFinalObject,
    "connectDetailsData"
  );



  if (connectionObj.length === 0) {
    connectionObj = get(
      state.screenConfiguration.preparedFinalObject,
      "SewerageConnection",
      []
    );
  }
  const applicationNo =
    connectionObj && connectionObj.length > 0
      ? connectionObj[0].applicationNo
      : "";
 
  /*if(connectDetailsData && connectDetailsData.BillingService && connectDetailsData.BillingService.BusinessService) 
  {const businessService = connectDetailsData.BillingService.BusinessService.map(
    (item) => {
      return item.businessService;
    }
  );}*/
  // console.log("businessService---"+businessService);
  return { state, applicationNo, applicationNos, bill };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
