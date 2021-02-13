import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/Card";
import history from '../../../utils/web.history'
import {getQueryArg} from '../../../actions/commons';
import constants from '../../../actions/constants';
import { last } from "lodash";
const useStyles = makeStyles(styles);

function handleNavigation(page) {
  if(window.location.pathname.includes("citizen-home"))
  {
    //history.push(`${process.env.PUBLIC_URL}/`);
    let cant = getQueryArg(window.location.href,"cant");
    cant = (constants.VALID_TENANT_IDS.indexOf(cant) > -1 )?cant:"";
    if(cant)
      window.location = 'https://echhawani.gov.in/citizen/language-selection?cant='+cant;
    else
      window.location = 'https://echhawani.gov.in/citizen/language-selection';
  }
  else
  {
    history.push(`${process.env.PUBLIC_URL}/`+ page)
  }
}

export default function Card(props) {
  const classes = useStyles();
  const { className, children, color, bgColor, plain, profile, chart, page, ...rest } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [classes[color + "Card"]]: color,
    [classes.cardPlain]: plain,
    [classes.cardProfile]: profile,
    [classes.cardChart]: chart,
    [className]: className !== undefined
  });
  return (
    <div onClick={()=> handleNavigation(page)} style={{  cursor: 'pointer' , height:'100%'}}>
        <div className={cardClasses} {...rest} style={{ backgroundColor: bgColor , height:'80%'}}>
          {children}
        </div>
    </div>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node
};