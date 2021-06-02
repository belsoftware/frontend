import {
    getCommonCard,
    getCommonContainer,
    getCommonHeader,
    getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../../ui-utils";

import './index.css'

const screenConfig = {
    uiFramework: "material-ui",
    name: "freezeConnection",
    beforeInitScreen: (action, state, dispatch) => {
       // pageReset(dispatch);
        let consumerCode = getQueryArg(window.location.href, "consumerCode");
        let tenantId = getQueryArg(window.location.href, "tenantId");
        let businessService = getQueryArg(window.location.href, "businessService");
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "common-div-css",
                id: "pay"
            },
            children: {
                headerDiv: {
                    uiFramework: "custom-atoms",
                    componentPath: "Container",
                    children: {
                        // header : {}
                    }
                },
                formwizardFirstStep: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    children: {
                        paymentDetails: getCommonCard({
                            header: getCommonTitle({
                                labelName: "Payment Collection Details",
                                labelKey: "NOC_PAYMENT_HEAD"
                            })
                        })
                    }
                }
                
            }
        },
    }
};

export default screenConfig;
