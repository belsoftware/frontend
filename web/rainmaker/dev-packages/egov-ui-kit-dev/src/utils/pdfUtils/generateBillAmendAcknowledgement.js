// import { tradeInstitutionDetails, tradeOwnerDetails } from "egov-tradelicence/ui-config/screens/specs/tradelicence/applyResource/review-owner";
// import { tradeAccessoriesDetails, tradeLocationDetails, tradeReviewDetails, tradetypeDetails } from "egov-tradelicence/ui-config/screens/specs/tradelicence/applyResource/review-trade";
import { billAmendDemandRevisionContainer } from "egov-billamend/ui-config/screens/specs/bill-amend/search-preview";
import { generateKeyValue, generatePDF,getPropertyCard, getDocumentsCard, getEstimateCardDetails } from "./generatePDF";
import { getFromObject } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

const getDate=(date)=>{

    let dateObj=new Date(date);
    return `${dateObj.getDate()}-${dateObj.getMonth()+1}-${dateObj.getYear()+1900}`;
    }

export const generateBillAmendAcknowledgement = (preparedFinalObject, fileName = "acknowledgement.pdf") => {

    billAmendDemandRevisionContainer.demandRevisionBasis.localiseValue = true;
 
    let UlbLogoForPdf = getFromObject(preparedFinalObject, 'UlbLogoForPdf', '');
    let Amendment = getFromObject(preparedFinalObject, 'Amendment', {});

    const modifiedDemand = { ...billAmendDemandRevisionContainer };
    let demandRevisionBasis = getFromObject(Amendment, "amendmentReason", "");
    switch (demandRevisionBasis) {
        case "COURT_CASE_SETTLEMENT":
            delete modifiedDemand.govtNotificationNumber;
            delete modifiedDemand.fromDate
            delete modifiedDemand.toDate
            break;
        case "ARREAR_WRITE_OFF":
        case "ONE_TIME_SETTLEMENT":
            delete modifiedDemand.courtOrderNo
            delete modifiedDemand.dateEffectiveFrom
            delete modifiedDemand.documentNo
            break;
        case "DCB_CORRECTION":
        case "REMISSION_FOR_PROPERTY_TAX":
        case "OTHERS":
            delete modifiedDemand.courtOrderNo
            delete modifiedDemand.dateEffectiveFrom
            delete modifiedDemand.govtNotificationNumber
            break;
        default:
            delete modifiedDemand.courtOrderNo
            delete modifiedDemand.dateEffectiveFrom
            delete modifiedDemand.govtNotificationNumber
    }
    const demandDetails = getFromObject(preparedFinalObject, 'Amendment.demandDetails', []);
    const estdemandDetails = getFromObject(preparedFinalObject, 'AmendmentTemp[0].estimateCardData', []);
    console.log("estdemandDetails",estdemandDetails);
    const estimateCardData =[];
    const demanddata = [];
    // const estimateCardData = [{
    //     name: {
    //         labelName: 'BILL_TAX_HEADS',
    //         labelKey: 'BILL_TAX_HEADS'
    //     },
    //     value: getLocaleLabels('BILL_REDUCED_AMOUNT_RS','BILL_REDUCED_AMOUNT_RS')
    // }]
    demandDetails.map(demand => {
        // if( demand.taxAmount > 0){
        //     estimateCardData[0].value=getLocaleLabels('DEBIT_NOTE','DEBIT_NOTE');
        //   }else{
        //     estimateCardData[0].value=getLocaleLabels('CREDIT_NOTE','CREDIT_NOTE');
        //   }
        estimateCardData.push({
            name: {
                labelName: demand.taxHeadMasterCode,
                labelKey: demand.taxHeadMasterCode
            },
            value: Math.abs(demand.taxAmount),
           
        })

    })

    estdemandDetails.map(est => {

        demanddata.push({
            name: {
                labelName: est.taxHeadMasterCode,
                labelKey: est.taxHeadMasterCode
            },
            value: Math.abs(est.demand),
           
        })

    })

console.log("demanddata:",demanddata);
    const documentsUploadRedux = getFromObject(preparedFinalObject, 'bill-amend-review-document-data', []);
    const documentCard = getDocumentsCard(documentsUploadRedux);
    const estimateDetails = getEstimateCardDetails(estimateCardData, undefined,demanddata)
    const billAmendDemandRevisionSummary = generateKeyValue(preparedFinalObject, modifiedDemand);
    const propertydetails = getFromObject(preparedFinalObject, 'Properties[0]', []);
    const propertyCard = getPropertyCard(propertydetails)
    let pdfData = {
        header: "BILLAMEND_APPLICATION", tenantId: Amendment.tenantId,
        applicationNoHeader: 'BILLAMEND_APPLICATIONNO', applicationNoValue: Amendment.amendmentId,
        additionalHeader: "BILLAMEND_APPLICATIONDATE", additionalHeaderValue:getDate(Amendment.auditDetails.createdTime) ,
        cards: [
            { header: "BILL_ADJUSTMENT_AMOUNT_DETAILS", type: 'header' },
            { items: estimateDetails, type: 'estimate' },
            { header: "BILL_DEMAND_REVISION_BASIS_DETAILS", items: billAmendDemandRevisionSummary },
            { header: 'BILL_DOCUMENTS', items: documentCard },
             {header: 'BILL_PROPERTY_DETAILS', items: propertyCard }
        ]
    }

    generatePDF(UlbLogoForPdf, pdfData, fileName,true);
}