import {
  getCommonContainer,
  getDivider,
  getCommonGrayCard,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate, checkValueForNA } from "egov-ui-framework/ui-config/screens/specs/utils";

export const getHallHeaderCard = (inJsonPath) => {

  return getCommonGrayCard({

    certDetailsContainer: getCommonContainer(
      {
        name: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "Name"
          },
          {
            jsonPath: inJsonPath + ".fullName",
            callBack: checkNoData
          }
        ),
        genderStr: getLabelWithValue(
          {
            labelName: "Gender",
            labelKey: "Gender"
          },
          {
            jsonPath: inJsonPath + ".genderStr",
            //callBack: getGenderStr
          }
        )
      }),
    //divider1: getDivider(),
  });
}