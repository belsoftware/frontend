import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getFileUrl, getQueryArg,getTransformedLocalStorgaeLabels ,getLocaleLabels} from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, toggleSpinner , toggleSnackbar} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getCommonCard,
  getCommonCaption
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../ui-utils";
import commonConfig from "config/common.js";
import {prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import store from "ui-redux/store";
import { openPdf, printPdf } from "egov-ui-kit/utils/commons";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import { localStorageSet } from "egov-ui-kit/utils/localStorageUtils";

export const downloadPdf = (link, openIn = '_blank') => {
  var win = window.open(link, '_self');
  if (win) {
    win.focus();
  }
  else
  {
    toggleSnackbar(
      true,
      {
        labelName: "",
        labelKey: "Looks like your browser is blocking pop-ups. Allow pop-ups in your browser to download certificate."
      },
      "error"
    );
  }
}

export const downloadReceiptFromFilestoreID = (fileStoreId, mode, tenantId) => {
  getFileUrlFromAPI(fileStoreId, tenantId).then(async (fileRes) => {
    if (mode === 'download') {
      downloadPdf(fileRes[fileStoreId]);
    } else if (mode === 'open') {
      openPdf(fileRes[fileStoreId], '_self')
    }
    else {
      printPdf(fileRes[fileStoreId]);
    }
  });
}

export const convertEpochToDateCustom = dateEpoch => {
  // Returning null in else case because new Date(null) returns initial date from calender
  if(dateEpoch){
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${year}-${month}-${day}`;
  } else {
    return null;
  }
};

export const validateTimeZone = () =>{
  try{
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(tz != "Asia/Calcutta" && tz != "Asia/Kolkata")    
    {
      alert("Looks like your system's time zone is not correct! \nChange your system's time zone to Indian Standard Time (UTC+5:30 Chennai,Kolkata,Mumbai,NewDelhi)\nand try again.")
      return false;
    }
  }
  catch(e)
  {
    alert("Looks like this browser is very old. Please update your browser and continue");
    return false;
  }
  return true;
}

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const transformById = (payload, id) => {
  return (
    payload &&
    payload.reduce((result, item) => {
      result[item[id]] = {
        ...item
      };

      return result;
    }, {})
  );
};

export const getMdmsData = async (requestBody)=> {
  try {
    const response = await httpRequest(
      "post",
      "egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );
   
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
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
        (fields[variable].props.disableValidation === undefined ||
          !fields[variable].props.disableValidation) && 
        !validate(
          screen,
          {
            ...fields[variable],
            value: get(
              state.screenConfiguration.preparedFinalObject,
              fields[variable].jsonPath
            )
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

export const convertDateToEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

export const getEpochForDate = date => {
  const dateSplit = date.split("/");
  return new Date(dateSplit[2], dateSplit[1] - 1, dateSplit[0]).getTime();
};

export const sortByEpoch = (data, order) => {
  if (order) {
    return data.sort((a, b) => {
      return a[a.length - 1] - b[b.length - 1];
    });
  } else {
    return data.sort((a, b) => {
      return b[b.length - 1] - a[a.length - 1];
    });
  }
};

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

export const convertEpochToDate = dateEpoch => {
  const dateFromApi = new Date(dateEpoch);
  console.log("Check the data epoch",dateFromApi);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${day}/${month}/${year}`;
};

export const getCurrentFinancialYear = () => {
  var today = new Date();
  var curMonth = today.getMonth();
  var fiscalYr = "";
  if (curMonth > 3) {
    var nextYr1 = (today.getFullYear() + 1).toString();
    fiscalYr = today.getFullYear().toString() + "-" + nextYr1;
  } else {
    var nextYr2 = today.getFullYear().toString();
    fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2;
  }
  return fiscalYr;
};

export const getFinancialYearDates = (format, et) => {
  /** Return the starting date and ending date (1st April to 31st March)
   *  of the financial year of the given date in ET. If no ET given then
   *  return the dates for the current financial year */
  var date = !et ? new Date() : new Date(et);
  var curMonth = date.getMonth();
  var financialDates = { startDate: "NA", endDate: "NA" };
  if (curMonth > 3) {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${date.getFullYear().toString()}`;
        financialDates.endDate = `31/03/${(date.getFullYear() + 1).toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${date.getFullYear().toString()}-04-01`;
        financialDates.endDate = `${(date.getFullYear() + 1).toString()}-03-31`;
        break;
    }
  } else {
    switch (format) {
      case "dd/mm/yyyy":
        financialDates.startDate = `01/04/${(
          date.getFullYear() - 1
        ).toString()}`;
        financialDates.endDate = `31/03/${date.getFullYear().toString()}`;
        break;
      case "yyyy-mm-dd":
        financialDates.startDate = `${(
          date.getFullYear() - 1
        ).toString()}-04-01`;
        financialDates.endDate = `${date.getFullYear().toString()}-03-31`;
        break;
    }
  }
  return financialDates;
};

export const gotoApplyWithStep = (state, dispatch, step) => {
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  const applicationNumberQueryString = applicationNumber
    ? `&applicationNumber=${applicationNumber}`
    : ``;
  const applyUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/abg/apply?step=${step}${applicationNumberQueryString}`
      : `/abg/apply?step=${step}${applicationNumberQueryString}`;
  dispatch(setRoute(applyUrl));
};

export const showHideAdhocPopup = (state, dispatch) => {
  let toggle = get(
    state.screenConfiguration.screenConfig["search"],
    "components.adhocDialog.props.open",
    false
  );
  dispatch(
    handleField("search", "components.adhocDialog", "props.open", !toggle)
  );
};

export const getCommonGrayCard = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      body: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          ch1: getCommonCard(children, {
            style: {
              backgroundColor: "rgb(242, 242, 242)",
              boxShadow: "none",
              borderRadius: 0,
              overflow: "visible"
            }
          })
        },
        gridDefination: {
          xs: 12
        }
      }
    },
    gridDefination: {
      xs: 12
    }
  };
};

