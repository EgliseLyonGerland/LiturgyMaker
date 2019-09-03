import React, { Fragment, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import SaveIcon from "@material-ui/icons/Save";
import CheckIcon from "@material-ui/icons/Check";
import CodeIcon from "@material-ui/icons/Code";
import CloseIcon from "@material-ui/icons/Close";
import Zoom from "@material-ui/core/Zoom";
import BeatLoader from "react-spinners/BeatLoader";
import { format, endOfWeek, subDays, addDays } from "date-fns";
import locale from "date-fns/locale/fr";
import capitalize from "lodash/capitalize";
import isEqual from "lodash/isEqual";
import debounce from "lodash/debounce";
import cloneDeep from "lodash/cloneDeep";
import classnames from "classnames";
import Form from "../components/Form";
import Code from "../components/Code";
import createDefaultLiturgy from "../config/defaultLiturgy";
import generateCode from "../utils/generateCode";

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
    maxWidth: 900,
    margin: [[0, "auto"]],
    display: "grid",
    minHeight: "80vh",
    gridTemplateRows: "auto 1fr"
  },
  actions: {
    display: "flex",
    padding: theme.spacing(1, 2),
    background: "#EEE",
    justifyContent: "flex-end"
  },
  cta: {
    position: "fixed",
    bottom: theme.spacing(4),
    left: "50%",
    width: 200,
    marginLeft: -200 / 2,
    transition: "background .3s"
  },
  ctaDisabled: {
    background: `${theme.palette.secondary.main} !important`,
    color: "white !important"
  },
  ctaSaved: {
    background: `#17d86d !important`
  },
  ctaIcon: {
    marginRight: theme.spacing(1)
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
  const [currentDate, setCurrentDate] = useState(getNextSundayDate(new Date()));
  const [loaded, setLoaded] = useState(false);
  const [changed, setChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [doc, setDoc] = useState({ blocks: [] });
  const [originalDoc, setOriginalDoc] = useState(null);
  const [displayCode, setDisplayCode] = useState(false);
  const timer = useRef(null);

  const checkChanges = useRef(
    debounce((doc1, doc2) => {
      setChanged(!isEqual(doc1.blocks, doc2.blocks));
    }, 500)
  );

  const db = firebase.firestore();
  const id = format(currentDate, "yMMdd");

  const updateDoc = () => {
    setSaving(true);

    db.collection("liturgies")
      .doc(id)
      .set(doc)
      .then(() => {
        setOriginalDoc(cloneDeep(doc));
        setSaved(true);
      });
  };

  const fetchDoc = () => {
    db.doc(`liturgies/${id}`)
      .get()
      .then(doc => {
        let originalDoc;
        if (!doc.exists) {
          originalDoc = createDefaultLiturgy({ date: +currentDate });
        } else {
          originalDoc = doc.data();
        }

        setDoc(cloneDeep(originalDoc));
        setOriginalDoc(originalDoc);
        setLoaded(true);
      });
  };

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (!loaded) {
      timer.current = setTimeout(fetchDoc, 500);
    }

    if (saved) {
      setTimeout(() => {
        setSaved(false);
        setSaving(false);
      }, 2000);
    }

    if (originalDoc && loaded) {
      checkChanges.current(originalDoc, doc);
    }
  });

  const handleBlocksChange = blocks => {
    setDoc({ ...doc, blocks });
  };

  const renderButton = () => {
    if (saved) {
      return (
        <Fab
          variant="extended"
          className={classnames(classes.cta, {
            [classes.ctaSaved]: saved
          })}
          color="secondary"
          disabled
          classes={{ disabled: classes.ctaDisabled }}
        >
          <CheckIcon className={classes.ctaIcon} />
          Enregistré
        </Fab>
      );
    }

    if (saving) {
      return (
        <Fab
          variant="extended"
          className={classnames(classes.cta, {
            [classes.ctaSaved]: saved
          })}
          color="secondary"
          disabled
          classes={{ disabled: classes.ctaDisabled }}
        >
          <BeatLoader key="saving" color="white" size={8} sizeUnit="px" />
        </Fab>
      );
    }

    if (changed) {
      return (
        <Fab
          aria-label="Sauvegarder"
          variant="extended"
          className={classnames(classes.cta, {
            [classes.ctaSaved]: saved
          })}
          color="secondary"
          onClick={updateDoc}
        >
          <SaveIcon className={classes.ctaIcon} />
          Enregistrer
        </Fab>
      );
    }

    return <div />;
  };

  let zoomKey = "nothing";
  if (saved) zoomKey = "saved";
  else if (changed) zoomKey = "save";

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <IconButton
          aria-label="delete"
          className={classes.margin}
          color="inherit"
          onClick={() => {
            let date = subDays(currentDate, 7);
            setLoaded(false);
            setChanged(false);
            setCurrentDate(getNextSundayDate(date));
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
            setLoaded(false);
            setChanged(false);
            setCurrentDate(getNextSundayDate(date));
          }}
        >
          <ArrowRightIcon fontSize="inherit" />
        </IconButton>
      </div>
      <Paper className={classes.content} elevation={5} square>
        {loaded ? (
          <Fragment>
            <div className={classes.actions}>
              <IconButton
                onClick={() => {
                  setDisplayCode(!displayCode);
                }}
              >
                {!displayCode ? <CodeIcon /> : <CloseIcon />}
              </IconButton>
            </div>

            {displayCode ? (
              <Code code={generateCode(doc)} />
            ) : (
              <Form blocks={doc.blocks} onChange={handleBlocksChange} />
            )}
          </Fragment>
        ) : (
          <div className={classes.spinner}>
            <BeatLoader color="#DDD" />
          </div>
        )}
      </Paper>

      <Zoom key={zoomKey} in={true}>
        {renderButton()}
      </Zoom>
    </div>
  );
};
