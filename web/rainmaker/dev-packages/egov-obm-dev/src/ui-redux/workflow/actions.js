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
      const payload = {"ResponseInfo":null,"ProcessInstances":[{"id":"8364ce6a-9e81-402f-990a-d6b934f572bc","tenantId":"pb.agra","businessService":"LAMS_NewLR_CEO_V3","businessId":"LAMS-LR-AGRA-2021-01-13-000535","action":"APPLY","moduleName":"LAMS","state":{"auditDetails":null,"uuid":"5c20de8d-67cc-403f-80f8-28ae470bca27","tenantId":"pb.agra","businessServiceId":"9c9e29ec-b6f7-4f60-b60a-51c7e71e66e2","sla":null,"state":"APPLIED","applicationStatus":"APPLIED","docUploadRequired":false,"isStartState":false,"isTerminateState":false,"isStateUpdatable":null,"actions":[{"auditDetails":null,"uuid":"89ce7d14-ecd1-4492-b5c4-048280a2e9bf","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"4f96efac-e3ad-45e2-ab5f-b7964501eda3","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"00ee84f5-187a-4adb-a4d1-7f422bc5e8ba","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"bf58061c-a828-4105-be47-37a6be5dad16","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"59f2d550-7c9c-4d24-b8e1-febd5863c995","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"ca822b73-3cee-4caf-a0e8-5881cca4f929","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]}]},"comment":null,"documents":[{"id":"6af7176e-72b4-4838-bc26-5659e8e7811e","tenantId":"pb.agra","documentType":"APPLICATION","fileStoreId":"b9b66304-f4f9-41c0-ae0f-11a3425e0883","documentUid":null,"auditDetails":{"createdBy":"633c794c-bf5a-4ba9-939b-b13fe66c8610","lastModifiedBy":"633c794c-bf5a-4ba9-939b-b13fe66c8610","createdTime":1610527113940,"lastModifiedTime":1610527113940}}],"assigner":{"id":574,"userName":"9632643463","name":"Minju","type":"CITIZEN","mobileNumber":"9632643463","emailId":"minju.sarah@gmail.com","roles":[{"id":null,"name":"Citizen","code":"CITIZEN","tenantId":"pb"}],"tenantId":"pb","uuid":"633c794c-bf5a-4ba9-939b-b13fe66c8610"},"assignes":null,"nextActions":[{"auditDetails":null,"uuid":"4f96efac-e3ad-45e2-ab5f-b7964501eda3","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"APPROVE","nextState":"4b270402-937c-422a-ae51-bdd5bdf6b310","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"59f2d550-7c9c-4d24-b8e1-febd5863c995","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"DGDE-EXAMINATION","nextState":"bff5f407-5076-460c-9fd2-45161d89b27a","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"ca822b73-3cee-4caf-a0e8-5881cca4f929","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"MOD-EXAMINATION","nextState":"a2a89111-327f-41fd-a817-6cd2125d9ba0","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"bf58061c-a828-4105-be47-37a6be5dad16","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"PDDE-EXAMINATION","nextState":"730c04d2-e152-4bfc-bc01-b8d266f581e5","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"00ee84f5-187a-4adb-a4d1-7f422bc5e8ba","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"REJECT","nextState":"cefe5b31-cb56-4aad-a014-eb528fc81cdc","roles":["LR_APPROVER_CEO"]},{"auditDetails":null,"uuid":"89ce7d14-ecd1-4492-b5c4-048280a2e9bf","tenantId":"pb.agra","currentState":"5c20de8d-67cc-403f-80f8-28ae470bca27","action":"SENDBACK","nextState":"6f4c0a2f-9859-4563-b3b5-7e7c817c5a82","roles":["LR_APPROVER_CEO"]}],"stateSla":null,"businesssServiceSla":-12550938477,"previousStatus":null,"entity":null,"auditDetails":{"createdBy":"633c794c-bf5a-4ba9-939b-b13fe66c8610","lastModifiedBy":"633c794c-bf5a-4ba9-939b-b13fe66c8610","createdTime":1610527113940,"lastModifiedTime":1610527113940}}]};
      dispatch(setProcessInstances(payload));
      console.log(error);
    }
  };
};
