const commonDocuments = [
  {
    "name": "APPLICANT.IDENTITYPROOF",
    "code": "APPLICANT.IDENTITYPROOF",
    "required": true,
    "dropdown": {
      "label": "OBM_SELECT_DOC_LABEL",
      "required": true,
      "menu": [
        {
          "code": "APPLICANT.IDENTITYPROOF.AADHAAR",
          "label": "APPLICANT_IDENTITYPROOF_AADHAAR"
        },
        {
          "code": "APPLICANT.IDENTITYPROOF.VOTERID",
          "label": "APPLICANT_IDENTITYPROOF_VOTERID"
        },
        {
          "code": "APPLICANT.IDENTITYPROOF.PAN",
          "label": "APPLICANT_IDENTITYPROOF_PAN"
        },
        {
          "code": "APPLICANT.IDENTITYPROOF.DRIVING",
          "label": "APPLICANT_IDENTITYPROOF_DRIVING"
        },
        {
          "code": "APPLICANT.IDENTITYPROOF.PASSPORT",
          "label": "APPLICANT_IDENTITYPROOF_PASSPORT"
        }
      ]
    }
  },
  {
    "name": "APPLICANT.ADDRESSPROOF",
    "code": "APPLICANT.ADDRESSPROOF",
    "required": true,
    "dropdown": {
      "label": "OBM_SELECT_DOC_LABEL",
      "required": true,
      "menu": [
        {
          "code": "APPLICANT.ADDRESSPROOF.ELECTRICITYBILL",
          "label": "APPLICANT_ADDRESSPROOF_ELECTRICITYBILL"
        },
        {
          "code": "APPLICANT.ADDRESSPROOF.TELEPHONEBILL",
          "label": "APPLICANT_ADDRESSPROOF_TELEPHONEBILL"
        },
        {
          "code": "APPLICANT.ADDRESSPROOF.WATERBILL",
          "label": "APPLICANT_ADDRESSPROOF_WATERBILL"
        },
        {
          "code": "APPLICANT.ADDRESSPROOF.RATIONCARD",
          "label": "APPLICANT_ADDRESSPROOF_RATIONCARD"
        },
        {
          "code": "APPLICANT.ADDRESSPROOF.DL",
          "label": "APPLICANT_ADDRESSPROOF_DL"
        }
        // ,{
        //   "code": "APPLICANT.ADDRESSPROOF.VOTERID",
        //   "label": "APPLICANT_ADDRESSPROOF_VOTERID"
        // },
        // {
        //   "code": "APPLICANT.ADDRESSPROOF.AADHAAR",
        //   "label": "APPLICANT_ADDRESSPROOF_AADHAAR"
        // },
        // {
        //   "code": "APPLICANT.ADDRESSPROOF.PASSPORT",
        //   "label": "APPLICANT_ADDRESSPROOF_PASSPORT"
        // }
      ]
    }
  },
  {
    "name": "APPLICANT.BANKACCOUNTPROOF",
    "code": "APPLICANT.BANKACCOUNTPROOF",
    "required": true,
    "dropdown": {
      "label": "OBM_SELECT_DOC_LABEL",
      "required": true,
      "menu": [
        {
          "code": "APPLICANT.BANKACCOUNTPROOF.PASSBOOKPHOTO",
          "label": "APPLICANT_BANKACCOUNTPROOF_PASSBOOKPHOTO"
        }
      ]
    }
  }
];

const bplDocuments =  [{
  "name": "APPLICANT.BPLPROOF",
  "code": "APPLICANT.BPLPROOF",
  "required": true,
  "dropdown": {
    "label": "OBM_SELECT_DOC_LABEL",
    "required": true,
    "menu": [
      {
        "code": "APPLICANT.BPLPROOF.BPLCARD",
        "label": "APPLICANT_BPLPROOFF_BPLCARD"
      },
      {
        "code": "APPLICANT.BPLPROOF.RATIONCARD",
        "label": "APPLICANT_BPLPROOF_RATIONCARD"
      }
    ]
  }
}];

const specialCategoryDocuments = [{
  "name": "APPLICANT.SPECIALCATEGORYPROOF",
  "code": "APPLICANT.SPECIALCATEGORYPROOF",
  "required": true,
  "dropdown": {
    "label": "OBM_SELECT_DOC_LABEL",
    "required": true,
    "menu": [
      {
        "code": "APPLICANT.SPECIALCATEGORYPROOF.IDCARD",
        "label": "APPLICANT_SPECIALCATEGORYPROOF_IDCARD"
      },
      {
        "code": "APPLICANT.SPECIALCATEGORYPROOF.PAYSLIP",
        "label": "APPLICANT_SPECIALCATEGORYPROOF_PAYSLIP"
      }
    ]
  }
}];

export const getDocumentsList = (type) =>{
  let cards = [];
  switch(type)
  {
    case 'CATEGORY.BPL':
      cards = [...commonDocuments,...bplDocuments];
      break;
    case 'CATEGORY.ELECTED_MEMBER':
    case 'CATEGORY.RETD_CANTT_STAFF':
    case 'CATEGORY.CANTT_STAFF':
      cards = [...commonDocuments,...specialCategoryDocuments]
      break;
    default:
      cards = [...commonDocuments];
      break;
  }
  let documentList = [{
    "code": "APPLICANT",
    "title": "APPLICANT",
    "cards": cards
  }];

  return documentList;
}


