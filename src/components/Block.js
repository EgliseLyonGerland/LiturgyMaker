import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    marginBottom: theme.spacing(2)
  }
}));

export default ({ title = null, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h6">
        {title}
      </Typography>

      {children}
    </div>
  );
};
