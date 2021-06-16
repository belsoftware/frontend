import {
  getCommonCardWithHeader,
  getLabel,
  getDateField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";

const screenConfig = {
  uiFramework: "material-ui",
  name: "mihyLoginScreen",
  components: {
    fromDate: getDateField({
      label: { labelName: "fromDate", labelKey: "COMMON_FROM_DATE" },
      placeholder: {
        labelName: "From Date",
        labelKey: "COMMON_FROM_DATE"
      },
      jsonPath: "ghb.fromDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE",
      required: true,
      props: {
        inputProps: {
          //max: getTodaysDateInYMD()
        }
      },
      visible: true,
    }),
    mihyLoginGrid: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        mihyEmptyRow: {
          uiFramework: "custom-atoms",
          componentPath: "Item",
          props: {
            sm: 4
          }
        },
        mihyLoginItem: {
          uiFramework: "custom-atoms",
          componentPath: "Item",
          props: {
            sm: 4,
            xs: 12
          },
          children: {
            mihyLoginCard: getCommonCardWithHeader(
              {
                mihyloginDiv: {
                  uiFramework: "custom-atoms",
                  componentPath: "Div",
                  props: {
                    className: "text-center"
                  },
                  children: {
                    mihyLoginUsername: {
                      uiFramework: "custom-molecules",
                      componentPath: "TextfieldWithIcon",
                      props: {
                        label: "Email",
                        margin: "normal",
                        fullWidth: true,
                        autoFocus: true,
                        required: true,
                        iconObj: {
                          position: "end",
                          iconName: "email"
                        }
                      },
                      required: true,
                      jsonPath: "body.mihy.username",
                      pattern: "^([a-zA-Z0-9@.])+$"
                    },
                    mihyLoginPassword: {
                      uiFramework: "custom-molecules",
                      componentPath: "TextfieldWithIcon",
                      props: {
                        label: "Password",
                        type: "password",
                        margin: "normal",
                        fullWidth: true,
                        required: true,
                        iconObj: { position: "end", iconName: "lock" }
                      },
                      jsonPath: "body.mihy.password",
                      required: true,
                      pattern: "^([a-zA-Z0-9!])+$"
                    },
                    mihyBreakOne: {
                      uiFramework: "custom-atoms",
                      componentPath: "Break"
                    },
                    mihyBreakTwo: {
                      uiFramework: "custom-atoms",
                      componentPath: "Break"
                    },
                    mihyLoginButton: {
                      componentPath: "Button",
                      props: {
                        color: "primary",
                        fullWidth: true
                      },
                      children: {
                        mihyLoginButtonText: getLabel({label:"Let's go"})
                      }
                      // onClickDefination:{
                      //   action:"submit",
                      //   method:"get",
                      //   endPoint:"afbc.com",
                      //   purpose:"authLogin",
                      //   redirectionUrl:"/"
                      // }
                    }
                  }
                }
              },
              {
                mihyLoginHeader: {
                  componentPath: "Typography",
                  children: {
                    mihyLoginHeaderText: getLabel({label:"Login"})
                  },
                  props: {
                    align: "center",
                    variant: "title",
                    style: {
                      color: "white"
                    }
                  }
                }
              }
            )
          }
        }
      }
    }
  }
};

export default screenConfig;
