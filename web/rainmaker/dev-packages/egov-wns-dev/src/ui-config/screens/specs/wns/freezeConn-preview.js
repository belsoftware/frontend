import {
    getCommonCard,
    getCommonContainer, getCommonGrayCard, getCommonHeader,
    getCommonSubHeader, getCommonTitle,
    getLabelWithValueForModifiedLabel,getLabel
   
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg, setBusinessServiceDataToLocalStorage, setDocuments } from "egov-ui-framework/ui-utils/commons";
  import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
  import get from "lodash/get";
  import set from "lodash/set";
  import { findAndReplace, getDescriptionFromMDMS, getSearchResults, getSearchResultsForSewerage,
            getWaterSource, getWorkFlowData, isModifyMode, serviceConst, swEstimateCalculation, waterEstimateCalculation,waterBillEstimateCalculation, getConsumptionDetails,
            isFreezeMode,fetchBill,billingPeriodMDMS } from "../../../../ui-utils/commons";
  import {
    convertDateToEpoch, createEstimateData,
    getDialogButton,getBillEstimateDialogButton, getFeesEstimateOverviewCard,
    getTransformedStatus, showHideAdhocPopup,handleNA,handlePropertySubUsageType,
    getFeesEstimateCard
  } from "../utils";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { downloadPrintContainer } from "../wns/acknowledgement";
  import { adhocPopup } from "./applyResource/adhocPopup";
  import { getReviewDocuments } from "./applyResource/review-documents";
  import { getReviewOwner } from "./applyResource/review-owner";
  import { getReviewConnectionDetails } from "./applyResource/review-trade";
  import { snackbarWarningMessage } from "./applyResource/reviewConnectionDetails";
  import { reviewDeactivationEffective } from "./applyResource/reviewDeactivationEffective";
  
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let consumerCode = getQueryArg(window.location.href, "connectionNumber");
  let service = getQueryArg(window.location.href, "service");
  let serviceModuleName,serviceUrl;
  let redirectQueryString = `applicationNumber=${applicationNumber}&tenantId=${tenantId}&connectionNumber=${consumerCode}`;
  let editredirect = `freezeConn?${redirectQueryString}&action=edit`;
  let headerLabel = "WS_TASK_DETAILS"



  let title = getCommonTitle({ labelName: titleText });

  let titleText = "";
  const getHeader = label => {
    return {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-wns",
      componentPath: "DividerWithLabel",
      props: {
        className: "hr-generic-divider-label",
        labelProps: {},
        dividerProps: {},
        label
      },
      type: "array"
    };
  };

  const propertyDetailsHeader = getHeader({
    labelKey: "WS_COMMON_PROP_DETAIL"
  });

  const propertyDetails={
  reviewPropertyId: getLabelWithValueForModifiedLabel(
    {
      labelName: "Property Id",
      labelKey: "WS_PROPERTY_ID_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.propertyId",
      callBack: handleNA
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    { jsonPath: "WaterConnectionOld[0].property.propertyId", callBack: handleNA },
  ),
  reviewPropertyType: getLabelWithValueForModifiedLabel(
    {
      labelName: "Property Type",
      labelKey: "WS_PROPERTY_TYPE_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.propertyType",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPTYPE"
      }
      
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.propertyType",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPTYPE"
      }
      
    },
  ),
  reviewPropertyUsageType: getLabelWithValueForModifiedLabel(
    {
      labelName: "Property Usage Type",
      labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPUSGTYPE"
      }        
    },
    {
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPUSGTYPE"
      }
      
    }
  ),

  reviewPropertySubUsageType: getLabelWithValueForModifiedLabel(
    {
      labelName: "Property Sub usage type",
      labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.units[0].usageCategory",
      callBack: handlePropertySubUsageType,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPSUBUSGTYPE"
      }
    },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.units[0].usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPSUBUSGTYPE"
      }
      
    }
  ),
  reviewPlotSize: getLabelWithValueForModifiedLabel(
    {
      labelName: "Plot Size (in sq metres)",
      labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.landArea",
    callBack: handleNA },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.landArea",
      callBack: handleNA      
    }
  ),
  reviewNumberOfFloors: getLabelWithValueForModifiedLabel(
    {
      labelName: "Number Of Floors",
      labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.noOfFloors",
    callBack: handleNA },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.noOfFloors",
      callBack: handleNA      
    }
  ),
  reviewNumberOfFlats: getLabelWithValueForModifiedLabel(
    {
      labelName: "Number Of Flats",
      labelKey: "WS_PROPERTY_NO_OF_FLATS_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.noOfFlats",
    callBack: handleNA },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.noOfFlats",
      callBack: handleNA      
    }
  ),
  reviewArv: getLabelWithValueForModifiedLabel(
    {
      labelName: "Arv",
      labelKey: "WS_PROPERTY_ARV_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.units[0].arv",
    callBack: handleNA },{
      labelKey: "WS_OLD_LABEL_NAME"
    },
    {
      jsonPath: "WaterConnectionOld[0].property.units[0].arv",
      callBack: handleNA      
    }
  ),

}

 

   
  export const reviewConnectionDetails = getReviewConnectionDetails(false);

  

  export const reviewOwnerDetails = getReviewOwner(false);
 const reviewModificationsDetails = reviewDeactivationEffective(process.env.REACT_APP_NAME !== "Citizen");

 export const reviewDocumentDetails = getReviewDocuments(false);

  const headerrow = getCommonContainer({
    header: getCommonHeader({
      labelKey: headerLabel
    }),
    application: getCommonContainer({
      applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-wns",
        componentPath: "ApplicationNoContainer",
        props: {
          number: getQueryArg(window.location.href, "applicationNumber")
        }
      }
    }),
    connection: getCommonContainer({
      connectionNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-wns",
        componentPath: "ConsumerNoContainer",
        props: {
          number: ""
        }
      }
  
    })
  });

  const resetData = () => {
    applicationNumber = getQueryArg(window.location.href, "applicationNumber");
     consumerCode = getQueryArg(window.location.href, "connectionNumber");
    service = getQueryArg(window.location.href, "service");
    serviceModuleName = service === serviceConst.WATER ? "NewWS1" : "NewSW1";
    serviceUrl = serviceModuleName === "NewWS1" ? "/ws-services/wc/_update" : "/sw-services/swc/_update";
     redirectQueryString = `applicationNumber=${applicationNumber}&tenantId=${tenantId}&connectionNumber=${consumerCode}`;
     editredirect = `freezeConn?${redirectQueryString}&action=edit`;
    if (isFreezeMode()) {
      redirectQueryString += '&mode=FREEZE';
      editredirect += '&mode=FREEZE&service=WATER';
      if (service === serviceConst.WATER) {
        headerLabel = "WS_MODIFY_TASK_DETAILS"
      } else {
        headerLabel = "SW_MODIFY_TASK_DETAILS"
      }
    }
  
  }

  const estimateCard = getCommonGrayCard({
    header: getCommonSubHeader({ labelKey: "WS_VIEWBILL_DETAILS_HEADER" }),
    estimateSection: getFeesEstimateCard({ sourceJsonPath: "viewBillToolipData" }),
     
  });


  export const taskDetails = getCommonCard({
    title,
    estimateCard, 
    reviewConnectionDetails,
    reviewOwnerDetails,
    reviewModificationsDetails
  });

  const processBills = async (state, data, viewBillTooltip, dispatch) => {
    data.Bill[0].billDetails.forEach(bills => {
      let des, obj, groupBillDetails = [];
      bills.billAccountDetails.forEach(async element => {
        let cessKey = element.taxHeadCode;
        let body;
        if (service === serviceConst.WATER) {
          body = { "MdmsCriteria": { "tenantId": getTenantId(), "moduleDetails": [{ "moduleName": "ws-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
        } else {
          body = { "MdmsCriteria": { "tenantId": getTenantId(), "moduleDetails": [{ "moduleName": "sw-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
        }
        let res = await getDescriptionFromMDMS(body, dispatch)
        if (res !== null && res !== undefined && res.MdmsRes !== undefined && res.MdmsRes !== null) {
          if (service === serviceConst.WATER) { des = res.MdmsRes["ws-services-calculation"]; }
          else { des = res.MdmsRes["sw-services-calculation"]; }
          if (des !== null && des !== undefined && des[cessKey] !== undefined && des[cessKey][0] !== undefined && des[cessKey][0] !== null) {
            groupBillDetails.push({ key: cessKey, value: des[cessKey][0].description, amount: element.amount, order: element.order })
          } else {
            groupBillDetails.push({ key: cessKey, value: 'Please put some description in mdms for this Key', amount: element.amount, order: element.order })
          }
          if (groupBillDetails.length >= bills.billAccountDetails.length) {
            let arrayData = groupBillDetails.sort((a, b) => parseInt(a.order) - parseInt(b.order))
            obj = { bill: arrayData, fromPeriod: bills.fromPeriod, toPeriod: bills.toPeriod,demandId: bills.demandId }
            viewBillTooltip.push(obj)
          }
          if (viewBillTooltip.length >= data.Bill[0].billDetails.length) {          
            let bPeriodMDMS = get(state.screenConfiguration.preparedFinalObject, "billingPeriodMDMS", {});
            let sortedBills = viewBillTooltip.sort((a, b) => b.toPeriod - a.toPeriod);
            //In case of old bill consider the latest bill to period
            let expiryDemandDate =  billingPeriodMDMS(sortedBills[0].toPeriod,bPeriodMDMS,service);
  
            let dataArray = [{
              total: data.Bill[0].totalAmount,
              expiryDate: expiryDemandDate
            }]
            
            let forward = 0;
            let currentDemand=sortedBills[0];
            if (data.Bill[0].totalAmount < 0) {
              sortedBills.forEach(e => {
                e.bill.forEach(cur => {
                  if (cur.key === "WS_ADVANCE_CARRYFORWARD"||cur.key === "SW_ADVANCE_CARRYFORWARD") {
                    forward = forward + cur.amount
                  }
                });
              }); 
              let keyExist = false;
              currentDemand.bill.forEach(cur => {
                if (cur.key === "WS_ADVANCE_CARRYFORWARD"|| cur.key === "SW_ADVANCE_CARRYFORWARD") {
                  cur.amount = forward;
                  keyExist = true;
                }
              });
              if (!keyExist) {
                currentDemand.bill.push({
                  amount: forward,
                  key: "ADVANCE_CARRYFORWARD",
                  order: 2,
                  value: "Please put some description in mdms for this key"
                })
              }
            }
            let totalArrears = 0;
            if (data.Bill[0].totalAmount > 0) {
              sortedBills.shift();
              sortedBills.forEach(e => { e.bill.forEach(o => { totalArrears = totalArrears + o.amount }); })
            }
  
            let finalArray = [{
              arrears: totalArrears,
              arrearsDescription: "Total outstanding payment of previous billing cycles.",
              description: currentDemand,
              data: dataArray
            }]
            console.log("DC-FINAL_ARRY",finalArray);
            dispatch(prepareFinalObject("viewBillToolipData", finalArray));
          }
        }
      })
    })
  }



  const searchResults = async (action, state, dispatch, applicationNumber, processInstanceAppStatus) => {
    let queryObjForSearch = [{ key: "tenantId", value: tenantId }, { key: "applicationNumber", value: applicationNumber }]
    let viewBillTooltip = [], estimate,billEstimate, payload = [],data;
    if (service === serviceConst.WATER) {
      payload = [];
      payload = await getSearchResults(queryObjForSearch);
      console.log("payload---"+payload);
      set(payload, 'WaterConnection[0].service', service);
      const convPayload = findAndReplace(payload, "NA", null)
      
     console.info("DC-consumer code=",getQueryArg(window.location.href, "connectionNumber", null));
     let consumercode = getQueryArg(window.location.href, "connectionNumber", null);
      let queryObjectForFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: consumercode}, { key: "businessService", value: "WS" }];
    
      data = await fetchBill(queryObjectForFetchBill, dispatch);  
      if (payload !== null && payload !== undefined && data !== null && data !== undefined) {
        if (payload.WaterConnection.length > 0 && data.Bill.length > 0) {
          payload.WaterConnection[0].service = service
          await processBills(state,data, viewBillTooltip, dispatch);
       
          dispatch(prepareFinalObject("billData", data.Bill[0]));
        }
      }

      payload.WaterConnection[0].wsTaxHeads.forEach(item => {   
     if (!item.amount || item.amount == null) {
       item.amount = 0;
     }
       });
   console.log("processInstanceAppStatus---"+processInstanceAppStatus);
      let queryObjectForEst = [{
        applicationNo: applicationNumber,
        tenantId: tenantId,
        waterConnection: convPayload.WaterConnection[0]
      }]
      
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", true);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirteen.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.headerDiv.children.header.children.key.props.labelKey", "WS_ADDL_DTL");
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.headerDiv.children.header.children.key.props.labelName", "Additional Details");
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewNine.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", true);
      if (payload !== undefined && payload !== null) {
        dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
        if (get(payload, "WaterConnection[0].property.status", "") !== "ACTIVE") {
          set(action.screenConfig, "components.div.children.snackbarWarningMessage.children.clickHereLink.props.propertyId", get(payload, "WaterConnection[0].property.propertyId", ""));
          set(action.screenConfig, "components.div.children.snackbarWarningMessage.children.clickHereLink.visible", true);
        }
        if (!payload.WaterConnection[0].connectionHolders || payload.WaterConnection[0].connectionHolders === 'NA') {
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", false);
         // set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", true);
        } else {
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", false);
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", true);
        }
      }
      if (processInstanceAppStatus === "PENDING_FOR_CLERK_APPROVAL") {
        let connectionNumber = payload.WaterConnection[0].connectionNo;
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number", connectionNumber);
      } else {
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible", false);
      }
      dispatch(prepareFinalObject("DocumentsData",[]));
      // to set documents 
      if (payload.WaterConnection[0].documents !== null && payload.WaterConnection[0].documents !== "NA") {
        await setDocuments(
          state.screenConfiguration.preparedFinalObject,
          "WaterConnection[0].documents",
          "DocumentsData",
          dispatch,
          "WS"
        );
      }

    
  
      if (isFreezeMode()) {
        let connectionNo = payload.WaterConnection[0].connectionNo;
        console.log("connectionNo in isfreeze mode---"+connectionNo);
        let queryObjForSearchApplications = [{ key: "tenantId", value: tenantId }, { key: "isConnectionSearch", value: true }, { key: "connectionNumber", value: connectionNo }]
        let oldApplicationPayload = await getSearchResults(queryObjForSearchApplications);
        oldApplicationPayload.WaterConnection = oldApplicationPayload.WaterConnection.sort((row1,row2)=>row2.auditDetails.createdTime - row1.auditDetails.createdTime);
        if(oldApplicationPayload.WaterConnection.length>1){
          oldApplicationPayload.WaterConnection.shift();
        }
        const waterSource=oldApplicationPayload.WaterConnection[0].waterSource||'';
        oldApplicationPayload.WaterConnection[0].waterSource=waterSource.includes("null") ? "NA" : waterSource.split(".")[0];
        oldApplicationPayload.WaterConnection[0].waterSubSource=waterSource.includes("null") ? "NA" : waterSource.split(".")[1];
        if (oldApplicationPayload.WaterConnection.length > 0) {
          dispatch(prepareFinalObject("WaterConnectionOld", oldApplicationPayload.WaterConnection))
        }
      }
  
  
  
    } else if (service === serviceConst.SEWERAGE) {
      payload = [];
      payload = await getSearchResultsForSewerage(queryObjForSearch, dispatch);
      payload.SewerageConnections[0].service = service;
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", true);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", true);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", false); 
      if (payload !== undefined && payload !== null) {
        dispatch(prepareFinalObject("SewerageConnection[0]", payload.SewerageConnections[0]));
        dispatch(prepareFinalObject("WaterConnection[0]", payload.SewerageConnections[0]));
        if (!payload.SewerageConnections[0].connectionHolders || payload.SewerageConnections[0].connectionHolders === 'NA') {
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", false);
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", true);
        } else {
  
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", false);
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", true);
        }
        if (isFreezeMode()) {
          let connectionNo = payload.SewerageConnections[0].connectionNo;
          let queryObjForSearchApplications = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNo }, { key: "isConnectionSearch", value: true }]
          let oldApplicationPayload = await getSearchResultsForSewerage(queryObjForSearchApplications,dispatch);
          oldApplicationPayload.SewerageConnections = oldApplicationPayload.SewerageConnections.filter(row => {
            return row.applicationType !== "MODIFY_SEWERAGE_CONNECTION"
          })
               if (oldApplicationPayload.SewerageConnections.length > 0) {
            dispatch(prepareFinalObject("SewerageConnectionOld[0]", oldApplicationPayload.SewerageConnections[0]))
            dispatch(prepareFinalObject("WaterConnectionOld[0]",oldApplicationPayload.SewerageConnections[0]));
          }
        }
      }
      //connection number display
      if (processInstanceAppStatus === "CONNECTION_ACTIVATED") {
        let connectionNumber = payload.SewerageConnections[0].connectionNo;
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number", connectionNumber);
      } else {
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible", false);
      }
      dispatch(prepareFinalObject("DocumentsData",[]));
      // to set documents 
      if (payload.SewerageConnections[0].documents !== null && payload.SewerageConnections[0].documents !== "NA") {
        await setDocuments(
          state.screenConfiguration.preparedFinalObject,
          "WaterConnection[0].documents",
          "DocumentsData",
          dispatch,
          "WS"
        );
      }
  
      const convPayload = findAndReplace(payload, "NA", null)
      let queryObjectForEst = [{
        applicationNo: applicationNumber,
        tenantId: tenantId,
        sewerageConnection: convPayload.SewerageConnections[0]
      }]
      estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
      let viewBillTooltip = []
      if (estimate !== null && estimate !== undefined) {
        if (estimate.Calculation !== undefined && estimate.Calculation.length > 0) {
         // await processBills2(estimate, viewBillTooltip, dispatch);
          // viewBreakUp 
          estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
          estimate.Calculation[0].appStatus = processInstanceAppStatus;
          dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
        }
      }
    }
    createEstimateData(data, "screenConfiguration.preparedFinalObject.billData.billDetails", dispatch, {}, {});
  
    // if (estimate !== null && estimate !== undefined) {
    //   createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
    // }
    console.log("searchResults---");
  };

  const setStatusBasedValue = status => {
    switch (status) {
      case "approved":
        return {
          titleText: "Review the Trade License",
          titleKey: "WS_REVIEW_TRADE_LICENSE",
          titleVisibility: true,
          roleDefination: {
            rolePath: "user-info.roles",
            roles: ["WS_APPROVER"]
          }
        };
      case "pending_payment":
        return {
          titleText: "Review the Application and Proceed",
          titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
          titleVisibility: true,
          roleDefination: {
            rolePath: "user-info.roles",
            roles: ["WS_CEMP"]
          }
        };
      case "pending_approval":
        return {
          titleText: "Review the Application and Proceed",
          titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
          titleVisibility: true,
          roleDefination: {
            rolePath: "user-info.roles",
            roles: ["WS_APPROVER"]
          }
        };
      case "cancelled":
        return {
          titleText: "",
          titleVisibility: false,
          roleDefination: {}
        };
      case "rejected":
        return {
          titleText: "",
          titleVisibility: false,
          roleDefination: {}
        };
  
      default:
        return {
          titleText: "",
          titleVisibility: false,
          roleDefination: {}
        };
    }
  };

  const setActionItems = (action, object) => {
    set(
      action,
      "screenConfig.components.div.children.taskDetails.children.cardContent.children.title",
      getCommonTitle({
        labelName: get(object, "titleText"),
        labelKey: get(object, "titleKey")
      })
    );
    set(
      action,
      "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.visible",
      get(object, "titleVisibility")
    );
    set(
      action,
      "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.roleDefination",
      get(object, "roleDefination")
    );
  };

  const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
     
    dispatch(unMountScreen("apply"));
    dispatch(unMountScreen("search"));
    dispatch(unMountScreen("meter-reading"));
    dispatch(prepareFinalObject("WaterConnection",[]));
    dispatch(prepareFinalObject("SewerageConnection",[]));
    dispatch(prepareFinalObject("WaterConnectionOld",[]));
    dispatch(prepareFinalObject("SewerageConnectionOld",[]));
    const queryObj = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    if (getQueryArg(window.location.href, "service", null) != null) {
      resetData();
    }
  
    let Response = await getWorkFlowData(queryObj);
    let processInstanceAppStatus = Response.ProcessInstances[0].state.applicationStatus;
    let workflowName = Response.ProcessInstances[0].businessService ;
    
    //Search details for given application Number
    
    if (applicationNumber) {
  
      // hiding the Additional details for citizen. ,,
      if (process.env.REACT_APP_NAME === "Citizen" && processInstanceAppStatus && (processInstanceAppStatus === 'INITIATED' || processInstanceAppStatus === "PENDING_FOR_CITIZEN_ACTION" || processInstanceAppStatus === 'PENDING_FOR_DOCUMENT_VERIFICATION')) {
        set(
          action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.props.style",
          { display: "none" }
        );
      }
       
      if (!getQueryArg(window.location.href, "edited")) {
        (await searchResults(action, state, dispatch, applicationNumber, processInstanceAppStatus));
      } else {
        let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");
        applyScreenObject.applicationNo.includes("WS") ? applyScreenObject.service = serviceConst.WATER : applyScreenObject.service = serviceConst.SEWERAGE;
        let parsedObject = parserFunction(findAndReplace(applyScreenObject, "NA", null));
        dispatch(prepareFinalObject("WaterConnection[0]", parsedObject));
  
      
     //   if (!applyScreenObject.connectionHolders || payload.connectionHolders === 'NA') {
      if (!applyScreenObject.connectionHolders) {
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", false);
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", true);
        } else {
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", false);
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", true);
        }
  
  
        //Make Water connection details visible
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", true);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", true);
       
       if (applyScreenObject.service === serviceConst.SEWERAGE){
          dispatch(prepareFinalObject("SewerageConnection[0]", parsedObject));
          //Hide Water connection details
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", true);
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", false);
         
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", true);
          set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", false);
          
        }
       
          
        let estimate;
        let billEstimate;
        let billData;
        if (processInstanceAppStatus === "CONNECTION_ACTIVATED") {
          let connectionNumber = parsedObject.connectionNo;
          set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number", connectionNumber);
        } else {
          set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible", false);
        }
        //Call estimate for both field inspector and doc verifier
      //  if (processInstanceAppStatus === "PENDING_FOR_FIELD_INSPECTION" || processInstanceAppStatus === "PENDING_FOR_DOCUMENT_VERIFICATION") {
          let queryObjectForEst = [{
            applicationNo: applicationNumber,
            tenantId: tenantId,
            waterConnection: parsedObject
          }]
          if (parsedObject.applicationNo.includes("WS")) {
            let queryObjectForFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: connectionNumber }, { key: "businessService", value: "WS" }];
             billData = await fetchBill(queryObjectForFetchBill, dispatch);  
            console.info("DC-Billl details=",billData);
            let viewBillTooltip = [];
            await processBills(state,billData, viewBillTooltip, dispatch);
            
            dispatch(prepareFinalObject("billData", billData.Bill[0]));
            
          } else {
            let queryObjectForEst = [{
              applicationNo: applicationNumber,
              tenantId: tenantId,
              sewerageConnection: parsedObject
            }]
            estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
            let viewBillTooltip = []
            if (estimate !== null && estimate !== undefined) {
              if (estimate.Calculation.length > 0) {
                await processBills2(estimate, viewBillTooltip, dispatch);
                // viewBreakUp 
                estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
                estimate.Calculation[0].appStatus = processInstanceAppStatus;
                dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
              }
            }
          }
          if (billData !== null && billData !== undefined) {
            createEstimateData(billData, "screenConfiguration.preparedFinalObject.billData.billDetails", dispatch, {}, {});
               // createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
          }
       // }
      }
  
  
      let connectionType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].connectionType");
      console.log("connectionType "+connectionType);
      if (connectionType === "Metered") {
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
          true
        );
      } else {
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
          false
        );
      }
  
      
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewModificationsDetails.visible",
          false
        );
      
  
      const status = getTransformedStatus(
        get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus")
      );
    
      if(workflowName!==null && !workflowName.includes("Legacy")){
        const printCont = downloadPrintContainer(
          action,
          state,
          dispatch,
          processInstanceAppStatus,
          applicationNumber,
          tenantId,service,workflowName
        );
        set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          printCont
        );
      }
  
      let data = get(state, "screenConfiguration.preparedFinalObject");
  
      const obj = setStatusBasedValue(status);
  
      // Get approval details based on status and set it in screenconfig
  
      if (
        status === "APPROVED" ||
        status === "REJECTED" ||
        status === "CANCELLED"
      ) {
        set(
          action,
          "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
          true
        );
  
        if (get(data, "WaterConnection[0].documents")) {
          await setDocuments(
            data,
            "WaterConnection[0].documents",
            "LicensesTemp[0].verifyDocData",
            dispatch, 'NewWS1'
          );
        } else {
          dispatch(
            handleField(
              "freezeConn-preview",
              "components.div.children.taskDetails.children.cardContent.children.approvalDetails.children.cardContent.children.viewTow.children.lbl",
              "visible",
              false
            )
          );
        }
      } else {
        set(
          action,
          "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
          false
        );
      }
  
      if (status === "cancelled")
        set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children.cancelledLabel.visible",
          true
        );
  
      setActionItems(action, obj);
      if (get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].additionalDetails.locality", null) === null) {
        dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.locality", get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.address.locality.code")));
      }
    }
   
  
    let roadTypes = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].roadTypeEst",[]);
    let newRoad =  roadTypes && roadTypes.filter(roadType=>(roadType.length!=0 && roadType.breadth!=0 && roadType.depth!=0 && roadType.rate!=0));
    let flag =false;
    if(newRoad.length ==0 ){
      flag =true;
      newRoad.includes({  roadType :null , length : null, depth : null ,breadth : null,rate : null });    
    }
  
    dispatch(prepareFinalObject("WaterConnection[0].tempRoadType",newRoad));
   
  
  
    for(var i=0;i<newRoad.length ;i++){  
      displayRoadTypeHeading(newRoad[i],i,dispatch); 
      displayRoadCuttingEstimate(newRoad[i],i,dispatch);
    }
  
   
  
  
    //If Road cutting is not entered
    
     if(flag){
    
        dispatch(
        handleField(
          "freezeConn-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTen",
          "visible",
          false
        )
      );
     }
     else{
  
      dispatch(
        handleField(
          "freezeConn-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirteen",
          "visible",
           false
        )
      );
     }
     
    
  };
  

  const screenConfig = {
    uiFramework: "material-ui",
    name: "freezeConn-preview",
    beforeInitScreen: (action, state, dispatch) => {
       
      const tenantId = getQueryArg(window.location.href, "tenantId");
      let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
      const queryObject = [
        { key: "tenantId", value: tenantId },
      ];
      setBusinessServiceDataToLocalStorage(queryObject, dispatch);
      //To set the application no. at the  top
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.application.children.applicationNumber.props.number", applicationNumber);
      
      if (isFreezeMode()) {
        serviceModuleName = "DeactivateWSConnection"
      }
  
      
       
      beforeInitFn(action, state, dispatch, applicationNumber);
      set(
        action,
        "screenConfig.components.div.children.headerDiv.children.header1.children.application.children.applicationNumber.props.number",
        applicationNumber
      );
      set(action, 'screenConfig.components.div.children.taskStatus.props.dataPath', (service === serviceConst.WATER) ? "WaterConnection" : "SewerageConnection");
      set(action, 'screenConfig.components.div.children.taskStatus.props.moduleName', serviceModuleName);
      set(action, 'screenConfig.components.div.children.taskStatus.props.updateUrl', serviceUrl);
      set(action, 'screenConfig.components.div.children.taskStatus.props.bserviceTemp', (service === serviceConst.WATER) ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE");
      set(action, 'screenConfig.components.div.children.taskStatus.props.redirectQueryString', redirectQueryString);
      set(action, 'screenConfig.components.div.children.taskStatus.props.editredirect', editredirect);
      return action;
    },
  
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css search-preview"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header1: {
                gridDefination: {
                  xs: 12,
                  sm: 8
                },
                ...headerrow
              },
              helpSection: {
                uiFramework: "custom-atoms",
                componentPath: "Container",
                props: {
                  color: "primary",
                  style: { justifyContent: "flex-end" } //, dsplay: "block"
                },
                gridDefination: {
                  xs: 12,
                  sm: 4,
                  align: "right"
                },
              }
            }
          },
          taskStatus: {
            uiFramework: "custom-containers-local",
            componentPath: "WorkFlowContainer",
            moduleName: "egov-workflow",
            // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
            props: {
              dataPath: (service === serviceConst.WATER) ? "WaterConnection" : "SewerageConnection",
              moduleName: serviceModuleName,
              updateUrl: serviceUrl,
              baseUrlTemp: 'wns',
              bserviceTemp: (service === serviceConst.WATER) ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE",
              redirectQueryString: redirectQueryString,
              editredirect: editredirect,
              beforeSubmitHook: (data) => {              
                data = data[0];
                data && data.wsTaxHeads && data.wsTaxHeads.forEach(item => {
                  if (!item.amount || item.length === null) {
                    item.amount = 0;
                  }
                });
                data && data.roadTypeEst && data.roadTypeEst.forEach(item => {
                  if (!item.length || item.length === null) {
                      item.length = 0;
                    }
                    if (!item.breadth || item.breadth === null) {
                      item.breadth = 0;
                    }
                    if (!item.depth || item.depth === null) {
                      item.depth = 0;
                    }
                    if (!item.rate || item.rate === null) {
                      item.rate = 0;
                    }
                });
  
                if(data.additionalDetails.initialMeterReading === null  || isNaN(data.additionalDetails.initialMeterReading) == true){               
                  data.additionalDetails.initialMeterReading = 0;              
                }       
                
          
                
  
                set(data, 'propertyId', get(data, 'property.propertyId', null));
                data.assignees = [];
                if (data.assignee) {
                  data.assignee.forEach(assigne => {
                    data.assignees.push({
                      uuid: assigne
                    })
                  })
                }
                data.processInstance = {
                  documents: data.wfDocuments,
                  assignes: data.assignees,
                  comment: data.comment,
                  action: data.action
                }
                data.waterSource = getWaterSource(data.waterSource, data.waterSubSource);
                return data;
              }
            }
          },
          snackbarWarningMessage,
          taskDetails,
        }
      },
   /*   breakUpDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-wns",
        componentPath: "ViewBreakupContainer",
        props: {
          open: false,
          maxWidth: "md",
          screenKey: "search-preview",
        }
      },
  
      billEstimateDialog:{
        uiFramework: "custom-containers-local",
        moduleName: "egov-wns",
        componentPath: "ViewBillEstimateContainer",
        props: {
          open: false,
          maxWidth: "md",
          screenKey: "search-preview",
          visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
        },
        visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
      },
  
  
  
      adhocDialog: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-wns",
        componentPath: "DialogContainer",
        props: {
          open: false,
          maxWidth: "sm",
          screenKey: "search-preview"
        },
        children: {
          popup: {}
        }
      },*/
    }
  };




  export default screenConfig;