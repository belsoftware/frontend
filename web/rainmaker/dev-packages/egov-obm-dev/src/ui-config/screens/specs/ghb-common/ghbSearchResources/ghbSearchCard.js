import { getCommonCard, getCommonContainer, getCommonHeader, getCommonSubHeader,getCommonCaption,
  getLabel, getPattern, getTextField,getSelectField, getDateField,getBreak, getDivider } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { searchApiCall } from "./function";
//import { ifUserRoleExists } from "../../utils";
import "./index.css"
import { getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import {loadHospitals} from "../../utils"
import {disclaimerDialog} from "./disclaimerDialog";

// const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
// console.log("tenantId--- ", tenantId);
const resetFields = (state, dispatch) => {//const tenantId = process.env.REACT_APP_NAME === "Employee" ? getTenantId() : JSON.parse(getUserInfo()).permanentCity;

 //Clear advanced Search
 let componentPath = "components.div.children.ghbSearchCard.children.cardContent.children.searchContainer2.children.details.children";
 for(var child in get(state,"screenConfiguration.screenConfig.searchGuestHouse."+componentPath))
 {
   dispatch(handleField(
     "searchGuestHouse",
     componentPath+"."+child,
     "props.value",
     ""
   ));
   dispatch(handleField(
     "searchGuestHouse",
     componentPath+"."+child,
     "props.helperText",
     ""
   ));
   dispatch(handleField(
     "searchGuestHouse",
     componentPath+"."+child,
     "props.error",
     false
   ));
 }

 //Clear Mandatory Search Attributes
 componentPath = "components.div.children.ghbSearchCard.children.cardContent.children.searchContainerCommon.children";
 for(var child in get(state,"screenConfiguration.screenConfig.searchGuestHouse."+componentPath))
 {
   dispatch(handleField(
     "searchGuestHouse",
     componentPath+"."+child,
     "props.value",
     ""
   ));
   dispatch(handleField(
     "searchGuestHouse",
     componentPath+"."+child,
     "props.helperText",
     ""
   ));
   dispatch(handleField(
     "searchGuestHouse",
     componentPath+"."+child,
     "props.error",
     false
   ));
 }
};

const cbChanged = (action, state, dispatch) => {

  console.log(state.screenConfiguration.preparedFinalObject.obm);
 let tenantId = get(state.screenConfiguration.preparedFinalObject.obm,"search.tenantId");

 loadHospitals(action, state, dispatch, "birth", tenantId).then((response)=>{
   if(response && response.hospitalDtls)
   {
     for (let hospital of response.hospitalDtls) {
       hospital.code = hospital.id;
       hospital.name = hospital.name;
     }
     response.hospitalDtls.push({code:"0",name:"Others / Non Institutional"})
     dispatch(prepareFinalObject("obm.allHospitals", response.hospitalDtls));
   }
 });
}

const setVisibilityOptionsSet1 = (state, dispatch, visible) => {
 dispatch(
   handleField(
     "searchGuestHouse",
     "components.div.children.ghbSearchCard.children.cardContent.children.searchContainer1",
     "visible",
     visible
   )
 );
}
 
const setVisibilityOptionsSet2 = (state, dispatch, visible) => {
 dispatch(
   handleField(
     "searchGuestHouse",
     "components.div.children.ghbSearchCard.children.cardContent.children.searchContainer2",
     "visible",
     visible
   )
 );
}

export const showHideConfirmationPopup = (state, dispatch) => {
 let toggle = get(
   state.screenConfiguration.screenConfig["searchGuestHouse"],
  "components.div.children.ghbSearchCard.children.cardContent.children.disclaimerDialog.props.open",
  false
);
dispatch(
  handleField("searchGuestHouse", 
  "components.div.children.ghbSearchCard.children.cardContent.children.disclaimerDialog", "props.open", !toggle)
);
};

export const searchSetCommon = getCommonContainer({
 fromDate: getDateField({
   label: { labelName: "fromDate", labelKey: "COMMON_FROM_DATE" },
   placeholder: {
     labelName: "From Date",
     labelKey: "COMMON_FROM_DATE"
   },
   jsonPath: "ghb.search.fromDate",
   gridDefination: {
     xs: 12,
     sm: 4
   },
   pattern: getPattern("Date"),
   errorMessage: "ERR_INVALID_DATE",
   required: true,
   props: {
     inputProps: {
       max: getTodaysDateInYMD()
     }
   },
   visible: true,
 }),
 todate: getDateField({
   label: { labelName: "ToDate", labelKey: "COMMON_TO_DATE" },
   placeholder: {
     labelName: "To Date",
     labelKey: "COMMON_TO_DATE"
   },
   jsonPath: "ghb.search.todate",
   gridDefination: {
     xs: 12,
     sm: 4
   },
   pattern: getPattern("Date"),
   errorMessage: "ERR_INVALID_DATE",
   required: true,
   props: {
     inputProps: {
       max: getTodaysDateInYMD()
     }
   },
   visible: true
 }),
 cantonmentSelect: {
   uiFramework: "custom-containers",
     //moduleName: "egov-lams",
     componentPath: "AutosuggestContainer",
     jsonPath: "ghb.search.tenantId",
     sourceJsonPath: "ghb.allTenants",
     visible:true,
     autoSelect:true,
     props:{
       autoSelect:true,
       //isClearable:true,
       className: "autocomplete-dropdown",
       suggestions: [],
       disabled:false,//getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
       label: {
         labelName: "Select Cantonment",
         labelKey: "TL_SELECT_CITY"
       },
       placeholder: {
         labelName: "Select Cantonment",
         labelKey: "TL_SELECT_CITY"
       },
       localePrefix: {
         moduleName: "TENANT",
         masterName: "TENANTS"
       },
       labelsFromLocalisation: true,
       required: true,
       jsonPath: "ghb.search.tenantId",
       sourceJsonPath: "ghb.allTenants",
       inputLabelProps: {
         shrink: true
       },
       onClickHandler: (action, state, dispatch) => {
         //console.log(action,state, dispatch );
       },
     },
     gridDefination: {
       xs: 12,
       sm: 4
     },
     required: true,
     beforeFieldChange: (action, state, dispatch) => {

     },
     afterFieldChange: (action, state, dispatch) => {
       cbChanged(action, state, dispatch);
     },
 },
});

export const buttonContainer = getCommonContainer({
 firstCont: {
   uiFramework: "custom-atoms",
   componentPath: "Div",
   gridDefination: {
     xs: 12,
     sm: 3
   }
 },
 searchButton: {
   componentPath: "Button",
   gridDefination: {
     xs: 12,
     sm: 3
     // align: "center"
   },
   props: {
     variant: "contained",
     style: {
       color: "white",
       backgroundColor: "#696969",
       borderRadius: "2px",
       width: window.innerWidth > 480 ? "80%" : "100%",
       height: "48px"
     }
   },
   children: {
     buttonLabel: getLabel({
       labelName: "SEARCH",
       labelKey: "BND_SEARCH_BUTTON"
     })
   },
   onClickDefination: {
     action: "condition",
     callBack: (state, dispatch) => {
       searchApiCall(state, dispatch);
     }
   }
 },
 resetButton: {
   componentPath: "Button",
   gridDefination: {
     xs: 12,
     sm: 3
     // align: "center"
   },
   props: {
     variant: "outlined",
     style: {
       color: "#FE7A51",
       // backgroundColor: "#FE7A51",
       border: "#FE7A51 solid 1px",
       borderRadius: "2px",
       width: window.innerWidth > 480 ? "80%" : "100%",
       height: "48px"
     }
   },
   children: {
     buttonLabel: getLabel({
       labelName: "RESET",
       labelKey: "BND_RESET_BUTTON"
     })
   },
   onClickDefination: {
     action: "condition",
     callBack: resetFields
   }
 },    

 lastCont: {
   uiFramework: "custom-atoms",
   componentPath: "Div",
   gridDefination: {
     xs: 12,
     sm: 3
   }
 }
});

export const ghbSearchCard = getCommonCard({
 header: getCommonHeader({
   labelName: "Search",
   labelKey: "OBM_GHB_SEARCH"
 }),
 break1:getBreak(),
 searchContainerCommon: searchSetCommon,
 //break1: getBreak(),
 divider1: getDivider(),
 break2:getBreak(),
 buttonContainer: buttonContainer,
 disclaimerDialog: {
   componentPath: "Dialog",
   props: {
     open: false,
     maxWidth: "sm",
     disableValidation: true
   },
   children: {
     dialogContent: {
       componentPath: "DialogContent",
       props: {
         classes: {
           root: "city-picker-dialog-style"
         }
         // style: { minHeight: "180px", minWidth: "365px" }
       },
       children: {
         popup: disclaimerDialog
       }
     }
   }
 }
});
