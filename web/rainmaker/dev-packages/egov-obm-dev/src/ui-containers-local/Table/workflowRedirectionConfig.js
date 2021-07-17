export const getWFConfig = (module, businessService) => {
  switch (module.toUpperCase()) {
    case "OBM-SERVICES":
      return {
          CITIZEN: "/obm-common/viewBooking", //tobechanged  If Citizen has to resubmit the documents.
          DEFAULT: "/obm-common/viewBooking",
      };
  }
};
