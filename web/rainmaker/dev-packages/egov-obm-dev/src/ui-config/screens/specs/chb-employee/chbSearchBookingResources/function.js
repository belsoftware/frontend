import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { loadBookingDetails, searchForHall } from "../../utils";
// import { genderValues } from "../../../../../ui-utils/constants";
import { validateFields } from "../../utils";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
// import {
//   convertEpochToDate,
//   convertDateToEpoch,
//   getTextToLocalMapping
// } from "../../utils";

export const searchApiCall = async (state, dispatch) => {

  showHideTable(false, dispatch);

  let queryParams = [
    //{ key: "limit", value: "10" }
  ];

  const isSearchSetValid = validateFields(
    "components.div.children.chbSearchCard.children.cardContent.children.searchContainerCommon.children",
    state,
    dispatch,
    "searchBooking"
  );

  if (!isSearchSetValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill the required fields to search.",
          labelKey: "BND_COMMON_REQ_FIELDS_ERR"
        },
        "warning"
      )
    );
    return;
  }
  let tenantId = getTenantId();

  let fromDate = get(state.screenConfiguration.preparedFinalObject,"chb.search.fromDate");
  let toDate = get(state.screenConfiguration.preparedFinalObject,"chb.search.toDate");

  if (fromDate && toDate ) {
    let fromDateofsearch=get(state.screenConfiguration.preparedFinalObject,"chb.search.fromDate")
    let toDateepochofsearch=get(state.screenConfiguration.preparedFinalObject,"chb.search.toDate")
    if(fromDateofsearch>toDateepochofsearch)
    {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "",
            labelKey: "From Date should not be before To Date "
          },
          "warning"
        )
      );
      return;
    }
  }
 
  let applicationNumber = get(state.screenConfiguration.preparedFinalObject,"chb.search.applicationNumber");
  let status = get(state.screenConfiguration.preparedFinalObject,"chb.search.status");
  let hallId = get(state.screenConfiguration.preparedFinalObject,"chb.search.hallId");

  let data = {fromDate: fromDate, 
              toDate: toDate, 
              tenantId: tenantId, 
              applicationNumber: applicationNumber, 
              status: status,
              hallId: hallId
            };

  const responseFromAPI = await loadBookingDetails(state,dispatch,data);
  //tobechanged below
  const bookingsList = (responseFromAPI && responseFromAPI.booking) 
    || {"booking":[{"tenantId":"pb.agra","applicationDate": 1625661195247, "applicationNumber": "ABCD", "status":"APPLIED","hallId":"HALL1", "category":"CANTT_STAFF","fromDate":"1622902988000","toDate":"1622989388000","tenantId":"pb.agra","workflowCode":"LAMS_NewLR_CEO_V3","action":"APPLY","residentType":"canttResident","category":"Office Staff","purpose":"Marriage","userDetails":[{"id":2034,"userName":"9480734475","salutation":null,"name":"विवेक बिष्ट","gender":"MALE","mobileNumber":"9480734475","emailId":"test@test.com","altContactNumber":"4567891045","pan":"bchfb7634l","aadhaarNumber":null,"permanentAddress":"asdf,,streetname,asdf,city","permanentCity":"pb.agra","permanentPinCode":"512465","correspondenceAddress":null,"correspondenceCity":null,"correspondencePinCode":null,"active":true,"locale":null,"type":"CITIZEN","accountLocked":false,"accountLockedDate":0,"fatherOrHusbandName":"Jayas kk","signature":null,"bloodGroup":null,"photo":null,"identificationMark":null,"createdBy":2032,"lastModifiedBy":1,"tenantId":"pb","roles":[{"code":"CITIZEN","name":"Citizen","tenantId":"pb"}],"uuid":"cfd640e6-b19e-4429-a710-86fa41e51cf9","createdDate":1597937400000,"lastModifiedDate":1625332380000,"dob":"1990-01-01","pwdExpiryDate":1607554800000}],"bankDetails":{"accountNumber":"123412341234","repeatAccountNumber":"12341234123412","ifscCode":"SBIN0191911","nameOfBank":"asdfasdfasd","accountHolderName":"fasdfasdfa"},"wfDocuments":[{"documentType":"APPLICANT","documentCode":"APPLICANT.IDENTITYPROOF","isDocumentRequired":true,"isDocumentTypeRequired":true,"dropdown":{"value":"APPLICANT.IDENTITYPROOF.AADHAAR"},"fileName":"s.jpg","fileStoreId":"f2684e01-d949-487d-b50b-546091f74743","fileUrl":"https://13.71.65.215.nip.io/filestore/v1/files/id?fileStoreId=f2684e01-d949-487d-b50b-546091f74743&tenantId=pb"},{"documentType":"APPLICANT","documentCode":"APPLICANT.ADDRESSPROOF","isDocumentRequired":true,"isDocumentTypeRequired":true,"dropdown":{"value":"APPLICANT.ADDRESSPROOF.ELECTRICITYBILL"},"fileName":"s.jpg","fileStoreId":"733e996b-2899-440e-9897-865286e43e25","fileUrl":"https://13.71.65.215.nip.io/filestore/v1/files/id?fileStoreId=733e996b-2899-440e-9897-865286e43e25&tenantId=pb"}]}]};

  const bookingData = bookingsList.booking.map(item => {
    return {
      id: get(item, "id"),
      applicationNumber: get(item, "applicationNumber"),
      applicationDate: get(item, "applicationDate"),
      hallId: get(item, "hallId"),
      fromDate: get(item, "fromDate"),
      toDate: get(item, "toDate"),
      status: get(item, "status"),
      tenantId: get(item, "tenantId"),
    };
  });

  dispatch(
    prepareFinalObject("chb.bookingSearchResponse", bookingData)
  );

  // const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "searchScreenMdmsData.common-masters.uiCommonPay");
  // const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);
    
  try {
    let data = bookingData.map(item => ({
      ["TENANT_ID"]: item.tenantId,
      ['OBM_TABLE_ID']: item.id || "-",
      ['OBM_APPL_NO']: item.applicationNumber || "-",
      ["OBM_APPLICATION_DATE"]: convertEpochToDate(item.applicationDate) || "-",
      ["OBM_APPLICATION_STATUS"]: item.status || "-",
    }));

    dispatch(
      handleField(
        "searchBooking",
        "components.div.children.searchResults",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "searchBooking",
        "components.div.children.searchResults",
        "props.tableData",
        bookingData
      )
    );
    dispatch(
      handleField(
        "searchBooking",
        "components.div.children.searchResults",
        "props.rows",
        bookingData.length
      )
    );

    showHideTable(true, dispatch);
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error);
  }
}

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "searchBooking",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
