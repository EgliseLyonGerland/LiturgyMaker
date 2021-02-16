import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
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
import { useForm } from 'react-hook-form';
import { format, subDays, addDays } from 'date-fns';
import locale from 'date-fns/locale/fr';
import capitalize from 'lodash/capitalize';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';

import Code from '../components/Code';
import SaveButton from '../components/SaveButton';
import BlocksField from '../components/fields/BlocksField';
// import Preview from '../components/Preview';
import generateCode from '../utils/generateCode';
import {
  fetchLiturgy,
  persistLiturgy,
  selectLiturgyById,
} from '../redux/slices/liturgies';
import { fetchSongs, selectAllSongs } from '../redux/slices/songs';
import {
  fetchRecitations,
  selectAllRecitations,
} from '../redux/slices/recitations';
import { converToDate, convertToId, getNextLiturgyId } from '../utils/liturgy';

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
  const store = useStore();
  const { liturgyId } = useParams();
  const [displayCode, setDisplayCode] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(true);
  const dispatch = useDispatch();
  const liturgyState = useSelector((state) =>
    selectLiturgyById(state, liturgyId),
  );
  const songsStatus = useSelector((state) => state.songs.status);
  const songs = useSelector(selectAllSongs);
  const recitationsStatus = useSelector((state) => state.recitations.status);
  const recitations = useSelector(selectAllRecitations);

  const {
    register,
    control,
    handleSubmit: onSubmit,
    reset: resetForm,
    getValues: getFormValues,
    setValue: setFormValue,
    // formState: { isDirty },
  } = useForm();

  const currentDate = converToDate(liturgyId);

  const loading =
    songsStatus === 'loading' ||
    recitationsStatus === 'loading' ||
    !liturgyState;

  const debouncedFetchLiturgy = useRef(
    debounce((date) => {
      dispatch(fetchLiturgy(date));
    }, 500),
  );

  useEffect(() => {
    if (liturgyState) {
      resetForm(cloneDeep(liturgyState));
    }
  }, [liturgyState, resetForm]);

  useEffect(() => {
    if (songsStatus === 'idle') {
      dispatch(fetchSongs());
    }
    if (recitationsStatus === 'idle') {
      dispatch(fetchRecitations());
    }
    if (!liturgyState) {
      debouncedFetchLiturgy.current(liturgyId);
    }
  }, [liturgyId, dispatch, liturgyState, recitationsStatus, songsStatus]);

  const handleChangeDate = (date) => {
    history.push(`/liturgies/${getNextLiturgyId(date)}/edit`);
  };

  const handleSubmit = async (data) => {
    setPersisting(true);
    await dispatch(
      persistLiturgy({
        ...liturgyState,
        blocks: data.blocks,
      }),
    );
    setPersisted(true);
    setPersisting(false);
  };

  const handleFillFromLastWeek = async (index) => {
    const previousDate = subDays(currentDate, 7);
    const previousId = convertToId(previousDate);

    await dispatch(fetchLiturgy(previousId));

    const previousLiturgy = selectLiturgyById(store.getState(), previousId);

    if (!previousLiturgy) {
      return null;
    }

    const { blocks } = getFormValues();
    const currentBlock = blocks[index];

    const currentBlockNumber = blocks
      .filter((block) => block.type === currentBlock.type)
      .findIndex((block) => block.id === currentBlock.id);

    const sameTypeBlocks = previousLiturgy.blocks.filter(
      (block) => block.type === currentBlock.type,
    );

    if (sameTypeBlocks.length === 0) {
      return null;
    }

    const previousBlock =
      sameTypeBlocks[currentBlockNumber] || sameTypeBlocks.pop();

    setFormValue(`blocks[${index}].data`, previousBlock.data);
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
      return <Code code={generateCode(liturgyState, { songs, recitations })} />;
    }

    return (
      <div>
        <BlocksField
          name="blocks"
          register={register}
          control={control}
          onFillFromLastWeekClicked={handleFillFromLastWeek}
        />

        <SaveButton
          persisting={persisting}
          persisted={persisted}
          dirty={true}
          onClick={onSubmit(handleSubmit)}
          onHide={() => setPersisted(false)}
        />
      </div>
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
    </div>
  );
};

export default Liturgies;
