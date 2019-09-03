import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Block from "../Block";

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(2, 0),
      fontSize: 22,
      fontWeight: 700,
      color: "#777",
      textAlign: "center"
    }
  }),
  {
    name: "SectionBlock"
  }
);

export default ({ block }) => {
  const classes = useStyles();
  let { title } = block.data;

  return (
    <Block>
      <div className={classes.root}>{title}</div>
    </Block>
  );
};
