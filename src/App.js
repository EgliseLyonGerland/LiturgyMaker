import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Auth from "./components/Auth";
import Form from "./components/Form";
import FirebaseContext from "./components/FirebaseContext";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(20)
  },
  header: {
    background: "linear-gradient(344deg, #0077d1 0%, #0091ff 100%)",
    height: 184,
    marginBottom: -48
  },
  content: {
    maxWidth: 770,
    margin: [[0, "auto"]]
  },
  pageTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 32
  },
  inner: {
    padding: theme.spacing(6, 0)
  }
}));

function App({ user, signInWithEmailAndPassword, signOut }) {
  const classes = useStyles();

  if (typeof user === "undefined") {
    return null;
  }

  if (user === null) {
    return <Auth onSubmit={signInWithEmailAndPassword} />;
  }

  return (
    <FirebaseContext.Consumer>
      {firebase => (
        <div className={classes.root}>
          <div className={classes.header}>
            <div className={classes.content}>
              <Typography
                color="inherit"
                className={classes.pageTitle}
                variant="h4"
              ></Typography>
            </div>
          </div>
          <div className={classes.content}>
            <Paper elevation={5} square>
              <div className={classes.inner}>
                <Form firebase={firebase} />
              </div>
            </Paper>
          </div>
        </div>
      )}
    </FirebaseContext.Consumer>
  );
}

export default App;
