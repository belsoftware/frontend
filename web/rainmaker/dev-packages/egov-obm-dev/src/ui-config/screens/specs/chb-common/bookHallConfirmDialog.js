import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getDivider
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {showHideConfirmationPopup } from "./bookHall";
import { postBookingData } from "./bookHallFooter";

export const confirmationDialog = getCommonContainer({
  
  header0: getCommonHeader({
    labelName: "",
    labelKey: "OBM_SUBMIT_CONFIRMATION"
  },
  {
    style: {
      fontSize: "20px"
    }
  }),
  divider1: getDivider(),
  confirmationContents: getCommonContainer({
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: {
          width: "90%",
          textAlign: "center"
        }
      },
      children: {
        yesButton: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              minWidth: "100px",
              height: "20px",
              marginRight: "20px",
              marginTop: "16px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "YES",
              labelKey: "OBM_CONFIRM"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              postBookingData(state,dispatch);
              showHideConfirmationPopup(state,dispatch);
            }
          }
        },
        cancelButton: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              minWidth: "100px",
              height: "20px",
              marginRight: "4px",
              marginTop: "16px"
            }
          },
          children: {
            previousButtonLabel: getLabel({
              labelName: "NO",
              labelKey: "OBM_CANCEL"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              showHideConfirmationPopup(state, dispatch, "bookHall")
            }
          }
        }
      }
    }
  })
});
