import {
  getCommonContainer,
  getDivider,
  getCommonGrayCard,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDate, checkValueForNA } from "egov-ui-framework/ui-config/screens/specs/utils";
import {genderValues} from "./../../../../ui-utils/constants";

const addSpace = data => {
  return ""+checkValueForNA(data);;
};

const addMoneySuffix = data => {
  data = checkValueForNA(data);
  return data==="NA"? data: data+" /-";
};

const checkNoData = data => {
  data = checkValueForNA(data);
  return data==="NA"? "-": data;
};

const getGenderStr = data => {
  data = checkValueForNA(data);
  data = data!="NA"?genderValues(data):data;
  return data;
};

export const getDeathCertDetailsCard = (inJsonPath) => {

  return getCommonGrayCard({

    // value2: getCommonValue({
    //   jsonPath: inJsonPath + ".detailsAndMutDate",
    //   callBack: addSpace
    // }),
    certDetailsContainer: getCommonContainer(
      {
        name: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "Name"
          },
          {
            jsonPath: inJsonPath + ".fullname",
            callBack: checkNoData
          }
        ),
        genderStr: getLabelWithValue(
          {
            labelName: "Gender",
            labelKey: "Gender"
          },
          {
            jsonPath: inJsonPath + ".gender",
            callBack: getGenderStr
          }
        )
      }),
    //divider1: getDivider(),
    certDetailsContainer2: getCommonContainer(
      {
        dob: getLabelWithValue(
          {
            labelName: "Date of death",
            labelKey: "Date of Death"
          },
          {
            jsonPath: inJsonPath + ".dateofdeath",
            callBack: convertEpochToDate
          }
        ),
        placeOfDeath: getLabelWithValue(
          {
            labelName: "Place of Death",
            labelKey: "Place of Death"
          },
          {
            jsonPath: inJsonPath + ".placeofdeath",
            callBack: checkNoData
          }
        )
      }),
    //divider2: getDivider(),
    certDetailsContainer3: getCommonContainer(
      {
        nameOfMother: getLabelWithValue(
          {
            labelName: "Name of Mother",
            labelKey: "Name of Mother"
          },
          {
            jsonPath: inJsonPath + ".deathMotherInfo.fullname",
            callBack: checkNoData
          }
        ),
        nameOfFather: getLabelWithValue(
          {
            labelName: "Name of Father",
            labelKey: "Name of Father"
          },
          {
            jsonPath: inJsonPath + ".deathFatherInfo.fullname",
            callBack: checkNoData
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    divider2: getDivider(),
    certDetailsContainer4: getCommonContainer(
      {
        mothersUid: getLabelWithValue(
          {
            labelName: "Mother's UID No",
            labelKey: "Mother's UID No"
          },
          {
            jsonPath: inJsonPath + "deathMotherInfo.aadharno",
            callBack: checkNoData
          }
        ),
        fathersUid: getLabelWithValue(
          {
            labelName: "Father's UID No",
            labelKey: "Father's UID No"
          },
          {
            jsonPath: inJsonPath + "deathFatherInfo.aadharno",
            callBack: checkNoData
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    divider3: getDivider(),
    certDetailsContainer5: getCommonContainer(
      {
        mothersUid: getLabelWithValue(
          {
            labelName: "Mother's UID No",
            labelKey: "Mother's UID No"
          },
          {
            jsonPath: inJsonPath + "deathMotherInfo.aadharno",
            callBack: checkNoData
          }
        ),
        fathersUid: getLabelWithValue(
          {
            labelName: "Father's UID No",
            labelKey: "Father's UID No"
          },
          {
            jsonPath: inJsonPath + "deathFatherInfo.aadharno",
            callBack: checkNoData
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    divider4: getDivider(),
    certDetailsContainer6: getCommonContainer(
      {
        presentAddr: getLabelWithValue(
          {
            labelName: "ADDRESS OF PARENTS AT THE TIME OF DEATH OF THE CHILD",
            labelKey: "Address of parents at the time of death of the child"
          },
          {
            jsonPath: inJsonPath + ".deathPresentaddr.fullAddress",
            callBack: checkNoData
          }
        ),
        permenantAddr: getLabelWithValue(
          {
            labelName: "PERMANENT ADDRESS OF THE PARENTS",
            labelKey: "Permanent address of parent"
          },
          {
            jsonPath: inJsonPath + ".deathPermaddr.fullAddress",
            callBack: checkNoData
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    divider5: getDivider(),
    certDetailsContainer7: getCommonContainer(
      {
        registrationNo: getLabelWithValue(
          {
            labelName: "Registration Number",
            labelKey: "Registration Number"
          },
          {
            jsonPath: inJsonPath + ".registrationno",
            callBack: checkNoData
          }
        ),
        dateOfRegistration: getLabelWithValue(
          {
            labelName: "Date of Registration",
            labelKey: "Date of Registration"
          },
          {
            jsonPath: inJsonPath + ".dateofreport",
            callBack: convertEpochToDate
          }
        ),
      },
      {
        style: {
          overflow: "visible"
        }
      }
    ),
    // caption2: getCommonCaption({
    //   labelName: "Details and Mutation Date",
    //   labelKey: "LAMS_DETAILSMUTDATE"
    // }),
    // value2: getCommonValue({
    //   jsonPath: inJsonPath + ".detailsAndMutDate",
    //   callBack: addSpace
    // })
  });
}