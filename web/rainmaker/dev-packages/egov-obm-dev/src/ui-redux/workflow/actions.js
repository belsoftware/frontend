import * as actionTypes from "./actionTypes";
import { httpRequest } from "ui-utils/api";

export const setProcessInstances = payload => {
  return {
    type: actionTypes.GET_WORK_FLOW,
    payload
  };
};

export const getWorkFlowData = queryObject => {
  return async (dispatch, getState) => {
    try {
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      dispatch(setProcessInstances(payload));
    } catch (error) {
      //tobechanged
      const payload = {"ResponseInfo":null,"ProcessInstances":[{"id":"8f2ef016-6b23-4ab2-b459-43a088d51e44","tenantId":"pb.agra","businessService":"LAMS_NewLR_CEO_V3","businessId":"LAMS-LR-AGRA-2021-01-09-000526","action":"APPLY","moduleName":"LAMS","state":{"auditDetails":null,"uuid":"5c20de8d-67cc-403f-80f8-28ae470bca27","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"89ce7d14-ecd1-4492-b5c4-048280a2e9bf","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"4f96efac-e3ad-45e2-ab5f-b7964501eda3","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"00ee84f5-187a-4adb-a4d1-7f422bc5e8ba","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"bf58061c-a828-4105-be47-37a6be5dad16","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"59f2d550-7c9c-4d24-b8e1-febd5863c995","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"ca822b73-3cee-4caf-a0e8-5881cca4f929","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]}]},"comment":null,"documents":[{"id":"4d93dcc1-2c0b-4a0b-85be-de0e73f4f0aa","tenantId":"pb.agra","documentType":"APPLICATION","fileStoreId":"2c4c0e92-af42-4ae4-a7f2-244648c51c35","documentUid":null,"auditDetails":{"createdBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","lastModifiedBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","createdTime":1610182391518,"lastModifiedTime":1610182391518}}],"assigner":{"id":5267,"userName":"LR_CE_AGRA","name":"LR CE AGRA","type":"EMPLOYEE","mobileNumber":"9845135122","emailId":null,"roles":[{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"pb.agra"},{"id":null,"name":"LR Counter Employee","code":"LR_CEMP","tenantId":"pb.agra"}],"tenantId":"pb.agra","uuid":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"4f96efac-e3ad-45e2-ab5f-b7964501eda3","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"59f2d550-7c9c-4d24-b8e1-febd5863c995","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"ca822b73-3cee-4caf-a0e8-5881cca4f929","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"bf58061c-a828-4105-be47-37a6be5dad16","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"00ee84f5-187a-4adb-a4d1-7f422bc5e8ba","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"89ce7d14-ecd1-4492-b5c4-048280a2e9bf","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]}],"stateSla":null,"businesssServiceSla":-12968696287,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","lastModifiedBy":"cd20fb35-8cff-40ea-a1a1-3449fb24b62b","createdTime":1610182391518,"lastModifiedTime":1610182391518}}]};
      dispatch(setProcessInstances(payload));
      console.log(error);
    }
  };
};
