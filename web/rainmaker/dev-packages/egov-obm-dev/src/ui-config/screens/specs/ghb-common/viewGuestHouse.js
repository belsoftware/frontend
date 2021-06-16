import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonContainer, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadCertDetails, loadGuestHouseDetails} from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const viewGuestHouse = {
  uiFramework: "material-ui",
  name: "viewGuestHouse",
  beforeInitScreen:(action, state, dispatch) => {

    let tenantId = getQueryArg(window.location.href, "tenantId");
    let guestHouseId = getQueryArg(window.location.href, "guestHouseId");

    let data = {tenantId:tenantId, guestHouseId:guestHouseId};

    loadGuestHouseDetails(action, state, dispatch, data).then((response) => {
      if (response && response.length > 0) {
        dispatch(prepareFinalObject("ghb.viewGuestHouseDetails", response[0]));
      }
    });
    return action;

  },

  components:{
    header: getCommonCard({
      subHeader: getCommonTitle({
        labelName: "Search Trade License Application",
        labelKey: "TL_HOME_SEARCH_RESULTS_HEADING"
      }),
      subParagraph: getCommonParagraph({
        labelName: "Provide at least one parameter to search for an application",
        labelKey: "TL_HOME_SEARCH_RESULTS_DESC"
      }),
      appTradeAndMobNumContainer: getCommonContainer({
      })
    })
  }
}

export default viewGuestHouse;
