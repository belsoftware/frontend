import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "egov-ui-framework/ui-redux/store";
import { appendModulePrefix } from "egov-ui-framework/ui-utils/commons";
import { getLocaleLabels ,getDefaultFontStyle} from "egov-ui-framework/ui-utils/commons.js";
import { set } from "lodash";
import get from "lodash/get";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "./vfs_fonts";
import { getFromObject } from "../PTCommon/FormWizardUtils/formUtils";
import { localStorageGet,getLocale } from "egov-ui-kit/utils/localStorageUtils";



const vfs = { ...pdfFonts.vfs }
const font = {
    Camby: {
        normal: 'Cambay-Regular.ttf',
        bold: 'Cambay-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Cambay-Regular.ttf',

    },
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Roboto-Regular.ttf',
    },
    kannada: {
        bold: "tungab.ttf",
        normal: "tunga.ttf",
        italics: "tunga.ttf",
      },
    malyalam: {
        bold: "kartika-bold.ttf",
        normal: "kartika-regular.ttf",
        italics: "kartika-regular.ttf",
      },
    tamil: {
        bold: "lathab.ttf",
        normal: "latha.ttf",
        italics: "latha.ttf",
      },
    telugu: {
        bold: "gautamib.ttf",
        normal: "gautami.ttf",
        italics: "gautami.ttf",
      },
      bangla: {
        bold: "SolaimanLipi_Bold.ttf",
        normal: "SolaimanLipi.ttf",
        italics: "SolaimanLipi.ttf",
      },
    SakalBharati: {
        bold: "SakalBharati.ttf",
        normal: "SakalBharati.ttf",
        italics: "SakalBharati.ttf",
      }
};
pdfMake.vfs = vfs;
pdfMake.fonts = font;
const getLabel = (value, type = 'key') => {
    let label = {}
    switch (type) {
        case 'key':
            label = {
                "text": value ? getLocaleLabels(value,value) : 'NA',
                "style": "pdf-card-key",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        case 'value':
            label = {
                "text": value ? getLocaleLabels(value,value) : 'NA',
                "style": "pdf-card-value",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;

        case 'header':
            label = {
                "text": value ? getLocaleLabels(value,value) : ' ',
                "style": "pdf-card-sub-header",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        case 'totalAmount':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-card-sub-header",
                "border": [
                    false,
                    true,
                    false,
                    false
                ]
            }
            break;
        case 'amount':
            label = {
                "text": value ? value : ' ',
                "style": "pdf-application-no",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        case 'nonZero':
            label = {
                "text": value ? value : '0',
                "style": "pdf-card-value",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
            break;
        default:
            label = {
                "text": value ? getLocaleLabels(value,value) : ' ',
                "style": "pdf-card-key",
                "border": [
                    false,
                    false,
                    false,
                    false
                ]
            }
    }

    return label;
}
const getMultiCard = (items = [], color = 'grey') => {
   //console.log("card color---",color);
    let card = []

    items.map(item => {
        if (item.header) {
            let row = []
            row.push(getLabel(getLocaleLabels(item.header, item.header), 'header'))
            for (let i = 0; i < 3; i++) {
                row.push(getLabel(' ', 'header'))
            }
            card.push(row);
        }
        const newCard = getCard(item.items, color);
       
        card.push(...newCard.stack[0].table.body);
    })

    let tableCard = {
        "style": color == "grey" ? "pdf-table-card" : "pdf-table-card-white",
        "table": {
            "widths": [
                125,
                125,
                125,
                125
            ],
            "body": [...card]
        },
        "layout": {}
    }
    return tableCard;
}

const getHeader = (header) => {
    let cardWithHeader = header ? [{
        "text": header == '-1' ? " " : getLocaleLabels(header, header),
        "style": header == '-1' ? "pdf-card-no-title" : "pdf-card-title"
    }] : [];
  
    return cardWithHeader;
}
const getCard = (keyValues = [], color = 'grey') => {
    let card = []
    let keys = [];
    let values = [];
    keyValues.map(keyValue => {
        keys.push(getLabel(keyValue.key, 'key'));
        values.push(getLabel(keyValue.value, 'value'))
        if (keys.length == 4 && values.length == 4) {
            card.push([...keys]);
            card.push([...values]);
            keys = [];
            values = [];
        }
    })
    if (keys.length != 0 && values.length != 0) {
        for (let i = keys.length; i < 4; i++) {
            keys.push(getLabel(' ', 'key'));
            values.push(getLabel(' ', 'value'))
        }
        card.push([...keys]);
        card.push([...values]);
    }
    let tableCard = {

        stack: [
            {
                ...getCustomCard([...card], [
                    125,
                    125,
                    125,
                    125
                ], {}, color)
            }
        ]
    }
    return tableCard;
}
const getCardWithHeader = (header, keyValue, color) => {
    let cardWithHeader = header ? [{
        "text": header == '-1' ? " " : getLocaleLabels(header, header),
        "style": header == '-1' ? "pdf-card-no-title" : "pdf-card-title"
    }] : [];
    cardWithHeader.push(getCard(keyValue, color))
    return cardWithHeader;
}
const getMultiItemCard = (header, items, color = 'grey') => {
    //color='white';
    let returnData = [];
    let cardWithHeader = [];
   
      cardWithHeader = header ? [{
        "text": getLocaleLabels(header, header),
        "style": "pdf-card-title"
    }] : [];
    // breaking items into multiple cards
    items.map(item => {
    cardWithHeader.push(getMultiCard([item], color))
    returnData.push(cardWithHeader[0],cardWithHeader[1]);
    cardWithHeader = header ? [{
        "text": " ",
        "style": "pdf-card-title"
    }] : [];
   
    });
    
    return returnData;
}

export const getMultiItems = (preparedFinalObject, cardInfo, sourceArrayJsonPath) => {
    let multiItem = [];
    let removedElements = [];
    const arrayLength = getFromObject(preparedFinalObject, sourceArrayJsonPath, []).length;
    for (let i = 0; i < arrayLength; i++) {
        let items = [];
        items = generateKeyValue(preparedFinalObject, cardInfo);
        let sourceArray = get(preparedFinalObject, sourceArrayJsonPath, []);
        removedElements.push(sourceArray.shift());
        set(preparedFinalObject, sourceArrayJsonPath, sourceArray);
        multiItem.push({ items });
    }
    set(preparedFinalObject, sourceArrayJsonPath, removedElements);
    return multiItem;
}
export const getMultipleItemCard = (itemsInfo, itemHeader = "COMMON_OWNER", hideHeader = false) => {
    let multipleItems = itemsInfo && itemsInfo[0].items.filter(item => item);
    if (itemsInfo && itemsInfo.length > 1) {
        let items = [];
        itemsInfo.map((item, index) => {
            let rowElements = { header: `${getLocaleLabels(itemHeader, itemHeader)} - ${index+1}`, items: item.items.filter(element => element) };
            if (hideHeader) {
                delete rowElements.header;
            }
            items.push(rowElements)
        })
        multipleItems = items
    }
    return multipleItems;
}
export const getDocumentsCard = (documentsUploadRedux) => {
    return documentsUploadRedux.map(item => {
        return { key: getLocaleLabels(item.title, item.title), value: item.name }
    })
}
export const generateKeyValue = (preparedFinalObject, containerObject) => {
    let keyValue = []
    //console.log("container object--"+getLocale());
    Object.keys(containerObject).map(keys => {
        const labelObject = getFromObject(containerObject[keys],'children.label.children.key.props', getFromObject(containerObject[keys],'children.label1.children.key.props',{}));
        const key = getLocaleLabels(labelObject.labelName, labelObject.labelKey)
        const valueObject = getFromObject(containerObject[keys],'children.value.children.key.props',getFromObject(containerObject[keys],'children.value1.children.key.props',{}));
        let value = valueObject.callBack && typeof valueObject.callBack == "function" ? valueObject.callBack(getFromObject(preparedFinalObject, valueObject.jsonPath, '')) : getFromObject(preparedFinalObject, valueObject.jsonPath, '');
        value = value !== 'NA' && valueObject.localePrefix ? appendModulePrefix(value, valueObject.localePrefix) : value;
        value = containerObject[keys].localiseValue ? getLocaleLabels(value, value) : value;
        keyValue.push({ key, value });
    })
    return keyValue;
}
export const generateKeyValueForModify = (preparedFinalObject, containerObject) => {
    let keyValue = []
    Object.keys(containerObject).map(keys => {
        const labelObject = containerObject[keys].children.label1.children.key.props;
        const key = getLocaleLabels(labelObject.labelName, labelObject.labelKey)
        const valueObject = containerObject[keys].children.value1.children.key.props;
        let value = valueObject.callBack && typeof valueObject.callBack == "function" ? valueObject.callBack(getFromObject(preparedFinalObject, valueObject.jsonPath, '')) : getFromObject(preparedFinalObject, valueObject.jsonPath, '');
        value = value !== 'NA' && valueObject.localePrefix ? appendModulePrefix(value, valueObject.localePrefix) : value;
        value = containerObject[keys].localiseValue ? getLocaleLabels(value, value) : value;
        keyValue.push({ key, value });
    })
    return keyValue;
}
let tableborder = {
    hLineColor: function (i, node) {
        return "#979797";
    },
    vLineColor: function (i, node) {
        return "#979797";
    },
    hLineWidth: function (i, node) {
        return 0.5;
    },
    vLineWidth: function (i, node) {
        return 0.5;
    },
};


const getCustomCard = (body = [], width = [], layout = {}, color = 'grey') => {
    return {
        "style": color == "grey" ? "pdf-table-card" : "pdf-table-card-white",
        "table": {
            widths: width,
            "body": body
        },
        "layout": layout
    }
}
const totalAmount = (arr) => {
    return arr
        .map(item => (!isNaN(item.value) ? item.value : 0))
        .reduce((prev, next) => prev + next, 0);
}
export const getEstimateCardDetails = (fees = [], color,demanddata=[]) => {
    let estimateCard = {};

    let total = totalAmount(fees);
    let totaldemand = totalAmount(demanddata);

    let card = [];
    let row1 = []

    row1.push(getLabel(' ', 'amount'))
    row1.push(getLabel(' ', 'amount'))
    row1.push({ ...getLabel(getLocaleLabels('BILL_PT_TOTAL_AMT', 'BILL_PT_TOTAL_AMT'), 'amount'), "alignment": "right" })
    card.push(row1);
    let row2 = []

    row2.push(getLabel(' ', 'amount'))
    row2.push(getLabel(' ', 'amount'))
    row2.push({ ...getLabel(total, 'amount'), style: "pdf-application-no-value", "alignment": "right" })
    card.push(row2);
    let rowLast = []

    rowLast.push(getLabel(getLocaleLabels('TL_COMMON_TOTAL_AMT', 'TL_COMMON_TOTAL_AMT'), 'totalAmount')); 
    if(demanddata.length>0 ){
        rowLast.push(getLabel(totaldemand, 'totalAmount'))
        rowLast.push(getLabel(total, 'totalAmount'))
    }
    else{
        rowLast.push(getLabel(total, 'totalAmount'))
        rowLast.push(getLabel(' ', 'header'))
    }
    
    

    if(demanddata.length >0 ){
        demanddata.map(demand => {
            let row = [];  
            row.push(getLabel(getLocaleLabels(demand.name.labelName, demand.name.labelKey), 'value'))
            row.push(getLabel(demand.value, 'nonZero'))
            let found = false;
            fees.map(fee => {
               
                if(demand.name.labelKey == fee.name.labelKey) 
                { 
                    found =true;
                    row.push(getLabel(fee.value, 'nonZero'))
                          
                    
                }

            })
            if(found==false){
                row.push(getLabel(0, 'nonZero'))

            }

            
            card.push(row);
        })
        }
    
        else{
            fees.map(fee => {
            let row = [];

            row.push(getLabel(getLocaleLabels(fee.name.labelName, fee.name.labelKey), 'value'))
            row.push(getLabel(fee.value, 'nonZero'))
            row.push(getLabel(' ', 'value'))
            card.push(row);
            });
        }

   

    card.push(rowLast);

    let infocard = [];

    
    infocard.push({ ...getLabel(getLocaleLabels('TL_COMMON_TR_INFO', 'TL_COMMON_TR_INFO'), 'amount'),style:"pdf-description", "alignment": "left" })
    infocard.push(getLabel(' ', ''))
    infocard.push(getLabel(' ', ''))
    card.push(infocard);


    estimateCard = getCustomCard(card, [250, 150, 108], tableborder, color)
    return estimateCard;
}

export const loadUlbLogo = tenantid => {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    if(tenantid)
    var cbCode = tenantid.split(".")[1];
    img.onload = function () {
        var canvas = document.createElement("CANVAS");
        var ctx = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        store.dispatch(
            prepareFinalObject("UlbLogoForPdf", canvas.toDataURL())
        );
        localStorage.setItem("UlbLogoForPdf", canvas.toDataURL());
        canvas = null;
    };
   // img.src = `/${commonConfig.tenantId}-egov-assets/${tenantid}/logo.png`;
    var imagePath = process.env.REACT_APP_IMAGE_PATH;
   //img.src = `https://raw.githubusercontent.com/belegovgithub/webaccess/master/images/${cbCode}/logo.png`;
   img.src = imagePath+`/${cbCode}/logo.png`;
};

const getHeaderCard = (applicationData, logo) => {
    let applicationHeader = {
        style: applicationData.qrcode ? "pdf-head-qr-code" : "pdf-header",
        table: {
            widths: applicationData.qrcode ? [120, "*", 120] : [120, "*", 40],
            body: []
        },
        layout: "noBorders"
    }
    let body = [];
    body.push({
        image: logo,
        width: 60,
        height: 61.25,
        margin: [51, 12, 10, 10]
    })
    body.push({
        stack: [
            {
                text: getLocaleLabels(("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase(), ("TENANT_TENANTS_" + applicationData.tenantId.replace('.', '_')).toUpperCase()) + " " + getLocaleLabels(("CANTONMENT", "CORE_COMMON_CITY").toUpperCase(), ("CANTONMENT BOARD", "PDF_STATIC_LABEL_CONSOLIDATED_TLCERTIFICATE_MUNICIPAL_CORPORATION").toUpperCase()),
                style: "pdf-header-text"
            },
            {
                text: getLocaleLabels(applicationData.header, applicationData.header).replace('{0}',  applicationData.finYear)  || "",
                style: "pdf-header-sub-text",
            }
        ],
        alignment: "left",
        margin: [10, 13, 0, 0]
    });
    if (applicationData.qrcode) {
        body.push({
            image: applicationData.qrcode,
            width: 70,
            height: 70,
            margin: [50, 8, 8, 8],
            alignment: "right"
        })
    }

    applicationHeader.table.body.push(body)
    return applicationHeader

}
export const generatePDF = (logo, applicationData = {}, fileName) => {
    logo = logo || localStorage.getItem("UlbLogoForPdf");
    let data;
    let tableborder = {
        hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0.1 : 0.1;
        },
        vLineWidth: function (i, node) {
            return i === 0 || i === node.table.widths.length ? 0.1 : 0.1;
        },
        hLineColor: function (i, node) {
            return i === 0 || i === node.table.body.length ? "#979797" : "#979797";
        },
        vLineColor: function (i, node) {
            return i === 0 || i === node.table.widths.length ? "#979797" : "#979797";
        },
    };


    let borderKey = [true, true, false, true];
    let borderValue = [false, true, true, true];
    let receiptTableWidth = ["*", "*", "*", "*"];
    let fontStyle = getDefaultFontStyle(getLocale());
    console.log("fontStyle--",fontStyle); 
    data = {
        defaultStyle: {
            font: fontStyle
        },
        content: [

            { ...getHeaderCard(applicationData, logo) }
            ,
            {
                "style": "pdf-application-no",
                "columns": [
                    {
                        "text": [
                            {
                                "text": applicationData.applicationNoHeader ? getLocaleLabels(applicationData.applicationNoHeader, applicationData.applicationNoHeader) + " : ": '',
                                bold: true
                            },
                            {
                                "text": applicationData.applicationNoValue ? getLocaleLabels(applicationData.applicationNoValue, applicationData.applicationNoValue) : '',
                                italics: true,
                                "style": "pdf-application-no-value"
                            },
                            {
                                "text": applicationData.applicationStatusValue ? getLocaleLabels(applicationData.applicationStatusValue, applicationData.applicationStatusValue) : '',
                               
                                "style": {
                                    "color": "red"
                                }
                                
                            }
                        ],
                        "alignment": "left"
                    },
                    {
                        "text": [
                            {
                                "text": applicationData.additionalHeader ? getLocaleLabels(applicationData.additionalHeader, applicationData.additionalHeader) + " : " : '',
                                bold: true
                            },
                            {
                                "text": applicationData.additionalHeaderValue ? getLocaleLabels(applicationData.additionalHeaderValue, applicationData.additionalHeaderValue) : '',
                                italics: true,
                                "style": "pdf-application-no-value"
                            }
                        ],
                        "alignment": "right"
                    }
                ]
            }
        ],
        pageBreakAfter: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
            //check if signature part is completely on the last page, add pagebreak if not

            let nodeLength = followingNodesOnPage.length;
            followingNodesOnPage.map((node, ind) => {
                if (node.style == 'pdf-table-card') {
                    nodeLength = ind;
                }
            })
            if (currentNode.startPosition.verticalRatio > 0.59 && currentNode.style == 'pdf-card-title') {
                return true;
            }
            if (currentNode.startPosition.verticalRatio > 0.75 && currentNode.style == 'pdf-card-title' && nodeLength > 19) {
                return true;
            }
            return false;
        },
        styles: {
            "pdf-header": {
                "fillColor": "#F2F2F2",
                "margin": [
                    -70,
                    -41,
                    -81,
                    10
                ]
            },
            "pdf-application-no-value": {
                "fontSize": 12,
                "font": "Roboto",
                italics: true,
                "margin": [
                    -18,
                    8,
                    0,
                    0
                ],
                "color": "#484848"
            },
            "pdf-header-text": {
                "color": "#484848",
                "fontSize": 20,
                bold: true,
                "letterSpacing": 0.74,
                "margin": [
                    0,
                    0,
                    0,
                    5
                ]
            },
            "pdf-header-sub-text": {
                "color": "#484848",
                "fontSize": 15,
                "letterSpacing": 0.6
            },
            "pdf-application-no": {
                "fontSize": 12,
                bold: true,
                "margin": [
                    -18,
                    8,
                    0,
                    0
                ],
                "color": "#484848"
            },
            "pdf-card-title": {
                "fontSize": 11,
                bold: true,
                "margin": [
                    -18,
                    16,
                    8,
                    8
                ],
                "color": "#484848",
                "fontWeight": 500
            },
            "pdf-card-no-title": {
                "fontSize": 11,
                bold: true,
                "color": "#484848",
                "fontWeight": 500
            },
            "pdf-table-card-white": {
                "fillColor": "white",
                "fontSize": 7,
                "color": "#484848",
                "margin": [
                    -20,
                    -2,
                    -8,
                    -8
                ]
            },
            "pdf-table-card": {
                "fillColor": "#F2F2F2",
                "fontSize": 7,
                "color": "#484848",
                "margin": [
                    -20,
                    -2,
                    -8,
                    -8
                ]
            },
            "pdf-card-key": {
                "color": "rgba(0, 0, 0, 0.54)",
                "fontSize": 8,
                "margin": [
                    0,
                    1,
                    0,
                    0
                ]
            },
            "pdf-card-sub-header": {
                "color": "rgba(0, 0, 0, 0.94)",
                "fontSize": 9,
                bold: true,
                "margin": [
                    0,
                    3,
                    0,
                    0
                ]
            },
            "pdf-card-value": {
                "fontSize": 10,
                "color": "rgba(0, 0, 0, 0.87)",
                "margin": [
                    0,
                    0,
                    0,
                    1
                ]
            },
            "pdf-head-qr-code": {
                fillColor: "#F2F2F2",
                margin: [-70, -41, -81, 0]
            },
            "pdf-description": {
                "fontSize": 10,
                "color": "#c00000",
                
            },
        },
    };
    applicationData.cards.map(card => {
        switch (card.type) {
            case "singleItem":
                if (!card.hide) {
                    if(card.items.length>0)
                    data.content.push(...getCardWithHeader(card.header, card.items, card.color));
                }
                break;
            case "header":
                if (!card.hide && card.header) {
                    data.content.push(...getHeader(card.header));
                }
                break;
            case "multiItem":
                if (!card.hide) {
                    data.content.push(...getMultiItemCard(card.header, card.items, card.color));
                }
                break;
            case "estimate":
                if (!card.hide) {
                    data.content.push({ ...card.items });
                }
                break;
            default:
                if (!card.hide) {
                    data.content.push(...getCardWithHeader(card.header, card.items, card.color));
                }
        }
    })

    pdfMake.vfs = vfs;
    pdfMake.fonts = font;
    try {
        if (fileName != 'print') {
            const pdfData = pdfMake.createPdf(data);
            downloadPDFFileUsingBase64(pdfData, fileName);
        } else {
            const pdfData = pdfMake.createPdf(data);
            printPDFFileUsingBase64(pdfData, fileName);
            // data && pdfMake.createPdf(data).open();
        }
    } catch (e) {
        console.log(JSON.stringify(data), 'pdfdata');
        console.log('error in generating pdf', e);
    }

};
const mobileCheck = ()=> {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

export const downloadPDFFileUsingBase64 = (receiptPDF, filename) => {
    receiptPDF.getBase64((data) => {     
        console.log("Base 64:",data);
    });
    
    if (typeof mSewaApp === "undefined" )
    {
      // we are running in browser
      console.log("mSewaApp is undefined");
      receiptPDF.download(filename);
      if(JSON.parse(localStorageGet('isMobileApp')) == true)
      {
        receiptPDF.getBase64(data => {
            window.flutter_inappwebview.callHandler('downloadBase64File',data, filename);
   
          })
        
      }
    } else {
      // we are running under webview
      receiptPDF.getBase64(data => {
        mSewaApp.downloadBase64File(data, filename);
      });
    }
  }
  
  export const openPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined" )
    {
      // we are running in browser
      receiptPDF.open();
    } else {
      // we are running under webview
      receiptPDF.getBase64(data => {
        mSewaApp.downloadBase64File(data, filename);
      });
    }
  }
  
  export const printPDFFileUsingBase64 = (receiptPDF, filename) => {
    if (typeof mSewaApp === "undefined" )
    {
      // we are running in browser
      receiptPDF.print();
    } else {
      // we are running under webview
      receiptPDF.getBase64(data => {
        mSewaApp.downloadBase64File(data, filename);
      });
    }
  }

