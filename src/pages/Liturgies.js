import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import classnames from 'classnames';
import Form from '../components/Form';
import Code from '../components/Code';
// import Preview from '../components/Preview';
import generateCode from '../utils/generateCode';
import * as liturgiesActions from '../redux/actions/liturgies';
import * as songsActions from '../redux/slices/songs';
import * as recitationsActions from '../redux/actions/recitations';

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

const mapStateToProps = ({ liturgies, songs, recitations }) => ({
  liturgies,
  songs,
  recitations,
});

const mapDispatchToProps = {
  ...liturgiesActions,
  ...songsActions,
  ...recitationsActions,
};

const Liturgies = ({
  liturgies,
  fetchLiturgy,
  setLiturgy,
  persistLiturgy,
  addBlock,
  removeBlock,
  fillBlockFromPreviousWeek,
  songs,
  recitations,
  fetchSongs,
  fetchRecitations,
}) => {
  const classes = useStyles();
  const [currentDate, setCurrentDate] = useState(getNextSundayDate(new Date()));
  const [saved, setSaved] = useState(false);
  const [displayCode, setDisplayCode] = useState(false);
  const [focusedBlock, setFocusedBlock] = useState([-1]);
  const id = format(currentDate, 'yMMdd');

  const liturgy = liturgies[id] || null;
  const loading =
    get(liturgy, 'loading', true) ||
    get(songs, 'status', 'loading') === 'loading' ||
    get(recitations, 'loading', true);
  const persisted = get(liturgy, 'persisted', true);
  const persisting = get(liturgy, 'persisting', false);

  const debouncedFetchLiturgy = useRef(
    debounce((date) => {
      fetchLiturgy(date);
    }, 500),
  );

  useEffect(() => {
    if (songs.status === 'idle') {
      fetchSongs();
    }

    if (!recitations.loaded) {
      fetchRecitations();
    }

    debouncedFetchLiturgy.current(currentDate);
  }, [
    currentDate,
    fetchRecitations,
    fetchSongs,
    recitations.loaded,
    songs.status,
  ]);

  const handleBlocksChange = (blocks) => {
    setLiturgy(liturgy.id, { ...liturgy.data, blocks });
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
    await persistLiturgy(liturgy.id);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleAddBlock = (index, data) => {
    addBlock(liturgy.id, index, data);
  };

  const handleRemoveBlock = (index) => {
    removeBlock(liturgy.id, index);
  };

  const handleFillFromLastWeek = (block) => {
    fillBlockFromPreviousWeek(liturgy.id, block);
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
      return (
        <Code
          code={generateCode(liturgy.data, {
            songs: songs.entities,
            recitations: recitations.data,
          })}
        />
      );
    }

    return (
      <Form
        blocks={liturgy.data.blocks}
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

Liturgies.propTypes = {
  liturgies: PropTypes.object,
  fetchLiturgy: PropTypes.func,
  setLiturgy: PropTypes.func,
  persistLiturgy: PropTypes.func,
  addBlock: PropTypes.func,
  removeBlock: PropTypes.func,
  fillBlockFromPreviousWeek: PropTypes.func,
  songs: PropTypes.object,
  recitations: PropTypes.object,
  fetchSongs: PropTypes.func,
  fetchRecitations: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Liturgies);