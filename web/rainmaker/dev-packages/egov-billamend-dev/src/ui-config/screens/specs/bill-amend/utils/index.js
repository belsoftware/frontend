import get from "lodash/get";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import jp from "jsonpath";
import { httpRequest } from "../../../../../ui-utils/api"; 
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

export const getCommonApplyFooter = (children) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
    },
    children,
  };
};

export const prepareDocumentsUploadData = (state, dispatch) => {
  const demandRevisionBasisValue = get( state.screenConfiguration.preparedFinalObject, "Amendment.amendmentReason", "");
  const documentObj = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.BillAmendment.documentObj"
  );
  const documentTypes = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.common-masters.DocumentType"
  );

  let documentObjArray = [];
  let flag = false;

  documentObj.forEach((docObj) => {
    docObj.allowedDocs.forEach((innerObj) => {
      innerObj.demandRevisionBasis.forEach((value) => {
        if (value === demandRevisionBasisValue) flag = true;
      });
    });
    if (flag) {
      documentObjArray.push(docObj);
      flag = false;
      return true;
    }
  });

  let documents = documentObjArray[0].allowedDocs

  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach(doc => {
      let card = {};
      card["name"] = doc.documentType;
      card["code"] = doc.documentType;
      card["required"] = doc.required ? true : false;
      if (doc.dropdownData) {
        let dropdown = {};
        dropdown.label = "BILL_SELECT_LABEL";
        dropdown.required = doc.required;
        dropdown.menu = doc.dropdownData.filter(item => {
          return item.active;
        });
        dropdown.menu = dropdown.menu.map(item => {
          return { code: item.code, label: getTransformedLocale(item.code) };
        });
        card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

export const getTranslatedLabel = (labelKey, localizationLabels) => {
  let translatedLabel = null;
  if (localizationLabels && localizationLabels.hasOwnProperty(labelKey)) {
    translatedLabel = localizationLabels[labelKey];
    if (
      translatedLabel &&
      typeof translatedLabel === "object" &&
      translatedLabel.hasOwnProperty("message")
    )
      translatedLabel = translatedLabel.message;
  }
  return translatedLabel || labelKey;
};

export const validateFields = (
  objectJsonPath,
  state,
  dispatch,
  screen = "apply"
) => {
  const fields = get(
    state.screenConfiguration.screenConfig[screen],
    objectJsonPath,
    {}
  );
  let isFormValid = true;
  for (var variable in fields) {
    if (fields.hasOwnProperty(variable)) {
      if (
        fields[variable] &&
        fields[variable].props &&
        (fields[variable].props.disabled === undefined ||
          !fields[variable].props.disabled) &&
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            ),
          },
          dispatch,
          true
        )
      ) {
        isFormValid = false;
      }
    }
  }
  return isFormValid;
};

export const onDemandRevisionBasis = async (state, dispatch) => {
  let demandRevisionBasis = get(
      state.screenConfiguration.preparedFinalObject,
      "Amendment.amendmentReason", ""
  );
  
  switch (demandRevisionBasis) {
      case "COURT_CASE_SETTLEMENT":
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
                  "visible",
                  true
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
                  "visible",
                  true
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.documentNo",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.fromDate",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.toDate",
                  "visible",
                  false
              )
          );
          break;
      case "ARREAR_WRITE_OFF":
      case "ONE_TIME_SETTLEMENT":
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
                  "visible",
                  true
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.documentNo",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.fromDate",
                  "visible",
                  true
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.toDate",
                  "visible",
                  true
              )
          );
          break;
      case "DCB_CORRECTION":
      case "REMISSION_FOR_PROPERTY_TAX":
      case "OTHERS":
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.courtOrderNo",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.dateEffectiveFrom",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.govtNotificationNumber",
                  "visible",
                  false
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.documentNo",
                  "visible",
                  true
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.fromDate",
                  "visible",
                  true
              )
          );
          dispatch(
              handleField(
                  "apply",
                  "components.div.children.formwizardThirdStep.children.summary.children.cardContent.children.grayDiv.children.cardContent.children.demandRevisionContainer.children.toDate",
                  "visible",
                  true
              )
          );
          break;
      default:
          
          break;
  }
}

export const submitApplication = async (state, dispatch) => {

  let billAmdDetails = get (state.screenConfiguration.preparedFinalObject, "Amendment", {});
  let fetchBillDetails = get (state.screenConfiguration.preparedFinalObject, "fetchBillDetails", []);
  let amountType = get (state.screenConfiguration.preparedFinalObject, "BILL.AMOUNTTYPE", "");
  let reduxDocuments = get( state, "screenConfiguration.preparedFinalObject.documentsUploadRedux", {});
  let documentsPreview = [], demandDetails = [];;
  jp.query(reduxDocuments, "$.*").forEach(doc => {
    if (doc.documents && doc.documents.length > 0 && doc.dropdown) {
      doc.documents.forEach(docDetail => {
        let obj = {};
        obj.documentType = doc.dropdown.value;
        obj.fileName = docDetail.fileName;
        obj.fileStoreId = docDetail.fileStoreId;
        obj.fileStore = docDetail.fileStoreId;
        obj.fileUrl = docDetail.fileUrl && docDetail.fileUrl.split(",")[0];
        documentsPreview.push(obj);
      });
    }
  });

  fetchBillDetails.map( data => {
    let obj = {};
    obj.taxHeadMasterCode = data.taxHeadCode;
    obj.tenantId = data.tenantId;
    obj.collectionAmount = data.collectionAmount;
    if(amountType == "reducedAmount") {
      obj.taxAmount = data.reducedAmountValue ? -data.reducedAmountValue : 0;
    } else {
      obj.taxAmount = data.additionalAmountValue ? data.additionalAmountValue : 0;
    }
    demandDetails.push(obj);
  });

  billAmdDetails.documents = documentsPreview && documentsPreview.length > 0 ? documentsPreview : null;
  billAmdDetails.demandDetails = demandDetails;

  if (get(billAmdDetails, "fromDate")) {
    billAmdDetails.fromDate = convertDateToEpoch(get(billAmdDetails, "fromDate"));
  }

  if (get(billAmdDetails, "toDate")) {
    billAmdDetails.toDate = convertDateToEpoch(get(billAmdDetails, "toDate"));
  }

  if (get(billAmdDetails, "dateEffectiveFrom")) {
    billAmdDetails.dateEffectiveFrom = convertDateToEpoch(get(billAmdDetails, "dateEffectiveFrom"));
  }

  try {

    let response = await httpRequest(
      "post",
      "billing-service/amendment/_create",
      "",
      [],
      { Amendment : billAmdDetails }
    );
    dispatch(prepareFinalObject("Amendment", response.Amendments[0]));

    dispatch(
      setRoute(`/bill-amend/acknowledgement?purpose=apply&status=success&applicationNumber=${response.Amendments[0].consumerCode}`)
    );
    
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    return { status: "failure", message: error };
  }
};