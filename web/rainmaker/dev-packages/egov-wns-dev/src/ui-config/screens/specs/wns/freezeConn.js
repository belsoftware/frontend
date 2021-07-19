import {
  getCommonCard,
  getCommonContainer,
  getCommonHeader,
  getCommonTitle,
  getCommonGrayCard,
  getCommonSubHeader,
  convertEpochToDate,
  getTextField,
  getPattern,
  getDateField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  createEstimateData,
  getFeesEstimateCard,
  ifUserRoleExists,
} from "../utils";
//import { getSearchResults, getSearchResultsForSewerage, fetchBill, getDescriptionFromMDMS, getConsumptionDetails, billingPeriodMDMS, serviceConst } from "../../../../ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  unMountScreen,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg,
  getTodaysDateInYMD,
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { freezeConnDetailsFooter } from "./freezeConnection/freezeConnDetailsFooter";
import "./freezeConnection/index.css";
import {
  getSearchResults,
  getSearchResultsForSewerage,
  fetchBill,
  getDescriptionFromMDMS,
  getConsumptionDetails,
  billingPeriodMDMS,
  serviceConst,
} from "../../../../ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
//import { additionDetails } from "./applyResource/additionalDetails";

const getConnectionDetailsFooterAction = freezeConnDetailsFooter;

const getPlumberRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "RadioGroupContainer",
  gridDefination: { xs: 12, sm: 12 },
  jsonPath: "applyScreen.additionalDetails.detailsProvidedBy",
  props: {
    label: { key: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY" },
    buttons: [
      { labelKey: "WS_PLUMBER_ULB", value: "ULB" },
      { labelKey: "WS_PLUMBER_SELF", value: "Self" },
    ],
    required: false,
  },
  type: "array",
};

const additionDetails = getCommonCard({
  header: getCommonHeader({
    labelKey: "WS_ADDN_DTL",
  }),

  plumberDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_COMMON_PLUMBER_DETAILS",
    }),
    plumberDetails: getCommonContainer({
      getPlumberRadioButton,
      plumberLicenceNo: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL",
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_PLACEHOLDER",
        },
        gridDefination: {
          xs: 12,
          sm: 6,
        },
        required: false,
        pattern: /^[a-zA-Z0-9/-]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.plumberInfo[0].licenseNo",
      }),
      plumberName: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL",
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_PLACEHOLDER",
        },
        gridDefination: {
          xs: 12,
          sm: 6,
        },
        required: false,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.plumberInfo[0].name",
      }),
      plumberMobNo: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL",
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL_PLACEHOLDER",
        },
        gridDefination: { xs: 12, sm: 6 },
        iconObj: { label: "+91 |", position: "start" },
        required: false,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.plumberInfo[0].mobileNumber",
      }),
      // visible:true,
    }),
  }),

  activationDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_DEACTIVATION_DETAILS",
    }),
    activeDetails: getCommonContainer({
      connectionExecutionDate: getDateField({
        label: {
          labelName: "connectionDeactivationDate",
          labelKey: "WS_SERV_DETAIL_CONN_FREEZING_DATE",
        },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6,
        },
        required: true,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.connectionDeactivationDate",
        props: {
          inputProps: {
            min: getTodaysDateInYMD(),
          },
        },
      }),
      initialMeterReading: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_LAST_METER_READING",
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_LAST_METER_READING_PLACEHOLDER",
        },
        gridDefination: {
          xs: 12,
          sm: 6,
        },
        required: false,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.additionalDetails.lastMeterReading",
      }),
    }),
  }),
});

const pageReset = (dispatch) => {
  dispatch(prepareFinalObject("applyScreen", {}));
};

let consumerCode = getQueryArg(window.location.href, "connectionNumber");
let tenantId = getQueryArg(window.location.href, "tenantId");
let service = getQueryArg(window.location.href, "service");

