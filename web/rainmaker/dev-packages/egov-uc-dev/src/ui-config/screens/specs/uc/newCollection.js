import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { newCollectionDetailsCard } from "./newCollectionResource/newCollectionDetails";
import { newCollectionFooter } from "./newCollectionResource/newCollectionFooter";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { setServiceCategory } from "../utils";
import commonConfig from "config/common.js";
import get from "lodash/get";
import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {newCollectionConsumerDetailsCard} from './newCollectionResource/neCollectionConsumerDetails'
import{newCollectionServiceDetailsCard} from './newCollectionResource/newCollectionServiceDetails';
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const header = getCommonHeader({
  labelName: "New Collection",
  labelKey: "UC_COMMON_HEADER"
});
const tenantId = getTenantId();

const getData = async (action, state, dispatch, demandId) => {

  console.info("Demand id=",action.value);

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

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      requestBody
    );
    
    if(payload){
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
      const citymodule = get(payload , "MdmsRes.tenant.citymodule"); 
      const liveTenants =  citymodule && citymodule.filter(item => item.code === "UC" );
      dispatch(
        prepareFinalObject("applyScreenMdmsData.tenant.citiesByModule", get(liveTenants[0], "tenants"))
      );
    }
    const serviceCategories = get(
      state.screenConfiguration,
      "preparedFinalObject.searchScreenMdmsData.serviceCategory",
      []
    );
    if (serviceCategories && serviceCategories.length) {
      setServiceCategory(
        serviceCategories,
        dispatch
      );
    }


    const presentTenantId = getQueryArg(window.location.href, "tenantId")?getQueryArg(window.location.href, "tenantId"):getTenantId();
    
      let helpUrl = get(
        payload,
        "MdmsRes.common-masters.Help",
        []
        ).filter(item =>item.code ==="UC");   
    
    dispatch(prepareFinalObject("helpFileUrl", helpUrl[0].URL));

    //Get Mohalla data
        
     try {
      let payload = await httpRequest(
        "post",
        "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
        "_search",
        [{ key: "tenantId", value: `${tenantId}`, }],
        {}
      );
      const mohallaData =
        payload &&
        payload.TenantBoundary[0] &&
        payload.TenantBoundary[0].boundary &&
        payload.TenantBoundary[0].boundary.reduce((result, item) => {
          result.push({
            ...item,
            name: `${tenantId
              .toUpperCase()
              .replace(
                /[.]/g,
                "_"
              )}_REVENUE_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`
          });
          return result;
        }, []);
      dispatch(
        prepareFinalObject(
          "applyScreenMdmsData.tenant.localities",
          mohallaData
        )
      );
      
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.ConsumerLocMohalla",
          "props.suggestions",
          mohallaData
          // payload.TenantBoundary && payload.TenantBoundary[0].boundary
        )
      );
      const mohallaLocalePrefix = {
        moduleName: `${tenantId}`,
        masterName: "REVENUE"
      };
     
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionConsumerDetailsCard.children.cardContent.children.ucConsumerContainer.children.ConsumerLocMohalla",
          "props.localePrefix",
          mohallaLocalePrefix
        )
      );
    } catch (e) {
      console.log(e);
    }
    //End of Mohalla data



  } catch (e) {
    console.log(e);
  }
  if (!demandId) {
    try {
      let payload = null;
      payload = await httpRequest("post", "/egov-idgen/id/_generate", "", [], {
        idRequests: [
          {
            idName: "",
            format: "UC/[CY:dd-MM-yyyy]/[seq_uc_demand_consumer_code]",
            tenantId: `${tenantId}`
          }
        ]
      });
      dispatch(
        prepareFinalObject(
          "Demands[0].consumerCode",
          get(payload, "idResponses[0].id", "")
        )
      );
    } catch (e) {
      console.log(e);
    }
  }

  
  // return action;
};


const newCollection = {
  uiFramework: "material-ui",
  name: "newCollection",
  beforeInitScreen: (action, state, dispatch) => {
    try{
      console.info("gerfer")
    }
    catch(e){
      console.log(e)
    }
    const demandId = get(
      state.screenConfiguration.preparedFinalObject,
      "Demands[0].id",
      null
    );
    const screenConfigForUpdate = get(
      state.screenConfiguration,
      "screenConfig.newCollection"
    );
    console.info("demandId===",demandId);
    if (demandId) {
     
      set(
        screenConfigForUpdate,
        "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceCategory.props.disabled",
        true
      );
      set(
        screenConfigForUpdate,
        "components.div.children.newCollectionServiceDetailsCard.children.cardContent.children.searchContainer.children.serviceType.props.disabled",
        true
      );
      action.screenConfig = screenConfigForUpdate;
    }
    
    !demandId && getData(action, state, dispatch, demandId);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "newCollection"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        newCollectionConsumerDetailsCard,
        newCollectionServiceDetailsCard,       
        newCollectionFooter
      }
    }
  }
};

export default newCollection;
