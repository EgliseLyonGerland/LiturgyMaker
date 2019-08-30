import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 6)
  },
  title: {
    marginBottom: theme.spacing(4)
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
