import { measuringUnit, occupancy, subUsageType, beforeInitFormForPlot, superArea, annualRent, floorName } from "../utils/reusableFields";

const formConfig = {
  name: "plotDetails",
  fields: {
    usageType: {
      id: "assessment-usageType",
      jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryMajor",
      type: "textfield",
      floatingLabelText: "PT_COMMON_USAGE_TYPE",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      value: "Non Residential",
      required: true,
      disabled: true,
      numcols: 4,
      formName: "plotDetails",
    },
    ...subUsageType,
    ...occupancy,
    ...superArea,
    ...measuringUnit,
    ...floorName,
    ...annualRent,
  },
  isFormValid: false,
  ...beforeInitFormForPlot,
};

export default formConfig;
