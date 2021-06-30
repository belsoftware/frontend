import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { searchForGuestHouse } from "../../utils";
// import { genderValues } from "../../../../../ui-utils/constants";
import { validateFields } from "../../utils";
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

  let tenantId = get(state.screenConfiguration.preparedFinalObject,"ghb.search.tenantId");
  if(tenantId)
    queryParams.push({ key: "tenantId",value: tenantId});

  let fromdate = get(state.screenConfiguration.preparedFinalObject,"ghb.search.fromdate");
  let todate = get(state.screenConfiguration.preparedFinalObject,"ghb.search.todate");

  const isSearchSetValid = validateFields(
    "components.div.children.ghbSearchCard.children.cardContent.children.searchContainerCommon.children",
    state,
    dispatch,
    "searchGuestHouse"
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
  if (fromdate && todate ) {
    let fromdateofsearch=get(state.screenConfiguration.preparedFinalObject,"ghb.search.fromdate")
    let todateepochofsearch=get(state.screenConfiguration.preparedFinalObject,"ghb.search.todate")
    if(fromdateofsearch>todateepochofsearch)
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

  const responseFromAPI = await searchForGuestHouse(dispatch, queryParams)
  const guestHouseList = (responseFromAPI && responseFromAPI.size > 0) || [{"name":"Residency","tenantId":"pb.agra","priceText":"Starting at 1200/day", "availability":"Available", "id":"GH_1","available":true,"fullDetails":{"maxAllowedBookingDays":20,"maxAllowedHalls":10},"halls":[{"hallId":"hall1","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}}]}];

  const guestHouseData = guestHouseList.map(item => {
    return {
      id: get(item, "id"),
      name: get(item, "name"),
      price: get(item, "priceText"),
      availability: get(item, "availability"),
      tenantId: get(item, "tenantId")
    };
  });
  dispatch(
    prepareFinalObject("ghb.guestHouseSearchResponse", guestHouseData)
  );

  // const uiConfigs = get(state.screenConfiguration.preparedFinalObject, "searchScreenMdmsData.common-masters.uiCommonPay");
  // const configObject = uiConfigs.filter(item => item.code === searchScreenObject.businesService);
    
  try {
    let data = guestHouseData.map(item => ({
      ["TENANT_ID"]: item.tenantId,
      ['OBM_TABLE_ID']: item.id || "-",
      ['CORE_COMMON_NAME']: item.name || "-",
      ["OBM_PRICE"]: item.price || "-",
      ["OBM_AVAILABILITY"]: item.availability || "-",
      ["OBM_ACTION"]: "OBM_VIEW_DETAILS",
    }));
    dispatch(
      handleField(
        "searchGuestHouse",
        "components.div.children.searchResults",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "searchGuestHouse",
        "components.div.children.searchResults",
        "props.tableData",
        guestHouseData
      )
    );
    dispatch(
      handleField(
        "searchGuestHouse",
        "components.div.children.searchResults",
        "props.rows",
        guestHouseData.length
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
      "searchGuestHouse",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
