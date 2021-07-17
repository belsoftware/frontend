import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import acknowledgementCard from "./acknowledgementUtils";
import { gotoHomeFooter } from "./acknowledgementFooter";

const getAcknowledgementCard = (
  state,
  dispatch,
  applicationNumber
) => {
  if (applicationNumber) {
    return {
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          // style: {
          //   position: "absolute",
          //   width: "95%"
          // }
        },
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Submitted Successfully",
              labelKey: "OBM_APPL_SUBMITTED_SUCCESS"
            },
            body: {
              labelName:
                "A notification regarding Application Submission has been sent to trade owner at registered Mobile No.",
              labelKey: "OBM_APPL_SUBMITTED_SUCCESS_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "OBM_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
    
  }
}

const acknowledgement = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  beforeInitScreen:(action, state, dispatch) => {
    let applicationNumber = getQueryArg(window.location.href, "applicationNumber");

    const data = getAcknowledgementCard(
      state,
      dispatch,
      applicationNumber
    );
    set(action, "screenConfig.components.div.children", data);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    },
    //newApplicationFooter
  }
};
export default acknowledgement;