export const getLabelOnlyValue = (value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 4
    },
    props: {
      style: {
        marginBottom: "16px"
      },
      ...props
    },
    children: {
      value: getCommonCaption(value)
    }
  };
};

export const checkIfCitizenEditScreen = () =>{
  const purpose = getQueryArg(window.location.href, "purpose");
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  if(applicationNumber && purpose === "CITIZEN-REVIEW")
    return true;
  return false;
}
export const loadHallDetailsMdms = async (action, state, dispatch,data) => {

  let requestBody = {
    "MdmsCriteria": {
      "tenantId": data.tenantId,
      "moduleDetails": [
         {
            "moduleName": "CommunityHallBooking",
            "masterDetails": [
              {
                "name": "CommunityHalls",
              }
            ]
          }
        ]
      }
  }
  
  if(data && data.hallId)
  {
    requestBody.MdmsCriteria.moduleDetails[0].masterDetails[0].filter = `[?(@.hallCode == "${data.hallId}")]`;
  }

  try{
    let payload = null;
    payload = await httpRequest(
      "post",
      `/egov-mdms-service/v1/_search`,
      "_search",
      [],
      requestBody
    );
    return payload;
  }
  catch (e) {
    toggleSnackbar(
      true,
      {
        labelName: "Api Error",
        labelKey: "ERR_API_ERROR"
      },
      "error"
    );
    console.error(e);
    return {"ResponseInfo":null,"MdmsRes":{"CommunityHallBooking":{"CommunityHalls":[{"hallCode":"1","name":"Elaan Convention Center","address":"Palace Grounds, 10th Main, Agra - 589120","geoLocation":"12.972442,77.580643","contactDetails":"9480734478 / 975412545","purposes":[{"purpose":"Marriage"},{"purpose":"Birthday"}],"specialCategories":[{"category":"Office Staff"},{"category":"Elected Member"}],"maxAllowedBookingDays":3,"hallDescription":"AC HALL with Dining Hall. 5000 sqft Area. Can accomodate 250 people.","termsAndCondition":"Allowed only for Office Staff and Elected Members and for family functions only.","cancellationPolicy":"Cancellation before 5 days is allowed"}]}}};
  }
}

