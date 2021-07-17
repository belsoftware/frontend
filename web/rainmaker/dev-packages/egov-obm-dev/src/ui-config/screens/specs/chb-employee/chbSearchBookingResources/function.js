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
  const bookingsList = (responseFromAPI && responseFromAPI.booking);

  const bookingData = bookingsList.map(item => {
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
