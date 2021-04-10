import { MDMS } from "egov-ui-kit/utils/endPoints";
import { subUsageType, occupancy, builtArea, annualRent, floorName, beforeInitForm } from "../utils/reusableFields";
const formConfig = {
  name: "floorDetails",
  fields: {
    usageType: {
      id: "assessment-usageType",
      jsonPath: "Properties[0].propertyDetails[0].units[0].usageCategoryMinor",
      type: "textfield",
      floatingLabelText: "PT_COMMON_USAGE_TYPE",
      // value: "Public Space",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      value: "PROPERTYTAX_BILLING_SLAB_PUBLIC_SPACE",
      required: true,
      disabled: true,
      numcols: 4,
      formName: "plotDetails",
    },
    ...subUsageType,
    ...occupancy,
    ...builtArea,
    ...floorName,
    ...annualRent,
  },
  isFormValid: false,
  ...beforeInitForm,
};

export default formConfig;
