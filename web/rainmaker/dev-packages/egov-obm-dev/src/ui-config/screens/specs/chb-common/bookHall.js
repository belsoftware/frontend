import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import {getSelectField , getLabelWithValue, getPattern, getTextField, getCommonGrayCard, getCommonCard, getCommonContainer, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadCertDetails, loadHallDetails, loadHallDetailsMdms, getDetailsOfApplicant} from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import {footer} from "./bookHallFooter";
import { localStorageGet, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { split } from "lodash";
import jp from "jsonpath";
import { getDocumentsList } from "./chbBookResources/DocumentList";
import {patterns} from "../utils/constants";
import {confirmationDialog} from "./bookHallConfirmDialog";
import { getSlotText } from "../../../../ui-utils/commons";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const prepareSlotDetails = (action,state, dispatch) => {
  let timeSlotList = [];
  try{
    let hallMdms = get(state,"screenConfiguration.preparedFinalObject.chb.viewHallDetailsMdms");
    jp.query(hallMdms, "$.timeSlots.*").forEach(slot => {
      let timeSlotText = getSlotText(slot, new Date());
      timeSlotList.push({"id":slot.id,"name":timeSlotText,"code":slot.id});
    });
    dispatch(prepareFinalObject("chb.timeSlotList", timeSlotList));
  }
  catch(e)
  {
    console.error(e);
    //toberemoved
    alert("Mdms Time Slots not configured correctly! Please recheck the correctness of the format"); 
  }
}

const onPurposeChange = (action, state, dispatch) =>{
  console.log("Purpose changed");
}

const onCategoryChange = (action, state, dispatch) =>{
  let category = get(state,"screenConfiguration.preparedFinalObject.chb.booking[0].category");
  dispatch(prepareFinalObject("documentsContract", getDocumentsList(category)));
}

//Convert YYYY-MM-dd to dd-MM-YYYY
const convertDate = (dateString) =>{
  let splits = dateString.split("-");
  return splits[2]+"-"+splits[1]+"-"+splits[0];
}

export const showHideConfirmationPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["bookHall"],
   "components.confirmationDialog.props.open",
   false
 );
 dispatch(
   handleField("bookHall", 
   "components.confirmationDialog", "props.open", !toggle)
 );
 };