const processBills = async (state, data, viewBillTooltip, dispatch) => {
  data.Bill[0].billDetails.forEach((bills) => {
    let des,
      obj,
      groupBillDetails = [];
    bills.billAccountDetails.forEach(async (element) => {
      let cessKey = element.taxHeadCode;
      let body;
      if (service === serviceConst.WATER) {
        body = {
          MdmsCriteria: {
            tenantId: getTenantId(),
            moduleDetails: [
              {
                moduleName: "ws-services-calculation",
                masterDetails: [{ name: cessKey }],
              },
            ],
          },
        };
      } else {
        body = {
          MdmsCriteria: {
            tenantId: getTenantId(),
            moduleDetails: [
              {
                moduleName: "sw-services-calculation",
                masterDetails: [{ name: cessKey }],
              },
            ],
          },
        };
      }
      let res = await getDescriptionFromMDMS(body, dispatch);
      if (
        res !== null &&
        res !== undefined &&
        res.MdmsRes !== undefined &&
        res.MdmsRes !== null
      ) {
        if (service === serviceConst.WATER) {
          des = res.MdmsRes["ws-services-calculation"];
        } else {
          des = res.MdmsRes["sw-services-calculation"];
        }
        if (
          des !== null &&
          des !== undefined &&
          des[cessKey] !== undefined &&
          des[cessKey][0] !== undefined &&
          des[cessKey][0] !== null
        ) {
          groupBillDetails.push({
            key: cessKey,
            value: des[cessKey][0].description,
            amount: element.amount,
            order: element.order,
          });
        } else {
          groupBillDetails.push({
            key: cessKey,
            value: "Please put some description in mdms for this Key",
            amount: element.amount,
            order: element.order,
          });
        }
        if (groupBillDetails.length >= bills.billAccountDetails.length) {
          let arrayData = groupBillDetails.sort(
            (a, b) => parseInt(a.order) - parseInt(b.order)
          );
          obj = {
            bill: arrayData,
            fromPeriod: bills.fromPeriod,
            toPeriod: bills.toPeriod,
            demandId: bills.demandId,
          };
          viewBillTooltip.push(obj);
        }
        if (viewBillTooltip.length >= data.Bill[0].billDetails.length) {
          let bPeriodMDMS = get(
            state.screenConfiguration.preparedFinalObject,
            "billingPeriodMDMS",
            {}
          );
          let sortedBills = viewBillTooltip.sort(
            (a, b) => b.toPeriod - a.toPeriod
          );
          //In case of old bill consider the latest bill to period
          let expiryDemandDate = billingPeriodMDMS(
            sortedBills[0].toPeriod,
            bPeriodMDMS,
            service
          );

          let dataArray = [
            {
              total: data.Bill[0].totalAmount,
              expiryDate: expiryDemandDate,
            },
          ];

          let forward = 0;
          let currentDemand = sortedBills[0];
          if (data.Bill[0].totalAmount < 0) {
            sortedBills.forEach((e) => {
              e.bill.forEach((cur) => {
                if (
                  cur.key === "WS_ADVANCE_CARRYFORWARD" ||
                  cur.key === "SW_ADVANCE_CARRYFORWARD"
                ) {
                  forward = forward + cur.amount;
                }
              });
            });
            let keyExist = false;
            currentDemand.bill.forEach((cur) => {
              if (
                cur.key === "WS_ADVANCE_CARRYFORWARD" ||
                cur.key === "SW_ADVANCE_CARRYFORWARD"
              ) {
                cur.amount = forward;
                keyExist = true;
              }
            });
            if (!keyExist) {
              currentDemand.bill.push({
                amount: forward,
                key: "ADVANCE_CARRYFORWARD",
                order: 2,
                value: "Please put some description in mdms for this key",
              });
            }
          }
          let totalArrears = 0;
          if (data.Bill[0].totalAmount > 0) {
            sortedBills.shift();
            sortedBills.forEach((e) => {
              e.bill.forEach((o) => {
                totalArrears = totalArrears + o.amount;
              });
            });
          }

          let finalArray = [
            {
              arrears: totalArrears,
              arrearsDescription:
                "Total outstanding payment of previous billing cycles.",
              description: currentDemand,
              data: dataArray,
            },
          ];
          console.log("FINAL_ARRY", finalArray);
          dispatch(prepareFinalObject("viewBillToolipData", finalArray));
        }
      }
    });
  });
};

