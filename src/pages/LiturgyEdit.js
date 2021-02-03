import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import CodeIcon from '@material-ui/icons/Code';
import CloseIcon from '@material-ui/icons/Close';
import BeatLoader from 'react-spinners/BeatLoader';
import { format, subDays, addDays } from 'date-fns';
import locale from 'date-fns/locale/fr';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import Form from '../components/Form';
import Code from '../components/Code';
import SaveButton from '../components/SaveButton';
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
import { converToDate, getNextLiturgyId } from '../utils/liturgy';

// const gutters = 3;

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '50vh',
  },
  // preview: {
  //   margin: theme.spacing(gutters * 2, gutters),
  //   maxWidth: 600,
  //   flexGrow: 1,

  //   '& > *': {
  //     position: 'sticky',
  //     top: theme.spacing(gutters * 2),
  //   },
  // },
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
  spinner: {
    display: 'flex',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  [theme.breakpoints.down('md')]: {
    // preview: {
    //   display: 'none',
    // },
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

const formatDate = (date) => {
  if (date.getDate() === 1) {
    return format(date, "EEEE '1er' MMMM", { locale });
  }

  return format(date, 'EEEE d MMMM', { locale });
};

const Liturgies = () => {
  const classes = useStyles();
  const history = useHistory();
  const { liturgyId } = useParams();
  const [displayCode, setDisplayCode] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(true);
  const [dirty, setDirty] = useState(false);
  const dispatch = useDispatch();
  const liturgyState = useSelector((state) =>
    selectLiturgyById(state, liturgyId),
  );
  const songsStatus = useSelector((state) => state.songs.status);
  const songs = useSelector(selectAllSongs);
  const recitationsStatus = useSelector((state) => state.recitations.status);
  const recitations = useSelector(selectAllRecitations);

  const liturgy = cloneDeep(liturgyState);
  const currentDate = converToDate(liturgyId);

  const loading =
    songsStatus === 'loading' || recitationsStatus === 'loading' || !liturgy;

  const debouncedFetchLiturgy = useRef(
    debounce((date) => {
      dispatch(fetchLiturgy(date));
    }, 500),
  );

  useEffect(() => {
    setDirty(false);
  }, [liturgyId]);

  useEffect(() => {
    if (songsStatus === 'idle') {
      dispatch(fetchSongs());
    }
    if (recitationsStatus === 'idle') {
      dispatch(fetchRecitations());
    }
    if (!liturgy) {
      debouncedFetchLiturgy.current(liturgyId);
    }
  }, [liturgyId, dispatch, liturgy, recitationsStatus, songsStatus]);

  const handleBlocksChange = (blocks) => {
    setDirty(true);
    dispatch(setLiturgy({ ...liturgy, blocks }));
  };

  const handleChangeDate = (date) => {
    history.push(`/liturgies/${getNextLiturgyId(date)}/edit`);
  };

  const handleSave = async () => {
    setPersisting(true);
    await dispatch(persistLiturgy(liturgy));
    setPersisting(false);
    setPersisted(true);
    setDirty(false);
  };

  const handleAddBlock = (index, data) => {
    setDirty(true);
    dispatch(addLiturgyBlock({ id: liturgy.id, index, data }));
  };

  const handleRemoveBlock = (index) => {
    setDirty(true);
    dispatch(removeLiturgyBlock({ id: liturgy.id, index }));
  };

  const handleFillFromLastWeek = (block) => {
    setDirty(true);
    dispatch(fillBlockFromPreviousWeek({ id: liturgy.id, block }));
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
        onAddBlock={handleAddBlock}
        onRemoveBlock={handleRemoveBlock}
        onFillFromLastWeek={handleFillFromLastWeek}
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

      <SaveButton
        status={
          persisting ? 'running' : persisted ? 'done' : dirty ? 'ready' : null
        }
        onClick={handleSave}
        onHide={() => setPersisted(false)}
      />
    </div>
  );
};

export default Liturgies;
