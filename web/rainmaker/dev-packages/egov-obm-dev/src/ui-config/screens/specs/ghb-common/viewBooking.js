import {getCommonCardWithHeader,getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject,  handleScreenConfigurationFieldChange as handleField} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getLabelWithValue, getCommonCard, getCommonContainer, getCommonHeader,getCommonGrayCard,getDivider,getCommonCaption, getCommonSubHeader,getCommonParagraph, getCommonTitle, getStepperObject, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {loadBookingDetails, loadGuestHouseDetailsMdms } from "../utils";
import { getQueryArg, setBusinessServiceDataToLocalStorage, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { setDocumentsInfo, convertEpochToDate, loadWorkflowMasterData} from "../utils";

const header = getCommonHeader({
  labelName: "Search Certificate",
  labelKey: "BND_BIRTH_SEARCH_DOWNLOAD"
});

const applicationNumber = getQueryArg(window.location.href, "applicationNumber");

const viewGuestHouse = {
  uiFramework: "material-ui",
  name: "viewGuestHouse",
  beforeInitScreen:(action, state, dispatch) => {

    loadBookingDetails(action, state, dispatch).then((response)=>{

      //tobechanged - NewWS1 to OBM_HALLBOOKING_V1
      response = {"booking":[{"status":"APPLIED","hallId":"HALL1","specialCategory":"CANTT_STAFF","fromDate":"1622902988000","toDate":"1622989388000","tenantId":"pb.agra","workflowCode":"LAMS_NewLR_CEO_V3","action":"APPLY","residentType":"canttResident","category":"Office Staff","purpose":"Marriage","userDetails":[{"id":2034,"userName":"9480734475","salutation":null,"name":"विवेक बिष्ट","gender":"MALE","mobileNumber":"9480734475","emailId":"test@test.com","altContactNumber":"4567891045","pan":"bchfb7634l","aadhaarNumber":null,"permanentAddress":"asdf,,streetname,asdf,city","permanentCity":"pb.agra","permanentPinCode":"512465","correspondenceAddress":null,"correspondenceCity":null,"correspondencePinCode":null,"active":true,"locale":null,"type":"CITIZEN","accountLocked":false,"accountLockedDate":0,"fatherOrHusbandName":"Jayas kk","signature":null,"bloodGroup":null,"photo":null,"identificationMark":null,"createdBy":2032,"lastModifiedBy":1,"tenantId":"pb","roles":[{"code":"CITIZEN","name":"Citizen","tenantId":"pb"}],"uuid":"cfd640e6-b19e-4429-a710-86fa41e51cf9","createdDate":1597937400000,"lastModifiedDate":1625332380000,"dob":"1990-01-01","pwdExpiryDate":1607554800000}],"bankDetails":{"accountNumber":"123412341234","repeatAccountNumber":"12341234123412","ifscCode":"SBIN0191911","nameOfBank":"asdfasdfasd","accountHolderName":"fasdfasdfa"},"wfDocuments":[{"documentType":"APPLICANT","documentCode":"APPLICANT.IDENTITYPROOF","isDocumentRequired":true,"isDocumentTypeRequired":true,"dropdown":{"value":"APPLICANT.IDENTITYPROOF.AADHAAR"},"fileName":"s.jpg","fileStoreId":"f2684e01-d949-487d-b50b-546091f74743","fileUrl":"https://13.71.65.215.nip.io/filestore/v1/files/id?fileStoreId=f2684e01-d949-487d-b50b-546091f74743&tenantId=pb"},{"documentType":"APPLICANT","documentCode":"APPLICANT.ADDRESSPROOF","isDocumentRequired":true,"isDocumentTypeRequired":true,"dropdown":{"value":"APPLICANT.ADDRESSPROOF.ELECTRICITYBILL"},"fileName":"s.jpg","fileStoreId":"733e996b-2899-440e-9897-865286e43e25","fileUrl":"https://13.71.65.215.nip.io/filestore/v1/files/id?fileStoreId=733e996b-2899-440e-9897-865286e43e25&tenantId=pb"}]}]};
      if(response && response.booking && response.booking.length > 0)
      {
        dispatch(prepareFinalObject("ghb.booking", response.booking));
        dispatch(prepareFinalObject("ghb.booking[0].fromToDateString", 
          convertEpochToDate(response.booking[0].fromDate + " to "+convertEpochToDate(response.booking[0].toDate))));

        let tenantId = getQueryArg(window.location.href, "tenantId");
        let guestHouseId = getQueryArg(window.location.href, response.booking[0].hallId);

        let data = {tenantId:tenantId, guestHouseId:guestHouseId};
        //Load Guest House Mdms
        loadGuestHouseDetailsMdms(action, state, dispatch, data).then((response) => {

          if (response && response.MdmsRes && response.MdmsRes.CommunityHallBooking 
            && response.MdmsRes.CommunityHallBooking.CommunityHalls && response.MdmsRes.CommunityHallBooking.CommunityHalls.length >0 ) {
            let guestHouseMdms = response.MdmsRes.CommunityHallBooking.CommunityHalls[0];
            dispatch(prepareFinalObject("ghb.viewGuestHouseDetailsMdms", guestHouseMdms));
          }
        });
      }
      
      //toberemove
      if(!response.booking || response.booking.length == 0)
      {
        alert("There was some error in getting the booking data.");
      }
 
      setDocumentsInfo(state, dispatch);

      loadWorkflowMasterData(action, state, dispatch);
    });

    
    return action;

  },

  components:{
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
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
              ...getCommonContainer({

              })
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              }
            }
          }
        },
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-obm",
          componentPath: "ApplicationNo",
          props: {
            number: applicationNumber,
            label:{
              labelKey:"OBM_APPL_NUMBER",
              labelValue:"Appl No: "
            } 
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-obm",//"egov-workflow",//"egov-lams",
          // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath:"ghb.booking",
            moduleName:  "", //"LAMS_NewLR_CEO_V3",//get(state, "screenConfiguration.preparedFinalObject.lamsStore.Lease[0].workflowCode"),//"LAMS_NewLR_V2",  //tobechanged
            //Dont send moduleName here. Pick this up from the state inside WorkflowContainer 
            //For this to work, the application data should be loaded and data should be ready.(Done in beforeInitScreen)
            updateUrl: "/egov-obm/hallBooking/_update"
          }
        },
        bookingDetails: getCommonCard({
          subHeader: getCommonTitle({
            labelName: "Booking Details",
            labelKey: "OBM_BOOKING_DETAILS"
          }),
          hallAndTime: getCommonContainer(
            {
              nameOfHall: getLabelWithValue(
                {
                  labelName: "Name of the Hall",
                  labelKey: "OBM_HALL_NAME"
                },
                {
                  jsonPath: "ghb.viewGuestHouseDetails.name",
                }
              ),
              bookedTime: getLabelWithValue(
                {
                  labelName: "Booking Dates",
                  labelKey: "OBM_BOOKING_DATES"
                },
                {
                  jsonPath: "ghb.booking[0].fromToDateString",
                }
              )
            }),
          bookingDetails: getCommonGrayCard({
            // header: getCommonSubHeader(
            //   {
            //     labelName: "Booking Details",
            //     labelKey: "OBM_BOOKING_DETAILS"
            //   },
            //   {
            //     style: {
            //       marginBottom: 18
            //     }
            //   }
            // ),
            applicantDetailsCardContainer: getCommonContainer({
              residentType: getLabelWithValue(
                {
                  labelName: "Resident or Non Resident",
                  labelKey: "OBM_RESIDENT_TYPE"
                },
                {
                  jsonPath: "ghb.booking[0].isCanttResident",
                  localePrefix: {
                    moduleName: "OBM",
                    masterName: "CHB"
                  },
                  callBack: function(data){
                    return data? "CANTTRESIDENT": "NONCANTTRESIDENT";
                  }
                }
              ),
              category: getLabelWithValue(
                {
                  labelName: "Spl Category",
                  labelKey: "OBM_SPECIAL_CATEGORY"
                },
                {
                  jsonPath: "ghb.booking[0].specialCategory",
                  localePrefix: {
                    moduleName: "OBM",
                    masterName: "CATEGORY"
                  }
                }
              ) ,
              purpose: getLabelWithValue(
                {
                  labelName: "Purpose",
                  labelKey: "OBM_PURPOSE"
                },
                {
                  jsonPath: "ghb.booking[0].purpose",
                }
              ),
            })
          }),
          applicantInfo:{
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
            },
            children: {
              details: getCommonGrayCard({
                header: getCommonSubHeader(
                  {
                    labelName: "Applicant Information",
                    labelKey: "OBM_APPLICANT_BASIC_DETAILS"
                  },
                  {
                    style: {
                      marginBottom: 18
                    }
                  }
                ),
                applicantDetailsCardContainer: getCommonContainer({
                  getApplicantMobNoField: getLabelWithValue(
                    {
                      labelName: "Spl Category",
                      labelKey: "OBM_APPLICANT_MOB_NO"
                    },
                    {
                      jsonPath: "ghb.booking[0].userDetails[0].mobileNumber",
                    }
                  ),
                  applicantName: getLabelWithValue(
                    {
                      labelName: "Applicant Name",
                      labelKey: "OBM_APPLICANT_NAME_LABEL"
                    },
                    {
                      jsonPath: "ghb.booking[0].userDetails[0].name",
                    }
                  )
                })
              }),
            },
          },
          bankDetails: getCommonGrayCard({
            header: getCommonSubHeader(
              {
                labelName: "Bank Details for Refund",
                labelKey: "OBM_BANK_DETAILS"
              },
              {
                style: {
                  marginBottom: 18
                }
              }
            ),
            bankDetailsCardContainer: getCommonContainer({
              accountNo: getLabelWithValue(
                {
                  labelName: "Account Number",
                  labelKey: "OBM_ACCOUNT_NO"
                },
                {
                  jsonPath: "ghb.booking[0].bankDetails.accountNumber",
                }
              ),
              ifscCode: getLabelWithValue(
                {
                  labelName: "Ifsc Code",
                  labelKey: "OBM_IFSC_CODE"
                },
                {
                  jsonPath: "ghb.booking[0].bankDetails.ifscCode",
                }
              ),
              nameOfTheBank: getLabelWithValue(
                {
                  labelName: "Bank Name",
                  labelKey: "OBM_BANK_NAME"
                },
                {
                  jsonPath: "ghb.booking[0].bankDetails.nameOfBank",
                }
              ),
              accountHolderName: getLabelWithValue(
                {
                  labelName: "Account Holder",
                  labelKey: "OBM_ACCOUNT_HOLDER_NMAE"
                },
                {
                  jsonPath: "ghb.booking[0].bankDetails.accountHolderName",
                }
              ),
            })
          }),
          documents: getCommonGrayCard({
            header: getCommonSubHeader(
              {
                labelName: "Documents",
                labelKey: "OBM_DOCUMENTS"
              },
              {
                style: {
                  marginBottom: 18
                }
              }
            ),
            documentCardContainer: getCommonContainer({
              documents: {
                uiFramework: "custom-containers-local",
                moduleName: "egov-obm",
                componentPath: "DownloadFileContainer",
                props: {
                  sourceJsonPath: "BookingDocumentsData",
                  className: "review-documents"
                }
              },
            })
          })
        })
      }
    }
  }
}

export default viewGuestHouse;
