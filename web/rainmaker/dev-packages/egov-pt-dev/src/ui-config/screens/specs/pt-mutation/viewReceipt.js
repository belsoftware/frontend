
import { prepareFinalObject} 
  from "egov-ui-framework/ui-redux/screen-configuration/actions";   //returns action object
import { getCommonCard, getCommonHeader,getDivider,getCommonCaption, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {getReceiptData} from "../utils";


const header = getCommonHeader({
  labelName: "View Receipt Details",
  labelKey: "PT_RECEIPT"
});

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
        if (response && response.Payments && response.Payments.length > 0) {
          dispatch(prepareFinalObject("receiptData", response.Payments[0]));
        }
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

      })
    }
  }


export default viewReceipt;
