import {
  getCommonCard,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getDateField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {setServiceCategory} from "../../utils"
import get from "lodash/get";

const tenantId = getTenantId();
export const newCollectionDetailsCard = getCommonCard(
  {
    searchContainer: getCommonContainer(
      {
        City: {
          ...getSelectField({
            label: {
              labelName: "City",
              labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            },
            localePrefix: {
              moduleName: "TENANT",
              masterName: "TENANTS"
            },
            optionLabel: "name",
            placeholder: {
              labelName: "Select City",
              labelKey: "TL_SELECT_CITY"
            },
            sourceJsonPath: "applyScreenMdmsData.tenant.citiesByModule",
            // "applyScreenMdmsData.common-masters.citiesByModule.UC.tenants",
            jsonPath: "Demands[0].tenantId",
            required: true,
            props: {
              required: true,
              value: tenantId,
              disabled: true
            }
          }),
          beforeFieldChange: async (action, state, dispatch) => {
            const citiesByModule = get(
              state,
              "common.citiesByModule.UC.tenants",
              []
            );
            if (!citiesByModule.find(item => item.code === action.value)) {
              return action;
            }
            console.log("action.value",action.value)
            let requestBody = {
              MdmsCriteria: {
                tenantId: action.value.split(".")[0],
                moduleDetails: [
                  {
                    moduleName: "BillingService",
                    masterDetails: [
                      {
                        name: "BusinessService",
                        filter: "[?(@.type=='Adhoc')]"
                      },
                      {
                        name: "TaxHeadMaster"
                      },
                      {
                        name: "TaxPeriod"
                      },
                      {
                        name:"ServiceGLCODEMapping",
                      }
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
              console.log("payload",payload)
              dispatch(
                prepareFinalObject(
                  "applyScreenMdmsData.BillingService",
                  payload.MdmsRes.BillingService
                )
              );
              setServiceCategory(
                get(payload, "MdmsRes.BillingService.BusinessService", []),
                dispatch
              );
            } catch (e) {
              console.log(e);
            }
            return action;
          }
        },
        // dummyDiv: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Div",
        //   gridDefination: {
        //     xs: 12,
        //     sm: 6
        //   },
        //   visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
        //   props: {
        //     disabled: true
        //   }
        // },
        ConsumerMobileNo: getTextField({
          label: {
            labelName: "Mobile No",
            labelKey: "UC_MOBILE_NO_LABEL"
          },
          placeholder: {
            labelName: "Enter Mobile No",
            labelKey: "UC_MOBILE_NO_PLACEHOLDER"
          },
          iconObj: {
            label: "+91 |",
            position: "start"
          },
          required: true,
          visible: true,
          pattern: getPattern("MobileNo"),
          errorMessage: "Invalid Mobile No.",
          jsonPath: "Demands[0].mobileNumber"
        }),
        ConsumerName: getTextField({
          label: {
            labelName: "Consumer Name",
            labelKey: "UC_CONS_NAME_LABEL"
          },
          placeholder: {
            labelName: "Enter Consumer Name",
            labelKey: "UC _CONS_NAME_LABEL_PLACEHOLDER"
          },

          required: true,
          visible: true,
          pattern: getPattern("Name"),
          errorMessage: "Invalid Name.",
          jsonPath: "Demands[0].consumerName"
        }),
        ConsumerAddress: getTextField({
          gridDefination: {
            xs: 12,
            sm: 6
          },
          label: {
            labelName: "Consumer Address",
            labelKey: "UC_ADDRESS_LABEL"
          },
          placeholder: {
            labelName: "Enter Consumer Address",
            labelKey: "UC_ADDRESS_PLACEHOLDER"
          },

          required: true,
          visible: true,
          pattern: getPattern("Address"),
         // errorMessage: "Invalid Name.",
          jsonPath: "Demands[0].consumerAddress",
          jsonPath: "Demands[0].additionalDetails.consumerAddress"
        }),
        serviceCategory: {
          uiFramework: "custom-containers",
          componentPath: "AutosuggestContainer",
          jsonPath: "Demands[0].businessService",
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: true,
          props: {
            style: {
              width: "100%",
              cursor: "pointer"
            },
            label: {
              labelName: "Service Category",
              labelKey: "UC_SERVICE_CATEGORY_LABEL"
            },
            placeholder: {
              labelName: "Select service Category",
              labelKey: "UC_SERVICE_CATEGORY_PLACEHOLDER"
            },
            localePrefix: {
              masterName: "BusinessService",
              moduleName: "BillingService"
            },
           
            visible: true,
            jsonPath: "Demands[0].businessService",
            sourceJsonPath: "applyScreenMdmsData.serviceCategories",
            labelsFromLocalisation: true,
            suggestions: [],
            fullwidth: true,
            inputLabelProps: {
              shrink: true
            }
          },
          beforeFieldChange: async (action, state, dispatch) => {
            //Reset service type value, if any

            console.info("before field change",action,"Action.value==",action.value,"serv type==",state.screenConfiguration.preparedFinalObject.Demands[0].serviceType);
            if(state.screenConfiguration.preparedFinalObject.Demands[0].serviceType){
              console.info("inside if");
            dispatch(
              handleField(
                "newCollection",
                "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
                 "props.value",
                  []
              )
            );
              }
            //Set service type data and field if available.
            const serviceData = get(
              state.screenConfiguration,
              "preparedFinalObject.applyScreenMdmsData.nestedServiceData",
              {}
            );
            if (action.value) {  
              console.info("Action value==",action.value) 
             
              if (
                serviceData[action.value] &&
                serviceData[action.value].child &&
                serviceData[action.value].child.length > 0
              ) {
                console.info("some condns", serviceData[action.value], serviceData[action.value].child)                     
                
                dispatch(
                  prepareFinalObject(
                    "applyScreenMdmsData.serviceTypes",
                    serviceData[action.value].child
                  )
                );
                dispatch(
                  handleField(
                    "newCollection",
                    "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
                    "visible",
                    true
                  )
                );
              } else {
                console.info("else condition :(")
                dispatch(
                  handleField(
                    "newCollection",
                    "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.serviceType",
                    "visible",
                    false
                  )
                );
                const demandId = get(
                  state.screenConfiguration.preparedFinalObject,
                  "Demands[0].id",
                  null
                );
                //Set tax head fields if there is no service type available
                if (!demandId && serviceData[action.value]) {
                  const taxHeads = setTaxHeadFields(action, state, dispatch);
                }
              }
            }
          }
        },

        serviceType: {
          uiFramework: "custom-containers",        
          componentPath: "AutosuggestContainer",
          jsonPath: "Demands[0].serviceType",
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: true,
          props: {
            style: {
              width: "100%",
              cursor: "pointer"
            },
            label: {
              labelName: "Service Type",
              labelKey: "UC_SERVICE_TYPE_LABEL"
            },
            placeholder: {
              labelName: "Select service Type",
              labelKey: "UC_SERVICE_TYPE_PLACEHOLDER"
            },
            localePrefix: {
              masterName: "BusinessService",
              moduleName: "BillingService"
            },
            
            visible: true,
            jsonPath: "Demands[0].serviceType",
            sourceJsonPath: "applyScreenMdmsData.serviceTypes",
            labelsFromLocalisation: true,
            suggestions: [],
            fullwidth: true,
            inputLabelProps: {
              shrink: true
            }
          },
          beforeFieldChange: async (action, state, dispatch) => {
                const demandId = get(
                    state.screenConfiguration.preparedFinalObject,
                    "Demands[0].id",
                    null
                  );
                  if (!demandId && action.value) {
                    const taxHeads = setTaxHeadFields(action, state, dispatch);
                    console.log(taxHeads);
                    console.info("selected subtype==",action.value);
                    
                  }         
           }
        },



        // serviceType: {
        //   ...getSelectField({
        //     label: {
        //       labelName: "Service Type",
        //       labelKey: "UC_SERVICE_TYPE_LABEL"
        //     },
        //     localePrefix: {
        //       masterName: "BusinessService",
        //       moduleName: "BillingService"
        //     },
        //     placeholder: {
        //       labelName: "Select Service Type",
        //       labelKey: "UC_SERVICE_TYPE_PLACEHOLDER"
        //     },
        //     required: true,
        //     visible: false,
        //     sourceJsonPath: "applyScreenMdmsData.serviceTypes",
        //     jsonPath: "Demands[0].serviceType",
        //     gridDefination: {
        //       xs: 12,
        //       sm: 6
        //     }
        //   }),
        //   beforeFieldChange: async (action, state, dispatch) => {
        //     const demandId = get(
        //       state.screenConfiguration.preparedFinalObject,
        //       "Demands[0].id",
        //       null
        //     );
        //     if (!demandId && action.value) {
        //       const taxHeads = setTaxHeadFields(action, state, dispatch);
        //       console.log(taxHeads);
        //     }
        //   }
        // },
        fromDate: getDateField({
          label: {
            labelName: "From Date",
            labelKey: "UC_FROM_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter from Date",
            labelKey: "UC_SELECT_FROM_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: true,
          pattern: getPattern("Date"),
          jsonPath: "Demands[0].taxPeriodFrom",
          beforeFieldChange: async (action, state, dispatch) => {            
            if (action.value) {              
              dispatch(
                handleField(
                  "newCollection",
                  "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.toDate",
                  "props.disabled",
                   false
                )
              );
              dispatch(
                handleField(
                  "newCollection",
                  "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.toDate",
                  "props.inputProps.min",
                  action.value
                )
              );
            }
           
          }
        }),
        toDate: getDateField({
          label: {
            labelName: "To Date",
            labelKey: "UC_TO_DATE_LABEL"
          },
          placeholder: {
            labelName: "Enter to Date",
            labelKey: "UC_SELECT_TO_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: true,         
          props: {
            disabled: true,            
            // inputProps: {
            //   max: new Date().toISOString().slice(0,10)
            // }           
          },
          pattern: getPattern("Date"),
          jsonPath: "Demands[0].taxPeriodTo",
          
        }),
      
        // dummyDiv: {
        //   uiFramework: "custom-atoms",
        //   componentPath: "Div",
        //   gridDefination: {
        //     xs: 12,
        //     sm: 6
        //   },
        //   visible: true,
        //   props: {
        //     disabled: true
        //   }
        // },
      
        
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    commentsContainer: getCommonContainer({
      comments: getTextField({
        gridDefination: {
          xs: 12,
          sm: 6
        },
        label: {
          labelName: "Comments",
          labelKey: "UC_COMMENT_LABEL"
        },
        placeholder: {
          labelName: "Enter Comment ",
          labelKey: "UC_COMMENT_PLACEHOLDER"
        },
        Required: false,
        jsonPath: "Demands[0].additionalDetails.comment"
      }),
      helpPdfButton:{
        componentPath:"Button",
        jsonPath:"Demands[0].ucCollection.pdf",
           gridDefination: {
          xs: 12,
          sm: 6
        },
        props:{
          //variant: "outlined",
          color:"primary",   
          //Removed hardcoded helpfileurl, cb specific help file url is read from state and set in newCollection.js>beforeInitScreen          
         // href:"https://github.com/belegovgithub/egov-mdms-data/raw/BEL-CB-Impl/data/pb/TLHelp/TradeTypeSubtypeDetails_Secunderabad.pdf",
            style:{
            minWidth:"180px",
            height:"48px",
            marginRight:"45",
            borderRadius: "inherit"
          }
        },
        children:{
          
          downloadButtonIcon:{
            uiFramework:"custom-atoms",
            componentPath:"Icon",
            props:{
              iconName:"cloud_download"
            }
          },
          downloadButtonLabel:getLabel({
            labelName:"Help ?",
            labelKey:"TL_COMMON_HELP"
          }),
        },
                    
       }, 
    
      
      
    }),
    

    


  },
  {
    style: {
      overflow: "visible"
    }
  }
);

const setTaxHeadFields = (action, state, dispatch) => {
  const serviceData = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.nestedServiceData",
    {}
  );
  const taxHeadMasters = get(
    state.screenConfiguration,
    "preparedFinalObject.applyScreenMdmsData.BillingService.TaxHeadMaster",
    {}
  );
  const matchingTaxHeads = taxHeadMasters.filter(
    item => item.service === action.value
  );
  if (matchingTaxHeads && matchingTaxHeads.length > 0) {
    //Delete previous Tax Head fields
    const noOfPreviousTaxHeads = get(
      state.screenConfiguration,
      "preparedFinalObject.Demands[0].demandDetails",
      []
    ).length;
    const taxFields = get(
      state.screenConfiguration,
      "screenConfig.newCollection.components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
      {}
    );
    const taxFieldKeys = Object.keys(taxFields).filter(item =>
      item.startsWith("taxheadField_")
    );
    if (noOfPreviousTaxHeads > 0) {
      for (let i = 0; i < taxFieldKeys.length; i++) {
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
            `${taxFieldKeys[i]}.props.value`,
            ""
          )
        );
        dispatch(
          handleField(
            "newCollection",
            "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
            `${taxFieldKeys[i]}.visible`,
            false
          )
        );
      }
      dispatch(prepareFinalObject(`Demands[0].demandDetails`, []));
    }
    //Show new tax head fields
    matchingTaxHeads.forEach((item, index) => {
      dispatch(
        prepareFinalObject(
          `Demands[0].demandDetails[${index}].taxHeadMasterCode`,
          item.code
        )
      );
      dispatch(
        prepareFinalObject(
          `Demands[0].demandDetails[${index}].collectionAmount`,
          0
        )
      );
      dispatch(
        handleField(
          "newCollection",
          "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
          `taxheadField_${item.code.split(".").join("_")}`,
          getTextField({
            label: {
              labelName: "Tax Amount",
              labelKey: `${getTransformedLocale(item.code)}`
            },
            placeholder: {
              labelName: "Enter Tax Amount",
              labelKey: "UC_AMOUNT_TO_BE_COLLECTED_PLACEHOLDER"
            },
            componentJsonpath: `components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.taxheadField_${item.code
              .split(".")
              .join("_")}`,
            required: item.isRequired || false,
            pattern: getPattern("Amount"),
            errorMessage: "Invalid Amount",
            visible: true,
            // required: true,
            props: {
              // required: true
            },
            jsonPath: `Demands[0].demandDetails[${index}].taxAmount`
          })
        )
      );
    });
    // dispatch(
    //   handleField(
    //     "newCollection",
    //     "components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children",
    //     `comment`,
    //     getTextField({
    //       label: {
    //         labelName: "Comments",
    //         labelKey: "UC_COMMENT_LABEL"
    //       },
    //       placeholder: {
    //         labelName: "Enter Comment ",
    //         labelKey: "UC_COMMENT_PLACEHOLDER"
    //       },
    //       Required: false,
    //       jsonPath: "Demands[0].comment",
    //       componentJsonpath: `components.div.children.newCollectionDetailsCard.children.cardContent.children.searchContainer.children.comment`
    //     })
    //   )
    // );
  }
};

// const setServiceCategory = (businessServiceData, dispatch) => {
//   let nestedServiceData = {};
//   businessServiceData.forEach(item => {
//     if (item.code && item.code.indexOf(".") > 0) {
//       if (nestedServiceData[item.code.split(".")[0]]) {
//         let child = get(
//           nestedServiceData,
//           `${item.code.split(".")[0]}.child`,
//           []
//         );
//         child.push(item);
//         set(nestedServiceData, `${item.code.split(".")[0]}.child`, child);
//       } else {
//         set(
//           nestedServiceData,
//           `${item.code.split(".")[0]}.code`,
//           item.code.split(".")[0]
//         );
//         set(nestedServiceData, `${item.code.split(".")[0]}.child[0]`, item);
//       }
//     } else {
//       set(nestedServiceData, `${item.code}`, item);
//     }
//   });
//   dispatch(
//     prepareFinalObject(
//       "applyScreenMdmsData.nestedServiceData",
//       nestedServiceData
//     )
//   );
//   let serviceCategories = Object.values(nestedServiceData).filter(
//     item => item.code
//   );
//   dispatch(
//     prepareFinalObject(
//       "applyScreenMdmsData.serviceCategories",
//       serviceCategories
//     )
//   );
// };
