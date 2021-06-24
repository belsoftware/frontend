import React, { Component } from "react";
import { Card, Icon, List, Image, AutoSuggest, Button } from "egov-ui-kit/components";
import {Conatainer} from "egov-ui-framework/ui-atoms";
import {LabelContainer} from "egov-ui-framework/ui-containers";
import {RadioButtonsGroup} from "egov-ui-framework/ui-containers";
//import {Div} from "egov-ui-framework/ui-atoms/HtmlElements";

export default class ListCard2 extends Component {
  
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

  render() {
    let { listData } = this.props || [{"hallId":"hall1","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}},{"hallId":"hall2","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}}];   
    listData = [{"hallId":"hall1","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}},{"hallId":"hall2","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}}];
    return (
      <div>Hey whatsupp
        {/* <Conatainer id="check">
          Test container
        </Conatainer> */}
        {/* <RadioButtonsGroup></RadioButtonsGroup> */}
        
        {listData && listData.map((listItem)=>{
          //return (<div>{listItem.dimension}</div>)
          // return (<Conatainer>
          //    {listItem.dimension}
          //  </Conatainer>)      
          return (<LabelContainer labelKey={listItem.dimension} labelName={listItem.dimension}/>)

        })}
      </div>
    );
  }
}
