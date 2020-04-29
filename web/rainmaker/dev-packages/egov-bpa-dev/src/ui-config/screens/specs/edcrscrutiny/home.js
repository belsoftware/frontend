import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./functions";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import EDCRIcon from "../../../../ui-atoms-local/Icons/EDCRIcon";
import { cityPicker } from "./citypicker";
import "../utils/index.css";

const header = getCommonHeader(
  {
    labelName: "eDCR Scrutiny",
    labelKey: "EDCR_CITIZEN_COMMON_TITLE"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const cardItems = [
  {
    label: {
      labelKey: "EDCR_COMMON_APPL_NEW",
      labelName: "New Building Plan Scrutiny"
    },
    icon: <EDCRIcon />,
    route: "apply"
  },
  {
    label: {
      labelKey: "EDCR_COMMON_APPL_NEW_OC",
      labelName: "Occupancy Certificate eDCR Scrutiny For New Building"
    },
    icon: <EDCRIcon />,
    route: "ocapply"
  },
  {
    label: {
      labelKey: "TL_MY_APPLICATIONS",
      labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: "my-applications"
  }
];

const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      // props: {
      //   className: "common-div-css"
      // },
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        }
      }
    },
    cityPickerDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "md"
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
          },
          children: {
            popup: cityPicker
          }
        }
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