export const loadHallDetails = async (action, state, dispatch,data) => {

  let requestBody = {};
  const queryParams = [
    { key: "tenantId", value: data.tenantId},
    { key: "id", value: data.id}    
  ];

  try{
    let payload = null;
    payload = await httpRequest(
      "post",
      `/obm-services/hall/_search`,
      "_search",
      queryParams,
      requestBody
    );
    return payload;
  }
  catch (e) {
    toggleSnackbar(
      true,
      {
        labelName: "Api Error",
        labelKey: "ERR_API_ERROR"
      },
      "error"
    );
    console.error(e);
    //tobechanged
    let DateDetails={"booked":[["1620210665000","1620383465000"],["1620815465000","1620901865000"]],"blocked":[["1621506665000","1621593065000"],["1621765865000","1621938665000"]]};
    return [{"calender":DateDetails,"name":"Residency","tenantId":"pb.agra","address":"Agra","contactDetails":"87412458652","headerImageUrl":"https://picsum.photos/id/1018/1000/600/","portalUrl":"https://picsum.photos/id/1018/1000/600/","hallDescription":"AC HALL with Dining Hall. 5000 sqft Area. Can accomodate 250 people.","id":"GH_1","geoLocation":"12.972442,77.580643","priceText":"Starting at 1200/day","availability":"Available","fullDetails":{"maxAllowedBookingDays":20,"maxAllowedHalls":10},"halls":[{"hallId":"hall1","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}},{"hallId":"hall2","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}}]}];
  }
}

export const loadMdmsData = async (action, state, dispatch) => {

  let requestBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            },
            { name: "citymodule" }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [            
            { name: "Help" }
          ]
        }
      ]
    }
  };

  try{
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );
    console.log("Mdms Data Recieved is ",payload);
    if (payload) {
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      const citymodule = get(payload, "MdmsRes.tenant.citymodule");
      const liveTenants = citymodule && citymodule.filter(item => item.code === "UC");
      dispatch(
        prepareFinalObject("applyScreenMdmsData.tenant.citiesByModule", get(liveTenants[0], "tenants"))
      );
    }
    return payload;
  }
  catch (e) {
    console.log(e);
  }
}

