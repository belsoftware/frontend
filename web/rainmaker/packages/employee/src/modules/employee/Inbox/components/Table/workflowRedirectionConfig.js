export const getWFConfig = (module, businessService) => {
  switch (module.toUpperCase()) {
    case "LAMS":
      return {
        INITIATED: "/lams-common/search-preview",
        DEFAULT: "lams-common/search-preview",
      };
    case "TL-SERVICES":
      return {
        INITIATED: "/tradelicence/apply",
        DEFAULT: "/tradelicence/search-preview",
      };
    case "WS-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "SW-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "FIRENOC":
      return {
        INITIATED: "/fire-noc/apply",
        DEFAULT: "/fire-noc/search-preview",
      };
    case "BPA-SERVICES":
      if (businessService === "BPA_OC") {
        return {
          INITIATED: "/oc-bpa/search-preview",
          DEFAULT: "/oc-bpa/search-preview",
        };
      } else {
        return {
          INITIATED: "/egov-bpa/search-preview",
          DEFAULT: "/egov-bpa/search-preview",
        };
      }
    case "BPAREG":
      return {
        DEFAULT: "/bpastakeholder/search-preview",
      };
    case "PT-SERVICES":
      return {
        INITIATED: "/property-tax/application-preview",
        DEFAULT: "/property-tax/application-preview",
      };
    case "PT":
      if (businessService === "PT.CREATE") {
        return {
          INITIATED: "/property-tax/application-preview",
          DEFAULT: "/property-tax/application-preview",
        };
      } else {
        return {
          INITIATED: "/pt-mutation/search-preview",
          DEFAULT: "/pt-mutation/search-preview",
        };
      }
      case "NOC-SERVICES":
      return {
        INITIATED: "/egov-bpa/noc-search-preview",
        DEFAULT: "/egov-bpa/noc-search-preview",
      };
      case "BS":
        return {
          INITIATED: "/bill-amend/search-preview",
          DEFAULT: "/bill-amend/search-preview",
        };
  }
};
