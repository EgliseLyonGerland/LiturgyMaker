import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";

import topBottomLeftTemplate from "../images/templates/topBottomLeft.svg";
import topBottomCenterTemplate from "../images/templates/topBottomCenter.svg";
import topBottomRightTemplate from "../images/templates/topBottomRight.svg";
import bottomTopLeftTemplate from "../images/templates/bottomTopLeft.svg";
import bottomTopCenterTemplate from "../images/templates/bottomTopCenter.svg";
import bottomTopRightTemplate from "../images/templates/bottomTopRight.svg";
import leftRightCenterTemplate from "../images/templates/leftRightCenter.svg";
import rightLeftCenterTemplate from "../images/templates/rightLeftCenter.svg";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gridColumnGap: 16,
      gridRowGap: 16
    },
    item: {
      opacity: 0.5,
      cursor: "pointer",
      transition: "opacity .3s",

      "&:hover": {
        opacity: 1
      }
    },
    current: {
      outline: [["solid", 1, theme.palette.secondary.light]],
      opacity: 0.7
    },
    img: {
      width: "100%",
      display: "block"
    }
  }),
  { name: "Divider" }
);

const templates = [
  "topBottomLeft",
  "topBottomCenter",
  "topBottomRight",
  "leftRightCenter",
  "bottomTopLeft",
  "bottomTopCenter",
  "bottomTopRight",
  "rightLeftCenter"
];

const previews = {
  topBottomLeft: topBottomLeftTemplate,
  topBottomCenter: topBottomCenterTemplate,
  topBottomRight: topBottomRightTemplate,
  bottomTopLeft: bottomTopLeftTemplate,
  bottomTopCenter: bottomTopCenterTemplate,
  bottomTopRight: bottomTopRightTemplate,
  leftRightCenter: leftRightCenterTemplate,
  rightLeftCenter: rightLeftCenterTemplate
};

export default ({ current = "topBottomLeft", onSelect }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {templates.map(name => (
        <div
          key={name}
          className={classnames(classes.item, {
            [classes.current]: name === current
          })}
          onClick={() => {
            onSelect(name);
          }}
        >
          <img className={classes.img} src={previews[name]} alt={name} />
        </div>
      ))}
    </div>
  );
};
