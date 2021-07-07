import React, { Component } from "react";
import { connect } from "react-redux";
import {Card,Button} from "egov-ui-framework/ui-atoms";
import {Conatainer} from "egov-ui-framework/ui-atoms";
import get from "lodash/get";
import {LabelContainer} from "egov-ui-framework/ui-containers";
import {RadioButtonsGroup} from "egov-ui-framework/ui-containers";
//import "./index.css";
//import {Div} from "egov-ui-framework/ui-atoms/HtmlElements";

class ListCard2 extends Component {
  
  state = {
    results: [],
    searchTerm: "",
    selectedEmployeeId: "",
    dataSource: [],
  };

  componentDidMount = () => {

  };

  componentWillReceiveProps = (nextProps) => {

  };

  appCardHeaderStyle = (colorOne = "#ec407a", colorTwo = "#d81b60") => {
    return {
      color: "#FFFFFF",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50px",
      padding: "15px",
      marginTop: "-36px",
      borderRadius: "3px",
      background: `linear-gradient(60deg,${colorOne} ,${colorTwo} )`,
      boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)"
    };
  };
  hallCallFunction = (hallId)=>{
    console.log(hallId);
};

  render() {
    let {jsonPath,preparedFinalObject } = this.props || [];
    let listData = get(preparedFinalObject,jsonPath);
    return (
      <div>
          {listData && listData.map((listItem)=>
          { 
            return (
                    <Card>
                          <div>
                              <LabelContainer
                                labelKey={`   HallName :  ${listItem.hallId}`}
                                style={{
                                        fontSize: "20px",
                                        fontWeigt: 400,
                                        marginTop : 80,
                                        marginLeft : "20px",
                                        lineSpacing: "50px"
                                      }}
                             />
                           </div>
                          <div>
                             <LabelContainer
                                labelKey={`   Dimension :  ${listItem.dimension}`}
                                style={{
                                        color: "rgba(0, 0, 0, 0.6000000238418579)",
                                        fontSize: "16px",
                                        fontWeigt: 400,
                                        marginLeft : "20px",
                                        marginTop : "50px",
                                        lineSpacing: 25
                                      }}

                              />
                              <Button
                                id="map-close-button"
                                className="pick responsive-action-button"
                                children={"+  Add"}
                                style={{
                                  width: "20px",
                                  height: "48px",
                                  marginLeft: "600px"
                                  }}
                                variant={"outlined"}
                                color={"primary"}
                                onClick={()=> this.hallCallFunction(listItem.hallId)}
                               />
                               <Button
                                id="map-close-button"
                                className="pick responsive-action-button"
                                children={"-  Remove"}
                                style={{
                                  minWidth: "20px",
                                  height: "48px",
                                  marginLeft: "100px"
                                  }}
                                variant={"outlined"}
                                color={"primary"}
                                onClick={()=> this.hallCallFunction(listItem.hallId)}
                               />
                            </div>
                          <div>
                              <LabelContainer
                                labelKey={`   HallCapacity :  ${listItem.hallCapacity}`}
                                style={{
                                        fontSize: "14px",
                                        marginLeft : "20px",
                                        fontWeigt: 400,
                                        marginTop : "50px",
                                        marginBottom : "50px",
                                        lineSpacing: "25px"
                                      }}
                              />
                            </div>
                    </Card>
                  )
          }
          )}
       </div> );
};
}
const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPath };
};

export default connect(
    mapStateToProps
  )(ListCard2);