export const searchForHall = async (dispatch,queryParams,queryObject) => {
  try {
    dispatch(toggleSpinner());
    const response = await httpRequest(
      "post",
      "obm-services/hallBooking/_search",
      "_search",
      queryParams,
      {}//{ searchCriteria: queryObject }
    );
    dispatch(toggleSpinner());
    return response;
  } catch (error) {
    dispatch(toggleSpinner());
    console.error(error);
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

export const convertDateTimeToEpoch = dateTimeString => {
  //example input format : "26-07-2018 17:43:21"
  try {
    // const parts = dateTimeString.match(
    //   /(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    // );
    const parts = dateTimeString.match(
      /(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2}):(\d{2})/
    );
    return Date.UTC(+parts[3], parts[2] - 1, +parts[1], +parts[4], +parts[5]);
  } catch (e) {
    return dateTimeString;
  }
};

export const getDetailsOfApplicant = async (state, dispatch, fieldInfo) => {
  console.log("fieldInfo",fieldInfo)
  try {
    const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
    const ownerNo = get(
      state.screenConfiguration.preparedFinalObject,
      `chb.booking[0].userDetails[${cardIndex}].mobileNumber`,
      ""
    );
    if(!ownerNo){
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please enter Mobile Number to search !",
            labelKey: "ERR_OWNER_NOT_ENTERED"
          },
          "error"
        )
      );
      return;
    }
    const owners = get(
      state.screenConfiguration.preparedFinalObject,
      `chb.booking[0].userDetails`,
      []
    );
    //owners from search call before modification.
    const oldOwnersArr = get(
      state.screenConfiguration.preparedFinalObject,
      "LicensesTemp[0].tradeLicenseDetail.owners",
      []
    );
    //Same no search on Same index
    if (ownerNo === owners[cardIndex].userName) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Owner already added !",
            labelKey: "ERR_OWNER_ALREADY_ADDED"
          },
          "error"
        )
      );
      return;
    }

    //Same no search in whole array
    const matchingOwnerIndex = owners.findIndex(
      item => item.userName === ownerNo
    );
    if (matchingOwnerIndex > -1) {
      if (
        !isUndefined(owners[matchingOwnerIndex].userActive) &&
        owners[matchingOwnerIndex].userActive === false
      ) {
        //rearrange
        dispatch(
          prepareFinalObject(
            `lamsStore.Lease[0].userDetails[${matchingOwnerIndex}].userActive`,
            true
          )
        );
        dispatch(
          prepareFinalObject(
            `lamsStore.Lease[0].userDetails[${cardIndex}].userActive`,
            false
          )
        );
        //Delete if current card was not part of oldOwners array - no need to save.
        if (
          oldOwnersArr.findIndex(
            item => owners[cardIndex].userName === item.userName
          ) == -1
        ) {
          owners.splice(cardIndex, 1);
          dispatch(
            prepareFinalObject(`lamsStore.Lease[0].userDetails`, owners)
          );
        }
      } else {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Owner already added !",
              labelKey: "ERR_OWNER_ALREADY_ADDED_1"
            },
            "error"
          )
        );
      }
      return;
    } else {
      //New number search only
      let payload = await httpRequest(
        "post",
        `/user/_search?tenantId=${commonConfig.tenantId}`,
        "_search",
        [],
        {
          tenantId: commonConfig.tenantId,
          userName: `${ownerNo}`
        }
      );
      if (payload && payload.user && payload.user.hasOwnProperty("length")) {
        if (payload.user.length === 0) {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "This mobile number is not registered ! Enter all details and continue.",
                labelKey: "LAMS_ERR_MOBILE_NUMBER_NOT_REGISTERED"
              },
              "info"
            )
          );
        } else {
          const userInfo =
            payload.user &&
            payload.user[0] &&
            JSON.parse(JSON.stringify(payload.user[0]));
          if (userInfo && userInfo.createdDate) {
            userInfo.createdDate = convertDateTimeToEpoch(userInfo.createdDate);
            userInfo.lastModifiedDate = convertDateTimeToEpoch(
              userInfo.lastModifiedDate
            );
            userInfo.pwdExpiryDate = convertDateTimeToEpoch(
              userInfo.pwdExpiryDate
            );
          }
          let currOwnersArr = get(
            state.screenConfiguration.preparedFinalObject,
            "lamsStore.Lease[0].userDetails",
            []
          );

          currOwnersArr[cardIndex] = userInfo;

          dispatch(
            prepareFinalObject(
              `chb.booking[0].userDetails`,
              currOwnersArr
            )
          );
        }
      }
    }
  } catch (e) {
    console.log(e);
    dispatch(toggleSnackbar(true, e.message, "info"));
  }
};

