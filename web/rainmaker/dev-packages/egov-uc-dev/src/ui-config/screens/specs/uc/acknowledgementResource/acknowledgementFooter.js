import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { generateReciept } from "../../utils/recieptPdf";
import { ifUserRoleExists } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getCommonPayUrl } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "../../../../../index.css";

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};
export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("EMPLOYEE") ? "/uc/newCollection" : "/inbox";

  return redirectionURL;
};
export const acknowledgementSuccesFooter = getCommonApplyFooter({
  goToHomeButton: {
    componentPath: "Button",
    props: {
      // variant: "contained",
      // color: "primary",
      variant: "outlined",
      color: "primary",
      className:"gen-challan-btn"
      // style: {
      //   minWidth: "200px",
      //   height: "48px",
      //   marginRight: "16px"
      // }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "Go To Home",
        labelKey: "UC_BUTTON_GO_TO_HOME"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        goToHome(state, dispatch);
      }
    }
  },
    payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      className:"gen-challan-btn"
      // style: {
      //   minWidth: "200px",
      //   height: "48px",
      //   marginRight: "16px"
      // }
    },
    children: {
        payButtonLabel: getLabel({
        labelName: "PROCEED TO PAYMENT",
        labelKey: "UC_BUTTON_PAY"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
      //  const challanNo = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   "Challan.challanNo"
      // );
      // const tenantId = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   "Challan.tenantId"
      // );
      // const businessService = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   "Challan.serviceType"
      // );
     
    const challanNo = getQueryArg(window.location.href, "challanNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const businessService = getQueryArg(window.location.href,"serviceCategory");
    console.info("businessService=",businessService,"tenantId=",tenantId,"challanNo=",challanNo);
      if(businessService !=null && tenantId !=null && challanNo !=null ){
        getCommonPayUrl(dispatch, challanNo, tenantId, businessService);
      }    
      
      else{
        // dispatch(
        //   toggleSnackbar(
        //     true,
        //     {
        //       labelName: "SEARCH & PAY BILL",
        //       labelKey: "UC_SEARCHANDPAY_LABEL"
        //     },
        //     "warning"
        //   )
        // );
        //dispatch(setRoute(`${getRedirectionURL()}`));
        //alert("go to home");
        dispatch(setRoute(`/uc/newCollection`));
      }
      
      }
    }
  }
});
export const acknowledgementFailureFooter = getCommonApplyFooter({
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "Go To Home",
        labelKey: "UC_BUTTON_GO_TO_HOME"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});

const viewReceipt = (state, dispatch) => {
  generateReciept(state, dispatch);
};

const goToHome = (state, dispatch) => { 
  dispatch(prepareFinalObject("Challan", []));
  dispatch(setRoute(`${getRedirectionURL()}`));
};