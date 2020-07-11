import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Link } from "react-router-dom";
import { Button, Card, Image ,Icon} from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import Hidden from "@material-ui/core/Hidden";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";
import $ from 'jquery';
const LoginForm = ({ handleFieldChange, form, logoUrl,qrCodeURL,enableWhatsApp }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const  goToPaymentPage =() =>{
    var newForm = $('<form>', {
      action: 'https://121.242.223.194/SurePayPayment/sp/processRequest',
      method: 'post',
      target: '_top',
    }).append(
      $('<input>', {
        name: 'orderId',
        value: "PB_PG_2020_07_11_000047_71",
        type: 'text',
      })).append(
        $('<input>', {
          name: 'requestDateTime',
          value: "11072020100745",
          type: 'text',
        })).append(
          $('<input>', {
            name: 'successUrl',
            value: "https://13.71.65.215.nip.io/pg-service/transaction/v1/_redirect?originalreturnurl=https://13.71.65.215.nip.io/citizen/egov-common/paymentRedirectPage?eg_pg_txnid%3DPB_PG_2020_07_11_000047_71",
            type: 'text',
          })).append(
            $('<input>', {
              name: 'failUrl',
              value: "https://13.71.65.215.nip.io/pg-service/transaction/v1/_redirect?originalreturnurl=https://13.71.65.215.nip.io/citizen/egov-common/paymentRedirectPage?eg_pg_txnid%3DPB_PG_2020_07_11_000047_71",
              type: 'text',
            })).append(
              $('<input>', {
                name: 'messageType',
                value: "0100",
                type: 'text',
              })).append(
                $('<input>', {
                  name: 'merchantId',
                  value: "UATDEOMDSG0000000198",
                  type: 'text',
                })).append(
                  $('<input>', {
                    name: 'customerId',
                    value: "9eb6f880-c22f-4c1e-8f99-106bb3e0e60a",
                    type: 'text',
                  })).append(
                    $('<input>', {
                      name: 'serviceId',
                      value: "SecunderabadChhawani",
                      type: 'text',
                    })).append(
                      $('<input>', {
                        name: 'currencyCode',
                        value: "INR",
                        type: 'text',
                      })).append(
                        $('<input>', {
                          name: 'transactionAmount',
                          value: "3000",
                          type: 'text',
                        })).append(
                          $('<input>', {
                            name: 'additionalFeild1',
                            value: "",
                            type: 'text',
                          })).append(
                            $('<input>', {
                              name: 'additionalFeild2',
                              value: "",
                              type: 'text',
                            })).append(
                              $('<input>', {
                                name: 'additionalFeild3',
                                value: "",
                                type: 'text',
                              })).append(
                                $('<input>', {
                                  name: 'additionalFeild4',
                                  value: "",
                                  type: 'text',
                                })).append(
                                  $('<input>', {
                                    name: 'additionalFeild5',
                                    value: "",
                                    type: 'text',
                                  })).append(
                                    $('<input>', {
                                      name: 'checksum',
                                      value: "1330509741",
                                      type: 'hidden',
                                    }))
    console.log("Form data", newForm);
    alert("check me ");
    $(document.body).append(newForm);
    newForm.submit();


  };


  return (
    <div className="rainmaker-displayInline">
    <Card
      className={enableWhatsApp?"login-cardwidth user-screens-card":"login-cardwidthmob col-sm-offset-4 col-sm-4 user-screens-card"}
      textChildren={
        <div>
          <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
            <div style={{ marginBottom: "24px" }}>
              <Image className="mseva-logo" source={`${logo}`} />
            </div >
          <div style={{marginLeft:"7px", marginBottom: "24px" }}>
          <Label bold={true}  fontSize= "23px" label="|" />
          </div>
           <div style={{marginLeft:"7px" }}>
              <Label bold={true} color="black" fontSize= "24px" label="STATE_LABEL" />
           </div>
          </div>
          <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
          <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange}  />
          <div style={{ marginBottom: "24px", position: "relative", zIndex: 10 }} className="text-right">
            <Label id="otp-trigger" className="otp-prompt" label="CORE_LOGIN_NO_ACCOUNT" />
            <Link to="/user/register">
              <div style={{ display: "inline-block" }}>
                <Label containerStyle={{ cursor: "pointer" }} id="otp-resend" className="otp-resend" label="CORE_REGISTER_HEADING" />
              </div>
            </Link>
          </div>
          <Button
            {...submit}
            fullWidth={true}
            primary={true}
            onClick={(e) => {
              startSMSRecevier();
            }}
          />
          {/* <Button Label="Payment Link"
            onClick={(e) => {
              goToPaymentPage();
            }}
          /> */}
          {enableWhatsApp&&
           <Hidden mdUp>
          <div>
        <div className="login-hl-divider">
       <div className ="login-circle-mobile">
       <Label  color="black" fontSize= "16px" label="Or"/>
       </div>
    </div>
    <div className="rainmaker-displayInline login-mobile-whatsapp-button"  onClick={()=>{window.location.href="https://api.whatsapp.com/send?phone=918744960111&text=mSeva-send+this+to+start"}} >      
        <Icon action="custom" name="whatsapp" className="login-mobile-whatsapp-icon" />
        <Label bold={true} color="black" fontSize= "14px" label="WHATSAPP_CONTINUE_MOBILE"/>
    </div>
    </div>
      </Hidden>
      }
        </div>
      }
    />
    {/* {enableWhatsApp&&
      <Hidden smDown>
     <div className="login-vl-divider">
       <div className ="login-circle-web">
       <Label  color="black" fontSize= "16px" label="OR"/>
       </div>
    </div>
    <div className="login-qrscan">
       <Image className="login-qrlogo" source={`${qrCodeURL}`} /> 
       <div  className="login-qrtext">
       <Label  color="black" fontSize= "14px" label="WHATSAPP_SCAN_QR_CODE"/>
       </div>
    </div>
    </Hidden>
} */}
    </div>

  );
};

export default LoginForm;
