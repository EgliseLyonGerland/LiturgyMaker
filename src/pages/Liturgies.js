import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import CodeIcon from '@material-ui/icons/Code';
import CloseIcon from '@material-ui/icons/Close';
import BeatLoader from 'react-spinners/BeatLoader';
import { format, endOfWeek, subDays, addDays } from 'date-fns';
import locale from 'date-fns/locale/fr';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import classnames from 'classnames';
import Form from '../components/Form';
import Code from '../components/Code';
// import Preview from '../components/Preview';
import generateCode from '../utils/generateCode';
import {
  fetchLiturgy,
  persistLiturgy,
  selectLiturgyById,
  setLiturgy,
  addLiturgyBlock,
  removeLiturgyBlock,
  fillBlockFromPreviousWeek,
} from '../redux/slices/liturgies';
import { fetchSongs, selectAllSongs } from '../redux/slices/songs';
import {
  fetchRecitations,
  selectAllRecitations,
} from '../redux/slices/recitations';

const gutters = 3;

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '50vh',
  },
  preview: {
    margin: theme.spacing(gutters * 2, gutters),
    maxWidth: 600,
    flexGrow: 1,

    '& > *': {
      position: 'sticky',
      top: theme.spacing(gutters * 2),
    },
  },
  content: {
    display: 'grid',
    minHeight: '80vh',
    gridTemplateRows: 'auto 1fr',
    // marginTop: -theme.spacing(8),
  },
  navBar: {
    display: 'flex',
    height: theme.spacing(8),
    padding: theme.spacing(0, 2),
    alignItems: 'center',

    '&:before': {
      content: '""',
      width: 50,
    },
  },
  sundays: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 700,
    margin: [[0, 'auto']],
  },
  sundaysName: {
    width: 250,
    textAlign: 'center',
  },
  actions: {
    width: 50,
  },
  cta: {
    position: 'fixed',
    bottom: theme.spacing(4),
    left: '50%',
    width: 200,
    marginLeft: -200 / 2,
    transition: 'background .3s',
  },
  ctaDisabled: {
    background: `${theme.palette.secondary.main} !important`,
    color: 'white !important',
  },
  ctaSaved: {
    background: `#17d86d !important`,
  },
  ctaIcon: {
    marginRight: theme.spacing(1),
  },
  spinner: {
    display: 'flex',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  [theme.breakpoints.down('md')]: {
    preview: {
      display: 'none',
    },
    navBar: {
      padding: 0,

      '&:before': {
        display: 'none',
      },
    },
    sundays: {
      fontSize: 16,
    },
    sundaysName: {
      width: 'auto',
    },
    actions: {
      display: 'none',
    },
  },
}));

const getNextSundayDate = (from) => endOfWeek(from, { weekStartsOn: 1 });

const formatDate = (date) => {
  if (date.getDate() === 1) {
    return format(date, "EEEE '1er' MMMM", { locale });
  }

  return format(date, 'EEEE d MMMM', { locale });
};

const Liturgies = () => {
  const classes = useStyles();
  const [currentDate, setCurrentDate] = useState(getNextSundayDate(new Date()));
  const [saved, setSaved] = useState(false);
  const [displayCode, setDisplayCode] = useState(false);
  const [focusedBlock, setFocusedBlock] = useState([-1]);
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(true);
  const dispatch = useDispatch();
  const liturgyState = useSelector((state) =>
    selectLiturgyById(state, format(currentDate, 'yMMdd')),
  );
  const songsStatus = useSelector((state) => state.songs.status);
  const songs = useSelector(selectAllSongs);
  const recitationsStatus = useSelector((state) => state.recitations.status);
  const recitations = useSelector(selectAllRecitations);

  const liturgy = cloneDeep(liturgyState);

  const loading =
    songsStatus === 'loading' || recitationsStatus === 'loading' || !liturgy;

  const debouncedFetchLiturgy = useRef(
    debounce((date) => {
      dispatch(fetchLiturgy(date));
    }, 500),
  );

  useEffect(() => {
    if (songsStatus === 'idle') {
      dispatch(fetchSongs());
    }
    if (recitationsStatus === 'idle') {
      dispatch(fetchRecitations());
    }
    if (!liturgy) {
      debouncedFetchLiturgy.current(currentDate);
    }
  }, [currentDate, dispatch, liturgy, recitationsStatus, songsStatus]);

  const handleBlocksChange = (blocks) => {
    setPersisted(false);
    dispatch(setLiturgy({ ...liturgy, blocks }));
  };

  const handleBlockFocus = (index, path) => {
    setFocusedBlock([index, path]);
  };

  const handleBlockBlur = () => {
    setFocusedBlock([-1]);
  };

  const handleChangeDate = (date) => {
    setFocusedBlock([-1]);
    setCurrentDate(getNextSundayDate(date));
  };

  const handleSave = async () => {
    setPersisting(true);

    await dispatch(persistLiturgy(liturgy));

    setPersisting(false);
    setPersisted(true);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleAddBlock = (index, data) => {
    setPersisted(false);
    dispatch(addLiturgyBlock({ id: liturgy.id, index, data }));
  };

  const handleRemoveBlock = (index) => {
    setPersisted(false);
    dispatch(removeLiturgyBlock({ id: liturgy.id, index }));
  };

  const handleFillFromLastWeek = (block) => {
    setPersisted(false);
    dispatch(fillBlockFromPreviousWeek({ id: liturgy.id, block }));
  };

  let zoomKey = 'nothing';
  if (saved) zoomKey = 'saved';
  else if (!persisted) zoomKey = 'save';

  const renderSaveButton = () => {
    if (saved) {
      return (
        <Fab
          variant="extended"
          className={classnames(classes.cta, {
            [classes.ctaSaved]: saved,
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

    if (persisting) {
      return (
        <Fab
          variant="extended"
          className={classnames(classes.cta, {
            [classes.ctaSaved]: saved,
          })}
          color="secondary"
          disabled
          classes={{ disabled: classes.ctaDisabled }}
        >
          <BeatLoader key="saving" color="white" size={8} sizeUnit="px" />
        </Fab>
      );
    }

    if (!persisted) {
      return (
        <Fab
          aria-label="Sauvegarder"
          variant="extended"
          className={classnames(classes.cta, {
            [classes.ctaSaved]: saved,
          })}
          color="secondary"
          onClick={() => handleSave()}
        >
          <SaveIcon className={classes.ctaIcon} />
          Enregistrer
        </Fab>
      );
    }

    return <div />;
  };

  const renderNavBar = () => (
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

  const renderContent = () => {
    if (displayCode) {
      return <Code code={generateCode(liturgy, { songs, recitations })} />;
    }

    return (
      <Form
        blocks={liturgy.blocks}
        onChange={handleBlocksChange}
        onFocus={handleBlockFocus}
        onBlur={handleBlockBlur}
        onAddBlock={handleAddBlock}
        onRemoveBlock={handleRemoveBlock}
        onFillFromLastWeek={handleFillFromLastWeek}
        focusedIndex={focusedBlock[0]}
      />
    );
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        {renderNavBar()}

        {loading ? (
          <div className={classes.spinner}>
            <BeatLoader color="#DDD" />
          </div>
        ) : (
          renderContent()
        )}
        {/* <div className={classes.preview}>
          <Preview
            block={get(liturgy, ['data', 'blocks', currentBlockIndex])}
            currentFieldPath={focusedBlock[1]}
          />
        </div> */}
      </Container>
      <Zoom key={zoomKey} in={true}>
        {renderSaveButton()}
      </Zoom>
    </div>
  );
};

export default Liturgies;