export const loadBookingDetails = async (state, dispatch, data) =>{
  try{
    //dispatch(toggleSpinner());
    let {applicationNumber, tenantId, fromDate, toDate, status, hallId, phoneNo} = data; 
  
    const queryParams = [{ key: "tenantId", value: tenantId }];
    if(applicationNumber)
      queryParams.push({key: "applicationNumber", value: applicationNumber});
    if(fromDate)
      queryParams.push({key: "fromDate", value: fromDate});
    if(toDate)
      queryParams.push({key: "toDate", value: toDate});
    if(status)
      queryParams.push({key: "status", value: status});
    if(hallId)
      queryParams.push({key: "hallId", value: hallId});
    if(phoneNo)
      queryParams.push({key: "phoneNo", value: phoneNo});

    let payload = null;
    payload = await httpRequest(
      "post",
      "egov-obm/hallBooking/_search",
      "_search",
      queryParams,
      {}
    );
    return payload;
  }
  catch(e)
  {
    toggleSnackbar(
      true,
      {
        labelName: "Could not load Booking Details",
        labelKey: "ERR_API_ERROR"
      },
      "error"
    );
  }
  return null;
}

export const loadWorkflowMasterData = async (action, state, dispatch) => {
  try{
    const queryParams = constructQueryParamsBasedOnCurrentWorkflowType(state);
    //console.log("The query params is ", queryParams);
    let payload = null;
    payload = await httpRequest(
      "post",
      "egov-workflow-v2/egov-wf/businessservice/_search",
      "_search",
      queryParams,
      {}
    );
    let businessServiceData = payload;
    
    //below line to be removed
    businessServiceData = {"ResponseInfo":{"apiId":"Mihy","ver":".01","ts":null,"resMsgId":"uief87324","msgId":"20170310130900|en_IN","status":"successful"},"BusinessServices":[{"tenantId":"pb.agra","uuid":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","businessService":"LAMS_NewLR_CEO_V3","business":"LAMS","businessServiceSla":2592000000,"states":[{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"50a1366e-ce14-4163-bb08-fd304b1aa5b6","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":null,"applicationStatus":null,"docUploadRequired":false,"isStartState":true,"isTerminateState":false,"isStateUpdatable":true,"actions":[{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"d6dbd0f0-94b4-4a95-b0f4-9c4810d51792","tenantId":"pb.agra","currentState":"50a1366e-ce14-4163-bb08-fd304b1aa5b6","action":"APPLY","nextState":"5c20de8d-67cc-403f-80f8-28ae470bca27","roles":["CITIZEN","LR_CEMP"]}]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"5c20de8d-67cc-403f-80f8-28ae470bca27","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":true,"actions":[{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"89ce7d14-ecd1-4492-b5c4-048280a2e9bf","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"4f96efac-e3ad-45e2-ab5f-b7964501eda3","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"00ee84f5-187a-4adb-a4d1-7f422bc5e8ba","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"59f2d550-7c9c-4d24-b8e1-febd5863c995","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"ca822b73-3cee-4caf-a0e8-5881cca4f929","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"bf58061c-a828-4105-be47-37a6be5dad16","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]}]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"CITIZEN-REVIEW","applicationStatus":"CITIZEN-REVIEW","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":true,"actions":[{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"d757bb44-db9e-47d0-a0c1-e26659cb1b95","tenantId":"pb.agra","currentState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","action":"APPLY","nextState":"5c20de8d-67cc-403f-80f8-28ae470bca27","roles":["CITIZEN","LR_CEMP"]}]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"4b270402-937c-422a-ae51-bdd5bdf6b310","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"APPROVED","applicationStatus":"APPROVED","docUploadRequired":false,"isStartState":false,"isTerminateState":true,"isStateUpdatable":false,"actions":null},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"REJECTED","applicationStatus":"REJECTED","docUploadRequired":false,"isStartState":false,"isTerminateState":true,"isStateUpdatable":false,"actions":null},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"730c04d2-e152-4bfc-bc01-b8d266f581e5","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"PDDE-EXAMINATION","applicationStatus":"PDDE-EXAMINATION","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":true,"actions":[{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"cde7e2d5-afed-4e71-8ef4-a5b391112db3","tenantId":"pb.agra","currentState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"f0e68fd9-0254-4637-87e5-9b6a289bcc3d","tenantId":"pb.agra","currentState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"d759338a-7622-4954-b51b-8f8580a5df63","tenantId":"pb.agra","currentState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"482e328c-8813-4521-aff7-fb46a809022e","tenantId":"pb.agra","currentState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"87f79a95-5830-40bd-bb19-f6a8373ffebf","tenantId":"pb.agra","currentState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]}]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"bff5f407-5076-460c-9fd2-45161d89b27a","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"DGDE-EXAMINATION","applicationStatus":"DGDE-EXAMINATION","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":true,"actions":[{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"fe16e2b4-569d-4fbe-88c0-ecbabce08196","tenantId":"pb.agra","currentState":"bff5f407-5076-460c-9fd2-45161d89b27a","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"01bab03b-2fe9-42e0-b14d-e5bd6bf8946d","tenantId":"pb.agra","currentState":"bff5f407-5076-460c-9fd2-45161d89b27a","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"ce81f064-b38c-47be-8281-3c964b44a9f7","tenantId":"pb.agra","currentState":"bff5f407-5076-460c-9fd2-45161d89b27a","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"2c81637d-58a6-46cd-9fea-4106ec9fbf41","tenantId":"pb.agra","currentState":"bff5f407-5076-460c-9fd2-45161d89b27a","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"8173a265-b520-4f08-96d0-b54f445a7014","tenantId":"pb.agra","currentState":"bff5f407-5076-460c-9fd2-45161d89b27a","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]}]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"a2a89111-327f-41fd-a817-6cd2125d9ba0","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"MOD-EXAMINATION","applicationStatus":"MOD-EXAMINATION","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":true,"actions":[{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"c66ed12c-d95f-4a6e-83a2-ae858d3167a8","tenantId":"pb.agra","currentState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"5b32bbee-3715-4cd9-8401-dcd3d59c92be","tenantId":"pb.agra","currentState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"16321a56-ce37-4a10-9e57-acd560de59f0","tenantId":"pb.agra","currentState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"e92e4e97-e3f4-473c-a86c-59c6606a496b","tenantId":"pb.agra","currentState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]},{"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165},"uuid":"e1f77a65-0f57-4fbe-943f-d96188aefd1e","tenantId":"pb.agra","currentState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]}]}],"auditDetails":{"createdBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","lastModifiedBy":"16eb93da-53a1-46a6-9bef-5d4dabf111ce","createdTime":1609392239165,"lastModifiedTime":1609392239165}}]};

    localStorageSet("businessServiceData", JSON.stringify(businessServiceData.BusinessServices));
  }
  catch(e)
  {
    toggleSnackbar(
      true,
      {
        labelName: "Could not load Workflow Master Details",
        labelKey: "ERR_API_ERROR"
      },
      "error"
    );
  }
};

//This function can be used on both Employee and Citizen side functionality.
export const constructQueryParamsBasedOnCurrentWorkflowType = (state) => {

  let workflowCode = get(state, "screenConfiguration.preparedFinalObject.chb.booking[0].workflowCode");
  let tenantId = get(state, "screenConfiguration.preparedFinalObject.chb.booking[0].tenantId");

  let queryParams = [
    { key: "tenantId", value: tenantId }
  ];
  queryParams.push({ key: "businessServices", value: workflowCode })

  return queryParams;
}

export const setDocumentsInfo = async (state, dispatch) => {
  let applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "chb.booking[0].wfDocuments",
    []
  );

  let uploadedDocuments = {};
  let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          name:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                getFileUrl(fileUrlPayload[item.fileStoreId])
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`,
          fileStoreId: item.fileStoreId,
          link: fileUrlPayload[item.fileStoreId],
          title: item.documentType,
          tenantId: item.tenantId,
          id: item.id,
          linkText: 'OBM_VIEW'
        }
      ];
    });
  let documentArray = Object.keys(uploadedDocuments).map((k) => uploadedDocuments[k][0]);
  dispatch(
    prepareFinalObject("BookingDocumentsData", documentArray)
  );
};