const searchResults = async (action, state, dispatch, consumerCode) => {
  let queryObjForSearch = [
    { key: "tenantId", value: tenantId },
    { key: "connectionNumber", value: consumerCode },
  ];
  let queryObjectForConsumptionDetails = [
    { key: "tenantId", value: tenantId },
    { key: "connectionNos", value: consumerCode },
  ];
  let viewBillTooltip = [],
    data;
  if (service === serviceConst.WATER) {
    let meterReadingsData = await getConsumptionDetails(
      queryObjectForConsumptionDetails,
      dispatch
    );
    let payload = await getSearchResults(queryObjForSearch, true);
    let queryObjectForFetchBill = [
      { key: "tenantId", value: tenantId },
      { key: "consumerCode", value: consumerCode },
      { key: "businessService", value: "WS" },
    ];
    data = await fetchBill(queryObjectForFetchBill, dispatch);

    if (
      payload !== null &&
      payload !== undefined &&
      data !== null &&
      data !== undefined
    ) {
      if (payload.WaterConnection.length > 0 && data.Bill.length > 0) {
        payload.WaterConnection[0].service = service;
        await processBills(state, data, viewBillTooltip, dispatch);
        if (
          meterReadingsData !== null &&
          meterReadingsData !== undefined &&
          meterReadingsData.meterReadings.length > 0
        ) {
          payload.WaterConnection[0].consumption =
            meterReadingsData.meterReadings[0].currentReading -
            meterReadingsData.meterReadings[0].lastReading;
          payload.WaterConnection[0].currentMeterReading =
            meterReadingsData.meterReadings[0].currentReading;
          payload.WaterConnection[0].lastMeterReading =
            meterReadingsData.meterReadings[0].lastReading;
          meterReadingsData.meterReadings[0].currentReadingDate =
            convertEpochToDate(
              meterReadingsData.meterReadings[0].currentReadingDate
            );
          meterReadingsData.meterReadings[0].lastReading =
            meterReadingsData.meterReadings[0].lastReading === 0
              ? "0"
              : meterReadingsData.meterReadings[0].lastReading;
        }
        /*
        if (payload.WaterConnection[0].property.usageCategory !== null && payload.WaterConnection[0].property.usageCategory !== undefined) {
          const propertyUsageType = "[?(@.code  == " + JSON.stringify(payload.WaterConnection[0].property.usageCategory) + ")]"
          let propertyUsageTypeParams = { MdmsCriteria: { tenantId: "pb", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "UsageCategoryMajor", filter: `${propertyUsageType}` }] }] } }
          const mdmsPropertyUsageType = await getDescriptionFromMDMS(propertyUsageTypeParams, dispatch)
          payload.WaterConnection[0].property.propertyUsageType = validatePropertyTaxName(mdmsPropertyUsageType);
        }*/

        if (
          payload.WaterConnection[0].additionalDetails.adhocPenaltyComment ===
            "NA" ||
          payload.WaterConnection[0].additionalDetails.adhocPenaltyComment ===
            null ||
          payload.WaterConnection[0].additionalDetails.adhocPenaltyComment ===
            undefined
        ) {
          payload.WaterConnection[0].additionalDetails.adhocPenaltyComment = "";
        }
        if (
          payload.WaterConnection[0].additionalDetails.adhocRebateComment ===
            "NA" ||
          payload.WaterConnection[0].additionalDetails.adhocRebateComment ===
            null ||
          payload.WaterConnection[0].additionalDetails.adhocRebateComment ===
            undefined
        ) {
          payload.WaterConnection[0].additionalDetails.adhocRebateComment = "";
        }
        if (
          payload.WaterConnection[0].additionalDetails.adhocPenaltyReason ===
            "NA" ||
          payload.WaterConnection[0].additionalDetails.adhocPenaltyReason ===
            null ||
          payload.WaterConnection[0].additionalDetails.adhocPenaltyReason ===
            undefined
        ) {
          payload.WaterConnection[0].additionalDetails.adhocPenaltyReason = "";
        }
        if (
          payload.WaterConnection[0].additionalDetails.adhocRebateReason ===
            "NA" ||
          payload.WaterConnection[0].additionalDetails.adhocRebateReason ===
            null ||
          payload.WaterConnection[0].additionalDetails.adhocRebateReason ===
            undefined
        ) {
          payload.WaterConnection[0].additionalDetails.adhocRebateReason = "";
        }

        dispatch(
          prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0])
        );
        dispatch(prepareFinalObject("billData", data.Bill[0]));
        dispatch(
          prepareFinalObject(
            "consumptionDetails[0]",
            meterReadingsData.meterReadings[0]
          )
        );
      }
    }
  }  
 /* createEstimateData(
    data,
    "screenConfiguration.preparedFinalObject.billData.billDetails",
    dispatch,
    {},
    {}
  );*/
};

