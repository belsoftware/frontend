const screenConfig = {
  uiFramework: "material-ui",
  name: "test",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
      },
    },
    button:{
      uiFramework:"custom-atoms",
      componentPath:"Button",
      props:{
        variant:"contained",
        fullWidth:true,
        size:"large"
      }
    }
  },
};

export default screenConfig;
