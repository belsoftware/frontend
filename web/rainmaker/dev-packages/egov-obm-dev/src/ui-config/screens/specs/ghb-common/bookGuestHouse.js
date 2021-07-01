import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import {getLabelWithValue, getPattern, getTextField, getCommonGrayCard, getCommonCard, getCommonContainer, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadCertDetails, loadGuestHouseDetails, getDetailsOfApplicant} from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import {footer} from "./bookGuestHouseFooter";
import { localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { split } from "lodash";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const onPurposeChange = (action, state, dispatch) =>{
  console.log("Purpose changed");
}

const onCategoryChange = (action, state, dispatch) =>{
  console.log("Category changed");
}

//Convert YYYY-MM-dd to dd-MM-YYYY
const convertDate = (dateString) =>{
  let splits = dateString.split("-");
  return splits[2]+"-"+splits[1]+"-"+splits[0];
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

    let fromDate = convertDate(localStorageGet("ghb.search.fromDate"));
    let toDate = convertDate(localStorageGet("ghb.search.toDate"));
    dispatch(prepareFinalObject("ghb.booking.fromToDateString", fromDate+" to "+toDate ));

    //Set the documents data for display
    dispatch(prepareFinalObject("documentsContract", [{"code":"APPLICANT","title":"APPLICANT","cards":[{"name":"APPLICANT.IDENTITYPROOF","code":"APPLICANT.IDENTITYPROOF","required":true,"dropdown":{"label":"WS_SELECT_DOC_DD_LABEL","required":true,"menu":[{"code":"APPLICANT.IDENTITYPROOF.AADHAAR","label":"OWNER_IDENTITYPROOF_AADHAAR"},{"code":"APPLICANT.IDENTITYPROOF.VOTERID","label":"OWNER_IDENTITYPROOF_VOTERID"},{"code":"APPLICANT.IDENTITYPROOF.DRIVING","label":"OWNER_IDENTITYPROOF_DRIVING"},{"code":"APPLICANT.IDENTITYPROOF.PAN","label":"OWNER_IDENTITYPROOF_PAN"},{"code":"APPLICANT.IDENTITYPROOF.PASSPORT","label":"OWNER_IDENTITYPROOF_PASSPORT"}]}},{"name":"APPLICANT.ADDRESSPROOF","code":"APPLICANT.ADDRESSPROOF","required":true,"dropdown":{"label":"WS_SELECT_DOC_DD_LABEL","required":true,"menu":[{"code":"APPLICANT.ADDRESSPROOF.ELECTRICITYBILL","label":"OWNER_ADDRESSPROOF_ELECTRICITYBILL"},{"code":"APPLICANT.ADDRESSPROOF.DL","label":"OWNER_ADDRESSPROOF_DL"},{"code":"APPLICANT.ADDRESSPROOF.VOTERID","label":"OWNER_ADDRESSPROOF_VOTERID"},{"code":"APPLICANT.ADDRESSPROOF.AADHAAR","label":"OWNER_ADDRESSPROOF_AADHAAR"},{"code":"APPLICANT.ADDRESSPROOF.PAN","label":"OWNER_ADDRESSPROOF_PAN"},{"code":"APPLICANT.ADDRESSPROOF.PASSPORT","label":"OWNER_ADDRESSPROOF_PASSPORT"}]}}]}]));
    dispatch(prepareFinalObject("ghb.specialCategoryList", [{code:"Office Staff",name:"Office Staff"},{code:"Elected Member",name:"Elected Member"}]));
    dispatch(prepareFinalObject("ghb.purposeList", [{id:"purpose1",code:"Marriage",name:"Marriage"},{id:"purpose2",code:"Birthday",name:"Birthday"},{id:"purpose3",code:"Religious",name:"Religious"}]));

    return action;

  },

  components:{
    // selectedGuestHouseDetails: getCommonCard({
    //   subHeader: getCommonTitle({
    //     labelName: "Booking Details",
    //     labelKey: "OBM_SELECTED_DETAILS"
    //   }),
    //   subParagraph: getCommonParagraph({
    //     labelName: "",
    //     labelKey: "OBM_SELECTED_DETAILS"
    //   })
    // }),
    bookingDetails: getCommonCard({
      subHeader: getCommonTitle({
        labelName: "Booking Details",
        labelKey: "OBM_BOOKING_DETAILS"
      }),
      subParagraph: getCommonParagraph({
        labelName: "",
        labelKey: "OBM_BOOKING_DETAILS"
      }),
      hallAndTime: getCommonContainer(
        {
          nameOfHall: getLabelWithValue(
            {
              labelName: "Name of the Hall",
              labelKey: "OBM_HALL_NAME"
            },
            {
              jsonPath: "ghb.viewGuestHouseDetails.name",
              //callBack: checkNoData
            }
          ),
          bookedTime: getLabelWithValue(
            {
              labelName: "Booking Dates",
              labelKey: "OBM_BOOKING_DATES"
            },
            {
              jsonPath: "ghb.booking.fromToDateString",
              //callBack: getGenderStr
            }
          )
        }),
      bookingDetails: getCommonGrayCard({
        // header: getCommonSubHeader(
        //   {
        //     labelName: "Booking Details",
        //     labelKey: "OBM_BOOKING_DETAILS"
        //   },
        //   {
        //     style: {
        //       marginBottom: 18
        //     }
        //   }
        // ),
        applicantDetailsCardContainer: getCommonContainer({
          purpose: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-obm",
            componentPath: "AutosuggestContainer",
            visible:true,
            autoSelect:true,
            jsonPath: "ghb.booking.purpose",
            props:{
              sourceJsonPath: "ghb.purposeList",
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
                masterName: "CHB"
              },
              labelsFromLocalisation: true,
              required: true,
              inputLabelProps: {
                shrink: true
              },
              onClickHandler: (action, state, dispatch) => {
                console.log(action,state, dispatch );
              },
            },
            gridDefination: {
              xs: 12,
              sm: 6
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
            moduleName: "egov-obm",
            componentPath: "AutosuggestContainer",
            visible:true,
            autoSelect:true,
            jsonPath: "ghb.viewGuestHouseDetails.category",
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
                masterName: "CATEGORY"
              },
              labelsFromLocalisation: true,
              required: true,
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
              sm: 6
            },
            required: true,
            beforeFieldChange: (action, state, dispatch) => {
    
            },
            afterFieldChange: (action, state, dispatch) => {
              onCategoryChange(action, state, dispatch);
            },
          },
        })
      }),
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
            jsonPath: "ghb.booking.userDetails[0].name",
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
          )
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
