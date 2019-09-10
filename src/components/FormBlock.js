import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(6, 8)
    },
    title: {
      marginBottom: theme.spacing(2)
    }
  }),
  { name: "FormBlock" }
);

export default ({ title = null, children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {title && (
        <Typography className={classes.title} variant="h6">
          {title}
        </Typography>
      )}

      {children}
    </div>
  );
};
