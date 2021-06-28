import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonContainer, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadCertDetails, loadGuestHouseDetails} from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const onPurposeChange = (action, state, dispatch) =>{
  console.log("Purpose changed");
}

const bookGuestHouse = {
  uiFramework: "material-ui",
  name: "bookGuestHouse",
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
        labelName: "Booking Details",
        labelKey: "OBM_BOOKING_DETAILS"
      }),
      subParagraph: getCommonParagraph({
        labelName: "",
        labelKey: "OBM_BOOKING_DETAILS"
      }),
    }),
    bookingDetailsContainer: getCommonContainer({
      purpose: {
        uiFramework: "custom-containers",
        //moduleName: "egov-lams",
        componentPath: "AutosuggestContainer",
        jsonPath: "ghb.viewGuestHouseDetails.purposes",
        sourceJsonPath: "ghb.booking.purpose",
        visible:true,
        autoSelect:true,
        props:{
          autoSelect:true,
          //isClearable:true,
          className: "autocomplete-dropdown",
          suggestions: [],
          disabled:false,//getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
          label: {
            labelName: "Select Purpose",
            labelKey: "OBM_SELECT_PURPOSE"
          },
          placeholder: {
            labelName: "Select Purpose",
            labelKey: "SELECT_PURPOSE"
          },
          localePrefix: {
            moduleName: "OBM",
            masterName: ""
          },
          labelsFromLocalisation: true,
          required: true,
          jsonPath: "ghb.viewGuestHouseDetails.purposes",
          sourceJsonPath: "ghb.booking.purpose",
          inputLabelProps: {
            shrink: true
          },
          onClickHandler: (action, state, dispatch) => {
            console.log(action,state, dispatch );
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
          onPurposeChange(action, state, dispatch);
        },
      },
      documentList: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-obm",
        componentPath: "DocumentListContainer",
        props: {
          buttonLabel: {
            labelName: "UPLOAD_DOCS",
            labelKey: "OBM_UPLOAD_DOCS"
          },
          // description: "Only .jpg and .pdf files. 6MB max file size.",
          inputProps: {
            accept: "image/*, .pdf, .png, .jpeg"
          },
          maxFileSize: 5000
        },
        type: "array"
      }
    })
  }
}

export default bookGuestHouse;
