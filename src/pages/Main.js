import React, { useState, useEffect, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import SaveIcon from "@material-ui/icons/Save";
import Zoom from "@material-ui/core/Zoom";
import PacmanLoader from "react-spinners/PacmanLoader";
import { format, endOfWeek, subDays, addDays } from "date-fns";
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
    justifyContent: "center",
    color: "white"
  },
  pageTitle: {
    fontWeight: "bold",
    fontSize: 22,
    margin: theme.spacing(0, 2),
    width: 350,
    textAlign: "center"
  },
  content: {
    maxWidth: 770,
    margin: [[0, "auto"]],
    display: "grid",
    minHeight: "80vh"
  },
  save: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4)
  },
  spinner: {
    display: "flex",
    height: 200,
    alignItems: "center",
    justifyContent: "center"
  }
}));

function getNextSundayDate(from) {
  return endOfWeek(from, { weekStartsOn: 1 });
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
  const [currentDate, setCurrentDate] = useState(getNextSundayDate(new Date()));
  const [loaded, setLoaded] = useState(false);
  const [changed, setChanged] = useState(false);
  const [doc, setDoc] = useState({ blocks: [] });
  const timer = useRef(null);

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
        setLoaded(true);

        if (!doc.exists) {
          setDoc(createDefaultLiturgy());
        } else {
          setDoc(doc.data());
        }
      });
  };

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (!loaded) {
      timer.current = setTimeout(fetchDoc, 500);
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
        <IconButton
          aria-label="delete"
          className={classes.margin}
          color="inherit"
          onClick={() => {
            let date = subDays(currentDate, 7);
            setCurrentDate(getNextSundayDate(date));
            setLoaded(false);
          }}
        >
          <ArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <Typography color="inherit" className={classes.pageTitle} variant="h4">
          {capitalize(formatDate(currentDate))}
        </Typography>
        <IconButton
          aria-label="delete"
          className={classes.margin}
          color="inherit"
          onClick={() => {
            let date = addDays(currentDate, 7);
            setCurrentDate(getNextSundayDate(date));
            setLoaded(false);
          }}
        >
          <ArrowRightIcon fontSize="inherit" />
        </IconButton>
      </div>
      <div className={classes.content}>
        <Paper elevation={5} square>
          {loaded ? (
            <Form blocks={doc.blocks} onChange={handleBlocksChange} />
          ) : (
            <div className={classes.spinner}>
              <PacmanLoader color="#DDD" />
            </div>
          )}
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
