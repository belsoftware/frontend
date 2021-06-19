
import { prepareFinalObject} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonHeader,getDivider,getCommonCaption,getCommonContainer, getCommonSubHeader,getCommonGrayCard,getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {getReceiptData,getTransactionDetails} from "../utils";

import get from "lodash/get";
const header = getCommonHeader({
  labelName: "View Receipt Details",
  labelKey: "PT_RECEIPT"
});
export const checkValueForNA = value => {
  return value == null || value == undefined || value == '' ? "NA" : value;
};

const viewReceipt = {
  uiFramework: "material-ui",
  name: "viewReceipt",
  beforeInitScreen:(action, state, dispatch) => {

    let tenantId = getQueryArg(window.location.href, "tenantId");
    let receiptNo = getQueryArg(window.location.href, "receiptNo");

    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "receiptNumbers",
        value: receiptNo
      }
    ];

     getReceiptData(queryObject).then((response)=>{
      console.log("transs"+ JSON.stringify(response))
        if (response && response.Payments && response.Payments.length > 0) {
        const receiptDetails = dispatch(prepareFinalObject("receiptData", response.Payments[0]));
        }
       let queryObject1 = [
         {
           key: "consumerCode",
           value: response.Payments[0].paymentDetails[0].bill.consumerCode
         },
         {
           key: "transactionId",
           value: response.Payments[0].transactionNumber
         }
       ];

       getTransactionDetails(queryObject1).then((response1) => {
        
         if (response1 && response1.Transaction && response1.Transaction.length > 0) {
           let TransactDetails = [];

           dispatch(prepareFinalObject("TransactionData", response1.Transaction, []));
           const TransactionData = get(state.screenConfiguration.preparedFinalObject, "TransactionData", "")
           TransactionData.map(trans => {
             if (trans.txnId == response.Payments[0].transactionNumber) {
               TransactDetails.push({
                 bankTransactionNo: trans.bankTransactionNo
               })
             }
           })
           dispatch(prepareFinalObject("TransactionTemp", TransactDetails));
         };

         
       });
     });
     
    return action;

  },

  components:{
    mainDiv: getCommonCard({
        caption2: getCommonCaption({
          labelName: "NOTE",
          labelKey: "Note : The information provided in this page is for verifying the authenticity of the receipt downloaded. "+
            "The information provided below is as per the records maintained in eChhawani. You have to validate the information against the information present in your copy."
        }),
        divider1: getDivider(),
        header: getCommonSubHeader(
          {
            labelName: "Receipt",
            labelKey: "Receipt Details"
          },
          {
            style: {
              marginBottom: 18
            }
          }
        ),
        ReceicptInfo: getCommonGrayCard({
        div1: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
         
          children: {
            header: {
              gridDefination: {
                  xs: 12,
                  sm: 10
              },
              ...getCommonSubHeader({
                  labelName: "Payment Information",
                  labelKey: "Payment Information"
              },
              {
                style: {
                  marginBottom: 18
                }
              })
              

          },
          ReceicptDetails:getCommonContainer({
            payerName:getLabelWithValue(
              {
                labelName: "Payer Name",
                labelKey: "Payer Name"
            },
            {
                jsonPath: "receiptData.payerName"
            }

            ),
            totalAmountPaid: getLabelWithValue(
              {
                labelName: "Total Amount Paid",
                labelKey: "Total Amount Paid"
            },
            {
                jsonPath: "receiptData.totalAmountPaid"
            }

            ),
            PropertyId: getLabelWithValue(
              {
                labelName: "Property Id",
                labelKey: "Property Id"
            },
            {
                jsonPath: "receiptData.paymentDetails[0].bill.consumerCode"
            }
            ),

          }),
          onlinePaymentInfo:getCommonContainer({
            payment:getLabelWithValue(
              {
                labelName: "Payment Mode",
                labelKey: "Payment Mode"
            },
            {
                jsonPath: "receiptData.paymentMode"
            }
            ),
            transaction:getLabelWithValue(
              {
                labelName: "Transaction No",
                labelKey: "Transaction No"
            },
            {
                jsonPath: "receiptData.transactionNumber"
            }
            ),
            banktxnNp:getLabelWithValue(
              {
                labelName: "Bank Transaction No",
                labelKey: "Bank Transaction No"
            },
            {
                jsonPath: "TransactionTemp[0].bankTransactionNo",
                callBack: checkValueForNA
            }
            ),
          })
          }
        },
      }),
      
      })
    }
  }


export default viewReceipt;