const bookHall = {
  uiFramework: "material-ui",
  name: "bookHall",
  beforeInitScreen:(action, state, dispatch) => {

    let tenantId = getQueryArg(window.location.href, "tenantId");
    let hallId = getQueryArg(window.location.href, "hallId");

    let data = {tenantId:tenantId, hallId:hallId};

    loadHallDetails(action, state, dispatch, data).then((response) => {
      if (response && response.length > 0) {
        dispatch(prepareFinalObject("chb.viewHallDetails", response[0]));
      }
    });

    //Load Hall Mdms
    loadHallDetailsMdms(action, state, dispatch, data).then((response) => {

      if (response && response.MdmsRes && response.MdmsRes.CommunityHallBooking 
        && response.MdmsRes.CommunityHallBooking.CommunityHalls && response.MdmsRes.CommunityHallBooking.CommunityHalls.length >0 ) {
        let hallMdms = response.MdmsRes.CommunityHallBooking.CommunityHalls[0];
        dispatch(prepareFinalObject("chb.viewHallDetailsMdms", hallMdms));

        let purposeList = [];
        jp.query(hallMdms, "$.purposes.*").forEach(purpose => {
          let purposeName = purpose.purpose;
          purposeList.push({"id":purposeName,"name":purposeName,"code":purposeName});
        });
        dispatch(prepareFinalObject("chb.purposeList", purposeList));

        let specialCategoryList = [];
        jp.query(hallMdms, "$.specialCategories.*").forEach(category => {
          let categoryName = category.category;
          specialCategoryList.push({"id":categoryName,"name":categoryName,"code":categoryName});
        });
        specialCategoryList.push({"id":"None","name":"None","code":"None"});
        dispatch(prepareFinalObject("chb.specialCategoryList", specialCategoryList));

        let residentTypeList = [];
        jp.query(hallMdms, "$.residentType.*").forEach(residentType => {
          let type = residentType.type;
          residentTypeList.push({"id":type,"name":type,"code":type});
        });
        dispatch(prepareFinalObject("chb.residentTypeList", residentTypeList));

        //toberemoved from here.
        let timeSlotList = [];
        try{
          jp.query(hallMdms, "$.timeSlots.*").forEach(slot => {
            let timeSlotText = getSlotText(slot, new Date());
            timeSlotList.push({"id":slot.id,"name":timeSlotText,"code":slot.id});
          });
          dispatch(prepareFinalObject("chb.timeSlotList", timeSlotList));
        }
        catch(e)
        {
          console.error(e);
          //toberemoved
          alert("Mdms Time Slots not configured correctly! Please recheck the correctness of the format"); 
        }
      }
    });

  
    let fromDate = localStorageGet("chb.search.fromDate")? convertDate(localStorageGet("chb.search.fromDate")):"";
    let toDate = localStorageGet("chb.search.toDate")? convertDate(localStorageGet("chb.search.toDate")):"";
    //let tenantId = localStorageGet("chb.search.tenantId")? convertDate(localStorageGet("chb.search.tenantId")):"";
    dispatch(prepareFinalObject("chb.booking[0].fromToDateString", fromDate+" to "+toDate ));

    //Set the intial booking date and tenantId
    dispatch(prepareFinalObject("chb.booking[0].fromDate", fromDate));
    dispatch(prepareFinalObject("chb.booking[0].toDate", toDate));
    dispatch(prepareFinalObject("chb.booking[0].tenantId", tenantId));
    dispatch(prepareFinalObject("chb.booking[0].hallId", hallId));

    //Set the workflow code and action
    dispatch(prepareFinalObject("chb.booking[0].workflowCode", "OBM_CHB_V1"));
    dispatch(prepareFinalObject("chb.booking[0].action", "APPLY"));
    dispatch(prepareFinalObject("chb.booking[0].businessService", "obm-services"));

    //Set the documents data for display
    dispatch(prepareFinalObject("documentsContract", getDocumentsList()));

    return action;

  },

  components:{
    // selectedHallDetails: getCommonCard({
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
              jsonPath: "chb.viewHallDetails.name",
              //callBack: checkNoData
            }
          ),
          // bookedTime: getLabelWithValue(
          //   {
          //     labelName: "Booking Dates",
          //     labelKey: "OBM_BOOKING_DATES"
          //   },
          //   {
          //     jsonPath: "chb.booking[0].fromToDateString",
          //     //callBack: getGenderStr
          //   }
          // )
        }),
      availability: getCommonContainer(
        {
          bookingCalender: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-obm",
            componentPath: "Calender",
            props: {
              content: "For this property",
              jsonPath : "chb.viewHallDetails.calender",
              sourceJsonPath: "chb.viewHallDetails.calender",
              outJsonPath: "chb.booking[0].selectedDate",
              onChange: (action, state, dispatch) => {
                prepareSlotDetails();
              }
            },
          },
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
          selectSlot: {
            uiFramework: "custom-containers",
            moduleName: "egov-obm",
            componentPath: "AutosuggestContainer",
            visible:true,
            autoSelect:true,
            jsonPath: "chb.booking[0].timeSlotId",
            props:{
              autoSelect:true,
              //isClearable:true,
              className: "autocomplete-dropdown",
              suggestions: [],
              disabled:false,//getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
              label: {
                labelName: "Select Slot",
                labelKey: "OBM_SELECT_SLOT"
              },
              placeholder: {
                labelName: "Select Slot",
                labelKey: "OBM_SELECT_SLOT"
              },
              // localePrefix: {
              //   moduleName: "OBM",
              //   masterName: "SLOT"
              // },
              labelsFromLocalisation: false,
              required: true,
              sourceJsonPath: "chb.timeSlotList",
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
              
            },
          },
          // residentType: getSelectField({
          //   label: {
          //     labelName: "Select Resident Type",
          //     labelKey: "OBM_IS_CANTT_RESIDENT"
          //   },
          //   placeholder: {
          //     labelName: "Select Gender",
          //     labelKey: "OBM_IS_CANTT_RESIDENT"
          //   },
          //   required: true,
          //   localePrefix: {
          //     moduleName: "OBM",
          //     masterName: "CHB"
          //   },
          //   data: [
          //     {
          //       code: "canttResident",
          //       label: "OBM_CANTT_RESIDENT"
          //     },
          //     {
          //       code: "nonCantResident",
          //       label: "OBM_NON_CANTT_RESIDENT"
          //     }
          //   ],
          //   props:{
          //     disabled: false,
          //   },
          //   gridDefination: {
          //     xs: 12,
          //     sm: 4
          //   },
          //   jsonPath: "chb.booking[0].residentType",
          //   autoSelect: true,
          //   visible: true,
          //   beforeFieldChange: (action, state, dispatch) => {
            
          //   },
          //   afterFieldChange: (action, state, dispatch) => {
            
          //   },
          // }),
          residentType: {
            uiFramework: "custom-containers",
            moduleName: "egov-obm",
            componentPath: "AutosuggestContainer",
            visible:true,
            autoSelect:true,
            jsonPath: "chb.booking[0].residentType",
            props:{
              autoSelect:true,
              //isClearable:true,
              className: "autocomplete-dropdown",
              suggestions: [],
              disabled:false,//getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
              label: {
                labelName: "Select Resident Type",
                labelKey: "OBM_SELECT_RESIDENTTYPE"
              },
              placeholder: {
                labelName: "Select Resident Type",
                labelKey: "OBM_SELECT_RESIDENTTYPE"
              },
              localePrefix: {
                moduleName: "OBM",
                masterName: "RESIDENTTYPE"
              },
              labelsFromLocalisation: true,
              required: true,
              sourceJsonPath: "chb.residentTypeList",
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
          category: {
            uiFramework: "custom-containers",
            moduleName: "egov-obm",
            componentPath: "AutosuggestContainer",
            visible:true,
            autoSelect:true,
            jsonPath: "chb.booking[0].category",
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
              sourceJsonPath: "chb.specialCategoryList",
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
          purpose: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-obm",
            componentPath: "AutosuggestContainer",
            visible:true,
            autoSelect:true,
            jsonPath: "chb.booking[0].purpose",
            props:{
              sourceJsonPath: "chb.purposeList",
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
              sm: 4
            },
            required: true,
            beforeFieldChange: (action, state, dispatch) => {
    
            },
            afterFieldChange: (action, state, dispatch) => {
              onPurposeChange(action, state, dispatch);
            },
          },
          purposeString: getTextField({
            label: {
              labelName: "Purpose",
              labelKey: "OBM_PURPOSE_DESC"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Enter Purspose Description",
              labelKey: "OBM_PURPOSE_DESC"
            },
            required: true,
            pattern: patterns["purposeDescription"],
            jsonPath: "chb.booking[0].userDetails[0].purposeDescription",
            gridDefination: {
              xs: 12,
              sm: 6
            }
          }),
        })
      }),
      applicantInfo:{
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
        },
        children: {
          details: getCommonGrayCard({
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
                jsonPath: "chb.booking[0].userDetails[0].mobileNumber",
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
                jsonPath: "chb.booking[0].userDetails[0].name",
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
          }),
        },
        visible: process.env.REACT_APP_NAME === "Citizen" ? false: true
      },
      bankDetails: getCommonGrayCard({
        header: getCommonSubHeader(
          {
            labelName: "Bank Details for Refund",
            labelKey: "OBM_BANK_DETAILS"
          },
          {
            style: {
              marginBottom: 18
            }
          }
        ),
        bankDetailsCardContainer: getCommonContainer({
          accountNo: getTextField({
            label: {
              labelName: "Account Number",
              labelKey: "OBM_ACCOUNT_NO"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Enter Account Number",
              labelKey: "OBM_ACCOUNT_NO"
            },
            required: true,
            type:"password",
            pattern: patterns["accountNumber"],
            jsonPath: "chb.booking[0].bankDetails.accountNumber",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }),
          repeatAccountNo: getTextField({
            label: {
              labelName: "Account Number",
              labelKey: "OBM_REPEAT_ACCOUNT_NO"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Enter Account Number",
              labelKey: "OBM_REPEAT_ACCOUNT_NO"
            },
            required: true,
            type:"password",
            pattern: patterns["accountNumber"],
            jsonPath: "chb.booking[0].bankDetails.repeatAccountNumber",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }),
          ifscCode: getTextField({
            label: {
              labelName: "Ifsc Code",
              labelKey: "OBM_IFSC_CODE"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Ifsc Code",
              labelKey: "OBM_IFSC_CODE"
            },
            required: true,
            type:"password",
            pattern: patterns["ifscCode"],
            jsonPath: "chb.booking[0].bankDetails.ifscCode",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }),
          nameOfTheBank: getTextField({
            label: {
              labelName: "Name of the Bank",
              labelKey: "OBM_BANK_NAME"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Name of the Bank",
              labelKey: "OBM_BANK_NAME"
            },
            required: true,
            pattern: patterns["bankName"],
            jsonPath: "chb.booking[0].bankDetails.nameOfBank",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          }),
          accountHolderName: getTextField({
            label: {
              labelName: "Name",
              labelKey: "OBM_ACCOUNT_HOLDER_NMAE"
            },
            props:{
              className:"applicant-details-error"
            },
            placeholder: {
              labelName: "Account Holder Name",
              labelKey: "OBM_ACCOUNT_HOLDER_NMAE"
            },
            required: true,
            pattern: patterns["accountHolderName"],
            jsonPath: "chb.booking[0].bankDetails.accountHolderName",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          })
        }),
        info1: getCommonCaption({
          labelName: "Note: This is for refund purposes",
          labelKey: "OBM_BANK_DETAILS_NOTE"
        },
        {
          disableValidation:true,
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
    },
    confirmationDialog: {
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
            popup: confirmationDialog
          }
        }
      }
    }
   }
  }


export default bookHall;
