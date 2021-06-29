import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import {getPattern, getTextField, getCommonGrayCard, getCommonCard, getCommonContainer, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadCertDetails, loadGuestHouseDetails, getDetailsOfApplicant} from "../utils";
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

    //Set the documents data for display
    dispatch(prepareFinalObject("documentsContract", [{"code":"OWNER","title":"OWNER","cards":[{"name":"OWNER.IDENTITYPROOF","code":"OWNER.IDENTITYPROOF","required":true,"dropdown":{"label":"WS_SELECT_DOC_DD_LABEL","required":true,"menu":[{"code":"OWNER.IDENTITYPROOF.AADHAAR","label":"OWNER_IDENTITYPROOF_AADHAAR"},{"code":"OWNER.IDENTITYPROOF.VOTERID","label":"OWNER_IDENTITYPROOF_VOTERID"},{"code":"OWNER.IDENTITYPROOF.DRIVING","label":"OWNER_IDENTITYPROOF_DRIVING"},{"code":"OWNER.IDENTITYPROOF.PAN","label":"OWNER_IDENTITYPROOF_PAN"},{"code":"OWNER.IDENTITYPROOF.PASSPORT","label":"OWNER_IDENTITYPROOF_PASSPORT"}]}},{"name":"OWNER.ADDRESSPROOF","code":"OWNER.ADDRESSPROOF","required":true,"dropdown":{"label":"WS_SELECT_DOC_DD_LABEL","required":true,"menu":[{"code":"OWNER.ADDRESSPROOF.ELECTRICITYBILL","label":"OWNER_ADDRESSPROOF_ELECTRICITYBILL"},{"code":"OWNER.ADDRESSPROOF.DL","label":"OWNER_ADDRESSPROOF_DL"},{"code":"OWNER.ADDRESSPROOF.VOTERID","label":"OWNER_ADDRESSPROOF_VOTERID"},{"code":"OWNER.ADDRESSPROOF.AADHAAR","label":"OWNER_ADDRESSPROOF_AADHAAR"},{"code":"OWNER.ADDRESSPROOF.PAN","label":"OWNER_ADDRESSPROOF_PAN"},{"code":"OWNER.ADDRESSPROOF.PASSPORT","label":"OWNER_ADDRESSPROOF_PASSPORT"}]}}]}]));
    dispatch(prepareFinalObject("ghb.specialCategoryList", [{code:"Office Staff",name:"Office Staff"},{code:"Elected Member",name:"Elected Member"}]));
    dispatch(prepareFinalObject("ghb.purposeList", [{code:"Marriage",name:"Marriage"},{code:"Birthday",name:"Birthday"},{code:"Religious",name:"Religious"}]));

    return action;

  },

  components:{
    selectedGuestHouseDetails: getCommonCard({
      subHeader: getCommonTitle({
        labelName: "Booking Details",
        labelKey: "OBM_SELECTED_DETAILS"
      }),
      subParagraph: getCommonParagraph({
        labelName: "",
        labelKey: "OBM_SELECTED_DETAILS"
      })
    }),
    bookingDetails: getCommonCard({
      subHeader: getCommonTitle({
        labelName: "Booking Details",
        labelKey: "OBM_BOOKING_DETAILS"
      }),
      subParagraph: getCommonParagraph({
        labelName: "",
        labelKey: "OBM_BOOKING_DETAILS"
      }),
      details: getCommonContainer({
        purpose: {
          uiFramework: "custom-containers",
          //moduleName: "egov-lams",
          componentPath: "AutosuggestContainer",
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
            jsonPath: "ghb.booking.purpose",
            sourceJsonPath: "ghb.purposeList",
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
        category: {
          uiFramework: "custom-containers",
          //moduleName: "egov-lams",
          componentPath: "AutosuggestContainer",
          visible:true,
          autoSelect:true,
          props:{
            autoSelect:true,
            //isClearable:true,
            className: "autocomplete-dropdown",
            suggestions: [],
            disabled:false,//getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
            label: {
              labelName: "Select Category",
              labelKey: "OBM_SELECT_CATEGORY"
            },
            placeholder: {
              labelName: "Select Category",
              labelKey: "SELECT_CATEGORY"
            },
            localePrefix: {
              moduleName: "OBM",
              masterName: ""
            },
            labelsFromLocalisation: true,
            required: true,
            jsonPath: "ghb.viewGuestHouseDetails.category",
            sourceJsonPath: "ghb.specialCategoryList",
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
            onCategoryChange(action, state, dispatch);
          },
        },
        applicantInfo: getCommonGrayCard({
          header: getCommonSubHeader(
            {
              labelName: "Applicant Information",
              labelKey: "LAMS_APPLICANT_BASIC_DETAILS"
            },
            {
              style: {
                marginBottom: 18
              }
            }
          ),
          applicantDetailsCardContainer: getCommonContainer({
            getApplicantMobNoField: getTextField({
              label: {
                labelName: "Mobile No.",
                labelKey: "OBM_APPLICANT_MOB_NO"
              },
              props:{
                className:"applicant-details-error"
              },
              placeholder: {
                labelName: "Enter Mobile No.",
                labelKey: "OBM_APPLICANT_MOB_NO_PLACEHOLDER"
              },
              required: true,
              pattern: getPattern("MobileNo"),
              jsonPath: "ghb.booking.userDetails[0].mobileNumber",
              iconObj: {
                iconName: "search",
                position: "end",
                color: "#FE7A51",
                onClickDefination: {
                  action: "condition",
                  callBack: (state, dispatch, fieldInfo) => {
                    getDetailsOfApplicant(state, dispatch, fieldInfo);
                  }
                }
              },
              title: {
                value: "Please search applicant profile linked to the mobile no.",
                key: "LAMS_APPLICANT_MOB_NO_MESSAGE"
              },
              infoIcon: "info_circle",
              gridDefination: {
                xs: 12,
                sm: 6
              }
            }),
            applicantName: getTextField({
              label: {
                labelName: "Name",
                labelKey: "OBM_APPLICANT_NAME_LABEL"
              },
              props:{
                className:"applicant-details-error"
              },
              placeholder: {
                labelName: "Enter Name",
                labelKey: "OBM_APPLICANT_NAME_PLACEHOLDER"
              },
              required: true,
              pattern: getPattern("Name"),
              jsonPath: "ghb.booking[0].userDetails[0].name",
              gridDefination: {
                xs: 12,
                sm: 6
              }
            }),
            info1: getCommonCaption({
                labelName: "Note: This is only used to get the applicant information. Applicant Details cannot not be updated from here.",
                labelKey: "OBM_APPL_DETAILS_NOTE"
              },
              {
                disableValidation:true,
              }
            ),
          })
        })
      })
    }),
    documentUpload: getCommonCard({
      subHeader: getCommonTitle({
        labelName: "Booking Details",
        labelKey: "OBM_UPLOAD_DOCUMENTS"
      }),
      subParagraph: getCommonParagraph({
        labelName: "",
        labelKey: "OBM_UPLOAD_DOCUMENTS"
      }),
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
    }),
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        details: footer
      },
    }
  }
}

export default bookGuestHouse;
