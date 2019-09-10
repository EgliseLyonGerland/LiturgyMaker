/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
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
import Preview from "../components/Preview";
import createDefaultLiturgy from "../config/defaultLiturgy";
import generateCode from "../utils/generateCode";
import migrate from "../utils/migrate";

const headerHeight = 176;
const gutters = 3;

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: "50vh"
  },
  header: {
    background: "linear-gradient(344deg, #0077d1 0%, #0091ff 100%)",
    height: headerHeight
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    margin: theme.spacing(0, gutters)
  },
  preview: {
    margin: theme.spacing(gutters * 2, gutters),
    maxWidth: 600,
    flexGrow: 1,

    "& > *": {
      position: "sticky",
      top: theme.spacing(gutters * 2)
    }
  },
  content: {
    width: 800,
    maxWidth: "100%",
    margin: theme.spacing(0, gutters),
    display: "grid",
    minHeight: "80vh",
    gridTemplateRows: "auto 1fr",
    marginTop: -theme.spacing(8)
  },
  navBar: {
    display: "flex",
    height: theme.spacing(8),
    padding: theme.spacing(0, 2),
    background: "#EEE",
    alignItems: "center",

    "&:before": {
      content: '""',
      width: 50
    }
  },
  sundays: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    fontWeight: 700,
    margin: [[0, "auto"]]
  },
  sundaysName: {
    width: 250,
    textAlign: "center"
  },
  actions: {
    width: 50
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
  const [focusedBlock, setFocusedBlock] = useState({});
  const timer = useRef(null);
  const db = firebase.firestore();
  const id = format(currentDate, "yMMdd");

  const checkChanges = useRef(
    debounce((doc1, doc2) => {
      setChanged(!isEqual(doc1.blocks, doc2.blocks));
    }, 500)
  );

  const hidePreview = useRef(
    debounce(() => {
      setFocusedBlock({});
    }, 200)
  );

  const updateDoc = () => {
    setSaving(true);

    db.collection("liturgies")
      .doc(id)
      .set(doc)
      .then(() => {
        setOriginalDoc(cloneDeep(doc));
        setSaved(true);
        setChanged(false);
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
          originalDoc = migrate(doc.data());
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
  }, [currentDate]);

  useEffect(() => {
    if (saved) {
      setTimeout(() => {
        setSaved(false);
        setSaving(false);
      }, 2000);
    }
  }, [saved]);

  useEffect(() => {
    if (originalDoc && loaded) {
      checkChanges.current(originalDoc, doc);
    }
  }, [doc.blocks]);

  const handleBlocksChange = blocks => {
    setDoc({ ...doc, blocks });
  };

  const handleBlockFocus = (block, path) => {
    hidePreview.current.cancel();
    setFocusedBlock({ block, path });
  };

  const handleBlockBlur = () => {
    hidePreview.current();
  };

  const handleChangeDate = date => {
    setLoaded(false);
    setChanged(false);
    setFocusedBlock({});
    setCurrentDate(getNextSundayDate(date));
  };

  let zoomKey = "nothing";
  if (saved) zoomKey = "saved";
  else if (changed) zoomKey = "save";

  const renderSaveButton = () => {
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

  const renderNavBar = () => {
    return (
      <div className={classes.navBar}>
        <div className={classes.sundays}>
          <IconButton
            aria-label="delete"
            className={classes.margin}
            color="inherit"
            onClick={() => {
              handleChangeDate(subDays(currentDate, 7));
            }}
          >
            <ArrowLeftIcon fontSize="inherit" />
          </IconButton>
          <Typography
            className={classes.sundaysName}
            variant="inherit"
            color="textSecondary"
          >
            {capitalize(formatDate(currentDate))}
          </Typography>
          <IconButton
            aria-label="delete"
            className={classes.margin}
            color="inherit"
            onClick={() => {
              handleChangeDate(addDays(currentDate, 7));
            }}
          >
            <ArrowRightIcon fontSize="inherit" />
          </IconButton>
        </div>

        <div className={classes.actions}>
          <IconButton
            onClick={() => {
              setDisplayCode(!displayCode);
            }}
          >
            {!displayCode ? <CodeIcon /> : <CloseIcon />}
          </IconButton>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (displayCode) {
      return <Code code={generateCode(doc)} />;
    }

    return (
      <Form
        blocks={doc.blocks}
        onChange={handleBlocksChange}
        onFocus={handleBlockFocus}
        onBlur={handleBlockBlur}
      />
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}></div>
      <div className={classes.wrapper}>
        <Paper className={classes.content} elevation={0} square>
          {renderNavBar()}

          {loaded ? (
            renderContent()
          ) : (
            <div className={classes.spinner}>
              <BeatLoader color="#DDD" />
            </div>
          )}
        </Paper>
        <div className={classes.preview}>
          <Preview
            block={focusedBlock.block}
            currentFieldPath={focusedBlock.path}
          />
        </div>
      </div>
      <Zoom key={zoomKey} in={true}>
        {renderSaveButton()}
      </Zoom>
    </div>
  );
};
