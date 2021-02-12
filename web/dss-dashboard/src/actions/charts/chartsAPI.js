/**
 * Dashboard API
 */
import API from '../apis/api';
import C from '../constants';
import {getQueryArg} from "../../actions/commons";

export default class ChartsAPI extends API {

    constructor(timeout = 2000, path, codeKey, reqBody, queryParams = null) {
        super('POST', timeout, false);
        this.type = C.CHARTS;
        this.chartsData = {};
        this.chartsData[codeKey] = [];
        this.path = path;
        this.codeKey = codeKey;
        this.body = reqBody;
    }

    toString() {}

    processResponse(res) {
        super.processResponseCharts(res);
        if (res && res["responseData"]) {
            this.chartsData[this.codeKey] = res["responseData"];
            return true
        }
        return false
    }

    getPayload() {
        return this.chartsData[this.codeKey];
    }

    getBody() {
        return this.body;

    }
    getChartKey() {
        return this.codeKey;
    }
    apiEndPoint() {
        let apiName = window.location.pathname.includes("citizen-home")? "getChartOpen" : "getChartV2";
        return `${super.apiEndPoint()}/${this.path}/`+apiName;
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'auth-token': `${localStorage.getItem('Employee.token')}`
            }
        }
    }


}