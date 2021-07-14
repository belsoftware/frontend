import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabelWithValueForModifiedLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDateAndHandleNA } from '../../utils';


export const reviewDeactivationEffectiveDate = {
  reviewModification: getLabelWithValueForModifiedLabel(
  {
    labelName: "Deactivation Date",
    labelKey: "WS_DEACTIVATION_EFFECTIVE_DATE"
  },
  {
    jsonPath: "WaterConnection[0].deactivationDate",
    callBack: convertEpochToDateAndHandleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "WaterConnectionOld[0].deactivationDate",
    callBack: convertEpochToDateAndHandleNA
  }
),
reviewLastMeterReading: getLabelWithValueForModifiedLabel(
  {
    labelName: "Last Meter Reading",
    labelKey: "WS_LAST_METER_READING"
  },
  {
    jsonPath: "WaterConnection[0].additionalDetails.lastMeterReading"
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "WaterConnectionOld[0].additionalDetails.lastMeterReading"
  }
),
};


export const reviewDeactivationEffective = () => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelKey: "WS_DEACTIVATION_DETAILS"
          })
        }
      }
    },
    viewOne: deactivationEffectiveDateDetails
  })
};

const deactivationEffectiveDateDetails = getCommonContainer(
  reviewDeactivationEffectiveDate
);