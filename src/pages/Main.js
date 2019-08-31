import React, { useState, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import Zoom from "@material-ui/core/Zoom";
import { format, endOfWeek, addDays } from "date-fns";
import locale from "date-fns/locale/fr";
import capitalize from "lodash/capitalize";
import Form from "../components/Form";
import createDefaultLiturgy from "../config/defaultLiturgy";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(20)
  },
  header: {
    background: "linear-gradient(344deg, #0077d1 0%, #0091ff 100%)",
    height: 184,
    marginBottom: -48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  pageTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 26,
    marginTop: -48
  },
  content: {
    maxWidth: 770,
    margin: [[0, "auto"]]
  },
  save: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4)
  }
}));

function getNextSundayDate() {
  return endOfWeek(new Date(), { weekStartsOn: 1 });
}

function formatDate(date) {
  if (date.getDate() === 1) {
    return format(date, "EEEE '1er' MMMM", { locale });
  }

  return format(date, "EEEE d MMMM", { locale });
}

export default ({ firebase }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [currentDate] = useState(getNextSundayDate());
  const [loaded, setLoaded] = useState(false);
  const [changed, setChanged] = useState(false);
  const [doc, setDoc] = useState({ blocks: [] });

  const db = firebase.firestore();
  const id = format(currentDate, "yMMdd");

  const createDoc = () => {
    db.collection("liturgies")
      .doc(id)
      .set(createDefaultLiturgy())
      .then(() => {
        fetchDoc();
      });
  };

  const updateDoc = () => {
    db.collection("liturgies")
      .doc(id)
      .set(doc);
  };

  const fetchDoc = () => {
    db.doc(`liturgies/${id}`)
      .get()
      .then(doc => {
        if (!doc.exists) {
          createDoc();
        } else {
          setLoaded(true);
          setDoc(doc.data());
        }
      });
  };

  useEffect(() => {
    if (!loaded) {
      fetchDoc();
    }
  });

  const handleBlocksChange = blocks => {
    setDoc({ ...doc, blocks });
    setChanged(true);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.content}>
          <Typography
            color="inherit"
            className={classes.pageTitle}
            variant="h4"
          >
            {capitalize(formatDate(currentDate))}
          </Typography>
        </div>
      </div>
      <div className={classes.content}>
        <Paper elevation={5} square>
          <Form blocks={doc.blocks} onChange={handleBlocksChange} />
        </Paper>
      </div>

      <Zoom
        in={changed}
        timeout={200}
        style={{
          transitionDelay: `${changed ? transitionDuration.exit : 0}ms`
        }}
        unmountOnExit
      >
        <Fab
          aria-label="Sauvegarder"
          className={classes.save}
          color="secondary"
          onClick={updateDoc}
        >
          <SaveIcon />
        </Fab>
      </Zoom>
    </div>
  );
};