const fetchMDMSForBillPeriod = async (action, state, dispatch) => {
  const requestBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "ws-services-masters",
          masterDetails: [{ name: "billingPeriod" }],
        },
        {
          moduleName: "sw-services-calculation",
          masterDetails: [{ name: "billingPeriod" }],
        },
      ],
    },
  };
  try {
    let response = await getDescriptionFromMDMS(requestBody, dispatch);
    dispatch(prepareFinalObject("billingPeriodMDMS", response.MdmsRes));
  } catch (error) {
    console.log(error);
  }
};

const beforeInitFn = async (action, state, dispatch, consumerCode) => {
  console.log("consumerCode---" + consumerCode);
  if (consumerCode) {
    await fetchMDMSForBillPeriod(action, state, dispatch);
    await searchResults(action, state, dispatch, consumerCode);
  }
};

const billHeader = () => {
  if (service === serviceConst.WATER) {
    return getCommonHeader({ labelKey: "WS_COMMON_WATER_PENDING_BILL_HEADER" });
  } else if (service === serviceConst.SEWERAGE) {
    return getCommonHeader({ labelKey: "WS_COMMON_WATER_PENDING_BILL_HEADER" });
  }
};

let headerrow = getCommonContainer({
  header: billHeader(),
  consumerCode: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ConsumerNoContainer",
    props: { number: consumerCode },
  },
});

const estimate = getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "WS_VIEWBILL_DETAILS_HEADER" }),
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "viewBillToolipData",
  }),
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "freezeConn",
  beforeInitScreen: (action, state, dispatch) => {
    // pageReset(dispatch);
    console.log("in this paage ---------->>>");
    let consumerCode = getQueryArg(window.location.href, "connectionNumber");
    beforeInitFn(action, state, dispatch, consumerCode);
    set(
      action,
      "components.div.children.getConnectionDetailsFooterAction.children.takeAction.props.connectionNumber",
      consumerCode
    );
    pageReset(dispatch);
    if (
      get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus"
      ) === "PENDING_FOR_CONNECTION_DEACTIVATION" &&
      ifUserRoleExists("WS_CLERK")
    ) {
      console.log("setting plumber details");
      let deactivationDate = get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].deactivationDate"
      );
      console.log(
        "deactivationDate---------------" + convertEpochToDate(deactivationDate)
      );
      let lastMeterReading = get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].additionalDetails.lastMeterReading"
      );
      let plumberLicenceNo = get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].plumberInfo[0].licenseNo"
      );
      let plumberName = get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].plumberInfo[0].name"
      );
      let plumberMobNo = get(
        state,
        "screenConfiguration.preparedFinalObject.WaterConnection[0].plumberInfo[0].mobileNumber"
      );
      dispatch(
        prepareFinalObject(
          "applyScreen.plumberInfo[0].licenseNo",
          plumberLicenceNo
        )
      );
      dispatch(
        prepareFinalObject(
          "applyScreen.plumberInfo[0].mobileNumber",
          plumberMobNo
        )
      );
      dispatch(
        prepareFinalObject("applyScreen.plumberInfo[0].name", plumberName)
      );
      dispatch(
        prepareFinalObject(
          "applyScreen.connectionDeactivationDate",
          deactivationDate
        )
      );
      dispatch(
        prepareFinalObject(
          "applyScreen.additionalDetails.lastMeterReading",
          lastMeterReading
        )
      );
    }
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: { className: "common-div-css search-preview" },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: { gridDefination: { xs: 12, sm: 8 }, ...headerrow },
          },
        },
        estimate,
        additionDetails,
        getConnectionDetailsFooterAction,
      },
    },
  },
};

export default screenConfig;
