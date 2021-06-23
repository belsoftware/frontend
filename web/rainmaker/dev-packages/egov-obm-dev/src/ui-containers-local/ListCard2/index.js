import React, { Component } from "react";
import { Card, Icon, List, Image, AutoSuggest, Button } from "egov-ui-kit/components";
import { ListItem } from "@material-ui/core";

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

  render() {
    let { listData } = this.props || [{"hallId":"hall1","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}},{"hallId":"hall2","dimension":"20 X 20","hallName":"Lakshya","hallCapacity":"400","taxHeadBreakup":{"deposit":200,"water":20},"bookedSlots":{"booked":[[1234133134,3413413342],[12341234,1234123413]],"blocked":[[1234133134,3413413342],[12341234,1234123413]]}}];   
    return (
      <div>Hey whatsupp
        {listData && listData.map((listItem)=>{

        })}
      </div>
    );
  }
}
