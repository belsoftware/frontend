import {
  getCommonHeader, 
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getLabelWithValue,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
   convertEpochToDate,
} from "../utils";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale} from "egov-ui-kit/utils/localStorageUtils";
import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import {
  getFeesEstimateCard
} from "../utils";
import { httpRequest } from "../../../../ui-utils";
import {
  prepareFinalObject,
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import orderBy from "lodash/orderBy";

let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Challan Number:",
    labelKey: "UC_CHALLAN_NUMBER"
  }),
challanNumberContainer:getCommonContainer({
  challanNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-uc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: applicationNumber
    }
  }
})
});
set(
  action.screenConfig,
  "components.div.children.headerDiv.children.header1.children.headertop",
  headerrow
);
}
const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "Demands[0].estimateCardData"
  })
});

const userDetails = getCommonGrayCard({
  headerDiv: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" },
    },
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10,
        },
        ...getCommonSubHeader({
          labelName: "Consumer Details",
          labelKey: "TL_COMMON_OWN_DETAILS",
        }),
      },
    },
  },
  viewTwo: getCommonContainer({
    consumerName: getLabelWithValue(
      {
        labelName: "Consumer Name",
        labelKey: "TL_NEW_OWNER_DETAILS_NAME_LABEL",
      },

      { jsonPath: "Demands[0].additionalDetails.consumerName" }
    ),
    consumerAddress: getLabelWithValue(
      {
        labelName: "Consumer Address",
        labelKey: "TL_NEW_OWNER_DETAILS_ADDR_LABEL",
      },

      { jsonPath: "Demands[0].additionalDetails.consumerAddress" }
    ),
    consumerMobileNo: getLabelWithValue(
      {
        labelName: "Mobile No",
        labelKey: "TL_NEW_OWNER_DETAILS_MOB_NO_LABEL",
      },

      { jsonPath: "Demands[0].additionalDetails.mobileNumber" }
    ),
  }),
});
const headerrow = getCommonContainer({
});
const serviceDetails = getCommonGrayCard({
  headerDiv1: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" },
    },
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10,
        },
        ...getCommonSubHeader({
          labelName: "Service Details",
          labelKey: "UC_COMMON_SERVICE_DETAILS",
        }),
      },
    },
  },
  viewOne: getCommonContainer({
    serviceName: getLabelWithValue(
      {
        labelName: "Service Name",
        labelKey: "UC_SERVICE_NAME_LABEL",
      },

      {
        jsonPath: "Demands[0].businessService",
        localePrefix: {
          moduleName: "BillingService",
          masterName: "BusinessService",
        },
      }
    ),
    categoryName: getLabelWithValue(
      {
        labelName: "Service Category",
        labelKey: "UC_SERVICE_CATEGORY_LABEL",
      },

      {
        jsonPath: "Demands[0].serviceType",
        localePrefix: {
          moduleName: "BillingService",
          masterName: "BusinessService",
        },
      }
    ),
    fromDate: getLabelWithValue(
      {
        labelName: "From Date",
        labelKey: "UC_FROM_DATE_LABEL",
      },

      { jsonPath: "Demands[0].taxPeriodFrom",
      callBack: convertEpochToDate }
    ),
    toDate: getLabelWithValue(
      {
        labelName: "Tp Date",
        labelKey: "UC_TO_DATE_LABEL",
      },

      { jsonPath: "Demands[0].taxPeriodTo",
      callBack: convertEpochToDate }
    ),
  }),
});


const formatTaxHeaders = (billDetail = {}) => {

  let formattedFees = []
  const { billAccountDetails = [] } = billDetail;
const billAccountDetailsSorted=  orderBy(
    billAccountDetails,
    ["amount"],
    ["asce"]);
  formattedFees = billAccountDetailsSorted.map((taxHead) => {
    return {
      info: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode
      },
      name: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode
      },
      value: taxHead.amount
    }
  })
  formattedFees.reverse();
  return formattedFees;
}


const fetchBill = async (action, state, dispatch, consumerCode, tenantId, billBusinessService) => {


  const getBillQueryObj = [
    { key: "tenantId", value: tenantId },
    {
      key: "consumerCode",
      value: consumerCode
    },
    {
      key: "businessService",
      value: billBusinessService
    }
  ];
  const fetchBillResponse = await getBill(getBillQueryObj);
  const payload = fetchBillResponse && fetchBillResponse.Bill && fetchBillResponse.Bill[0];
  const isPAID = payload.totalAmount==0? true:false;
 // let estimateData = payload;

  let estimateData = formatTaxHeaders(payload.billDetails[0])
   
  set(
    estimateData,
    "payStatus",
    isPAID
  );
  dispatch(prepareFinalObject("Demands[0].estimateCardData", estimateData));

}
export const getBill = async queryObject => {
 
  try {
    const response = await httpRequest(
      "post",
      "/billing-service/bill/v2/_fetchbill",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};


const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const businessService = getQueryArg(window.location.href, "businessService");
    dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    //To set the application no. at the  top
    set(
      action.screenConfig,
      "components.div.children.headerDiv.children.header1.children.headertop.children.challanNumberContainer.children.challanNumber",
      applicationNumber
    );
    fetchBill(action ,state, dispatch, applicationNumber, tenantId, businessService);
    beforeInitFn(action, state, dispatch, applicationNumber);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview",
      },

      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
          
             ...headerrow

            },
          },
        },

        preview: getCommonCard({
          estimate,
          serviceDetails,
          userDetails,
        }),
      },
    },
  },
};

export default screenConfig;
