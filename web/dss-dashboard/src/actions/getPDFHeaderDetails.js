import _ from 'lodash';
export default function getPDFHeaderDetails(mdmsData) {
  console.log("Check mdms Data", mdmsData);
  let returnObj = {logo: '',headerText: 'TEST'};
  if(!_.isEmpty(mdmsData,true)){
    returnObj.logo = mdmsData['tentantLogo'][`${localStorage.getItem('tenant-id')}`];
    returnObj.headerText= mdmsData['tenantName'].toUpperCase() +" "+ mdmsData['corpName'].toUpperCase();    
  }
  return returnObj;
}