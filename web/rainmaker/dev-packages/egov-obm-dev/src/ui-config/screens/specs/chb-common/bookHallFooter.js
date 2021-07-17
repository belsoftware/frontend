import {
  getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { validateFields } from "../utils";
import { toggleSpinner , toggleSnackbar} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { showHideConfirmationPopup } from "./bookHall";
import { checkIfCitizenEditScreen } from "../utils";

const checkIfFormIsValid = async (state, dispatch) => {

  let isFormValid = true;

  const isBookingDetailsValid = validateFields(
    "components.bookingDetails.children.cardContent.children.bookingDetails.children.cardContent.children.applicantDetailsCardContainer.children",
    state,
    dispatch,
    "bookHall"
  );  

  const isBankDetailsValid = validateFields(
    "components.bookingDetails.children.cardContent.children.bankDetails.children.cardContent.children.bankDetailsCardContainer.children",
    
    state,
    dispatch,
    "bookHall"
  );

  let isAppicantInfoValid = validateFields(
    "components.bookingDetails.children.cardContent.children.applicantInfo.children.details.children.cardContent.children.applicantDetailsCardContainer.children",
    state,
    dispatch,
    "bookHall"
  );
  isAppicantInfoValid = (process.env.REACT_APP_NAME === "Citizen")?
                          isAppicantInfoValid?
                            true:false:
                          true; 

  const isDocumentSelectValid = checkCorrectnessOfDocs(state, dispatch);

  // const uploadedDocsInRedux = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "documentsUploadRedux",
  //   []
  // );

  //let isMandatoryDocsUploaded = true;
  // for(var key in uploadedDocsInRedux){
  //   if(uploadedDocsInRedux[key].isDocumentRequired && 
  //     (!uploadedDocsInRedux[key].documents || (uploadedDocsInRedux[key].documents && uploadedDocsInRedux[key].documents.length<1)))
  //   {
  //     isMandatoryDocsUploaded = false;
  //     break;
  //   }
  // }

  console.log("Check ",isAppicantInfoValid,isBankDetailsValid,isBookingDetailsValid, isDocumentSelectValid);

  isFormValid = isAppicantInfoValid && isBankDetailsValid && isBookingDetailsValid && isDocumentSelectValid;

  //If form is invalid show message and return.
  if(!isFormValid)
  {
    if(!isAppicantInfoValid || !isBankDetailsValid || !isBookingDetailsValid)
    {
        dispatch(toggleSnackbar(
          true,
          {
            labelName: "Please fill the required fields.",
            labelKey: "ERR_FILL_ALL_FIELDS"
          },
          "info"
        )
      );
    }
    else
    {
        dispatch(toggleSnackbar(
          true,
          {
            labelName: "Please upload mandatory documents.",
            labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
          },
          "info"
        )
      );
    }
    return;
  }

  if (isFormValid) {
    showHideConfirmationPopup(state, dispatch);
  }
};

export const postBookingData = async (state,dispatch) =>{
  try {
    dispatch(toggleSpinner());

    const uploadedDocsInRedux = get(
      state.screenConfiguration.preparedFinalObject,
      "documentsUploadRedux",
      []
    );

    let docListToBeSentToApi = [];
    for(var key in uploadedDocsInRedux){
      if(uploadedDocsInRedux[key].documents && uploadedDocsInRedux[key].documents.length>0)
      {
        const {documents, ...rest} = uploadedDocsInRedux[key];
        let newDocument = {...rest, ...uploadedDocsInRedux[key].documents[0]}; 
        docListToBeSentToApi.push(newDocument);
      }
    }

    console.log("List of docs for API", docListToBeSentToApi);
    dispatch(prepareFinalObject("chb.booking[0].wfDocuments", docListToBeSentToApi));
    dispatch(prepareFinalObject("chb.booking[0].applicationDocuments", docListToBeSentToApi));

    //Conver userDetails from Array to Object as expected by the API
    const userDetails = get(state.screenConfiguration.preparedFinalObject,"chb.booking[0].userDetails",[]);
    if(userDetails.length > 0)
    {
      dispatch(prepareFinalObject("chb.booking[0].userDetails", userDetails[0]));
    }

    //toberemoved
    dispatch(prepareFinalObject("chb.booking[0].selectedDate", 1629124721000));

    const booking = get(
      state.screenConfiguration.preparedFinalObject,
      "chb.booking[0]"
    );
    
    let payload = {
      booking: booking,
    };

    if(checkIfCitizenEditScreen()) //If its citizen-edit screen for citizen-review call update.
      {
        payload = await httpRequest(
          "post",
          "obm-services/chb/_create",
          "_update",
          [],
          payload
        );
      }
      else  //else call create.
      {
        payload = await httpRequest(
          "post",
          "obm-services/chb/_create",
          "_create",
          [],
          payload
        );
      }

    if (payload.booking && payload.booking.length>0 && payload.booking[0].applicationNumber) {
      dispatch(toggleSpinner());
      const applicationNumber = payload.booking[0].applicationNumber;
      const status = "success";
      const purpose = "apply"
      dispatch(
        setRoute(
          `./acknowledgement?applicationNumber=${applicationNumber}&status=${status}&purpose=${purpose}`
        )
      );
      //window.location.href = `acknowledgement?purpose=resubmit&status=success&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}`;
    }
  } 
  catch (error) {
    console.log(error)
    dispatch(toggleSpinner());
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "API Error",
        labelKey: "ERR_API_ERROR"
      },
      "info"
    ));
  }
}

const callBackSubmit = async (state, dispatch) => {
  checkIfFormIsValid(state, dispatch);
};

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

const checkCorrectnessOfDocs = (state, dispatch) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;    
  for (let i = 0; i < documentsFormat.length; i++) {
    let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");    
    if (isDocumentRequired) {
      let documents = get(documentsFormat[i], "documents");      
      if(documents != undefined){
          if (documents && documents.length > 0) {           
            if (isDocumentTypeRequired) {             
              let dropdownData = get(documentsFormat[i], "dropdown.value");
              if (dropdownData) {
                // if (get(documentsFormat[i], "dropdown.value") !== null && get(documentsFormat[i]).dropdown !==undefined ){
                validateDocumentField = true;
              } else {
                dispatch(
                  toggleSnackbar(
                    true,
                    { labelName: "Please select type of Document!", labelKey: "" },
                    "warning"
                  )
                );
                validateDocumentField = false;
                break;
              }
            } else {
              validateDocumentField = true;
            }
          } 
          // else if (!isModifyMode()) {
           
          //   dispatch(
          //     toggleSnackbar(
          //       true,
          //       { labelName: "Please upload mandatory documents!", labelKey: "" },
          //       "warning"
          //     )
          //   );
          //   validateDocumentField = false;
          //   break;
          // } 
          else {
            validateDocumentField = true;
          }
        }
        else{
         
          dispatch(
            toggleSnackbar(
              true,
              { labelName: "Please upload mandatory documents!", labelKey: "" },
              "warning"
            )
          );
          validateDocumentField = false;
          break;
        }
    }
    
    else {
      validateDocumentField = true;
    }
  }

  return validateDocumentField;
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    visible:false,
    props: {
      variant: "contained",
      color: "primary",
      className:"submit-btn",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "inherit"
      }
    },
    children: {
      // previousButtonIcon: {
      //   uiFramework: "custom-atoms",
      //   componentPath: "Icon",
      //   props: {
      //     iconName: "keyboard_arrow_right"
      //   }
      // },
      previousButtonLabel: getLabel({
        labelName: "",
        labelKey: "OBM_SUBMIT_APPLICATIOn"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackSubmit
    },
    visible: true
  },
});