import React from "react";
import Calendar from "react-calendar";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.css";
class Calender extends React.Component {
  
  onChange=(date)=>{
    return {
      style: "content"
  };
  }
  
  
  render() {
    const {state}= this.props || []
    let DateDetails=get(state.screenConfiguration.preparedFinalObject,"chb.viewHallDetails.calender")
    // Convertion of EpochToDate
    let ConvertedDate=[];


    return (
      <div><Calendar selectRange={true} onChange={this.onChange} tileDisabled={({ date }) => date.getDay() === 0} tileClassName="content" /> </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { state,screenConfiguration,preparedFinalObject};
};

export default connect(
    mapStateToProps
  )(Calender);
