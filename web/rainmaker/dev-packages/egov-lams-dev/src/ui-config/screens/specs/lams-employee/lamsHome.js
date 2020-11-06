import {
  getCommonCard,
  getCommonCardWithHeader,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object

import {getMdmsData, loadMdmsData} from "../lams-utils/utils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { value } from "jsonpath";



const onPopupOpen = () => {
  //this.setState({ filterPopupOpen: true });
  alert("In the open pop up");
}

const lamsHome = {
  uiFramework: "material-ui",
  name: "lamsHome",
  beforeInitScreen:(action, state, dispatch) => {
    //const queryValue = getQueryArg(window.location.href, "applicationNumber");
    // const tenantId = getQueryArg(window.location.href, "tenantId");
    // getData(action, state, dispatch, tenantId);
    // loadMdmsData(action, state, dispatch);
    // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    // dispatch(prepareFinalObject("allTenants", [{code:"Agra", name:"Agra", active: true, id:"pb.agra"},{code: "Pune",name: "Pune", active: true, id:"pb.pune"}, {name: "Lucknow", code:"Lucknow", active: true, id:"pb.lucknow"}]));
    // dispatch(prepareFinalObject("lamsLocation", [{code:"withinCB", name:"Within CB ", active: true, id:"pb.agra"},{code: "outside CB",name: "Outside CB", active: true, id:"pb.pune"}]));
    // dispatch(prepareFinalObject("lamsSurveyNumber", [{code:"131-212-A", name:"131-212-A", active: true, id:"pb.agra"},{code: "131-16",name: "131-16", active: true, id:"pb.pune"},{code: "131-145",name: "131-145", active: true, id:"pb.lucknow"}]));
    // dispatch(prepareFinalObject("lamsTemp", [{applicationDocuments:[{"code":"OWNERPHOTO","maxFileSize":5000,"required":true,"formatProps":{"accept":"image/*,.png,.jpeg"},"description":"COMMON_OWNERPHOTO_DESCRIPTION","statement":"COMMON_OWNERPHOTO_STATEMENT","jsonPath":"Licenses[0].tradeLicenseDetail.applicationDocuments[0]"},{"code":"AADHAARCARD","maxFileSize":5000,"required":true,"formatProps":{"accept":"image/*,.pdf,.png,.jpeg"},"description":"COMMON_AADHAARCARD_DESCRIPTION","statement":"COMMON_AADHAARCARD_STATEMENT","jsonPath":"Licenses[0].tradeLicenseDetail.applicationDocuments[1]"},{"code":"ELECTBILL","maxFileSize":5000,"required":true,"formatProps":{"accept":"image/*,.pdf,.png,.jpeg"},"description":"COMMON_ELECTBILL_DESCRIPTION","statement":"COMMON_ELECTBILL_STATEMENT","jsonPath":"Licenses[0].tradeLicenseDetail.applicationDocuments[2]"}]}]));
    alert("in the lams home page");
    return action;
  },
  components: {
    workflowContainer: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-lams",
      componentPath: "TableData",
      required: true,
      props: {
        onPopupOpen: onPopupOpen            
      }
    }
  }
};


export default lamsHome;