export const getWFConfig = (module, businessService) => {
  switch (module.toUpperCase()) {
    case "OBM-SERVICES":
      return {
          CITIZEN: "/chb-common/viewBooking", //tobechanged  If Citizen has to resubmit the documents.
          DEFAULT: "/chb-common/viewBooking",
      };
  }
};
