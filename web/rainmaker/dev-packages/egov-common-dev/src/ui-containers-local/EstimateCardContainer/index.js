import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";
import orderBy from "lodash/orderBy";

class EstimateCardContainer extends Component {
  render() {
    return <FeesEstimateCard estimate={this.props.estimate} />;
  }
}

const sortBillDetails = (billDetails = []) => {
  let sortedBillDetails = [];
  sortedBillDetails = billDetails.sort((x, y) => y.fromPeriod - x.fromPeriod);
  return sortedBillDetails;
}
const formatTaxHeaders = (billDetail = {}) => {

  let formattedFees = []
  const { billAccountDetails = [] } = billDetail;
const billAccountDetailsSorted=  orderBy(
    billAccountDetails,
    ["amount"],
    ["asce"]);
  formattedFees = billAccountDetailsSorted.map((taxHead) => {
    return {
      info: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode
      },
      name: {
        labelKey: taxHead.taxHeadCode,
        labelName: taxHead.taxHeadCode
      },
      value: taxHead.amount
    }
  })
  formattedFees.reverse();
  return formattedFees;
}


const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;



  const fees = formatTaxHeaders(sortBillDetails(get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails", []))[0]);
  // const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);
  const billDetails = get(screenConfiguration, "preparedFinalObject.ReceiptTemp[0].Bill[0].billDetails", []);
  let totalAmount = 0;
  let arrears=0;
  for (let billDetail of billDetails) {
    totalAmount += billDetail.amount;

  }
if(totalAmount>0){
  arrears=totalAmount-billDetails[0].amount;
  arrears = arrears.toFixed(2);
}



for (let billDetail of billDetails) {
    if(billDetail.fromPeriod < Date.now() && Date.now() < billDetail.toPeriod) {
      current = billDetail.amount;
    }
    totalAmount += billDetail.amount;

  }
if(totalAmount>0){
  if(businesService=="PT")
  {
   arrears=totalAmount-current;
  }
}
  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "NOC_FEE_ESTIMATE_HEADER" },
    fees,
    totalAmount,
    arrears
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(EstimateCardContainer);
