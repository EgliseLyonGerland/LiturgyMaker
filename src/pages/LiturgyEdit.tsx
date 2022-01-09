import React, { useState, useEffect, useRef } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { SxProps, Theme } from '@mui/material';
import { Container, useTheme, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { format, subDays, addDays } from 'date-fns';
import locale from 'date-fns/locale/fr';
import capitalize from 'lodash/capitalize';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { FormProvider, useForm } from 'react-hook-form';
import { useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import type * as Yup from 'yup';

import Code from '../components/Code';
import BlocksField from '../components/fields/BlocksField';
import SaveButton from '../components/SaveButton';
import { liturgySchema } from '../config/schemas';
import SlideshowWindowManager from '../libs/SlideshowWindowManager';
import {
  fetchLiturgy,
  persistLiturgy,
  selectLiturgyById,
} from '../redux/slices/liturgies';
import {
  fetchRecitations,
  selectAllRecitations,
} from '../redux/slices/recitations';
import { fetchSongs, selectAllSongs } from '../redux/slices/songs';
import { useAppDispatch, useAppSelector } from '../redux/store';
import type { LiturgyDocument } from '../types';
import generateCode from '../utils/generateCode';
import { converToDate, convertToId, getNextLiturgyId } from '../utils/liturgy';

const formatDate = (date: Date) => {
  if (date.getDate() === 1) {
    return format(date, "EEEE '1er' MMMM", { locale });
  }

  return format(date, 'EEEE d MMMM', { locale });
};

function Form({
  liturgy,
  onLiturgyChanged,
}: {
  liturgy: LiturgyDocument;
  onLiturgyChanged: (liturgy: LiturgyDocument) => void;
}) {
  const store = useStore();
  const dispatch = useAppDispatch();
  const [persisting, setPersisting] = useState(false);
  const [persisted, setPersisted] = useState(true);
  const date = converToDate(liturgy.id);

  const form = useForm<LiturgyDocument>({
    mode: 'onChange',
    resolver: yupResolver<Yup.Asserts<Yup.AnyObjectSchema>>(liturgySchema),
  });

  const {
    handleSubmit: onSubmit,
    getValues: getFormValues,
    setValue: setFormValue,
    reset: resetForm,
    formState: { isDirty },
    watch,
  } = form;

  const handleSubmit = async (data: LiturgyDocument) => {
    setPersisting(true);
    await dispatch(persistLiturgy(cloneDeep(data)));
    setPersisted(true);
    setPersisting(false);
  };

  const handleFillFromLastWeek = async (index: number) => {
    const previousDate = subDays(date, 7);
    const previousId = convertToId(previousDate);

    await dispatch(fetchLiturgy(previousId));

    const previousLiturgy = selectLiturgyById(store.getState(), previousId);

    if (!previousLiturgy) {
      return;
    }

    const { blocks } = getFormValues();

    if (!blocks) {
      return;
    }

    const currentBlock = blocks[index];

    const currentBlockNumber = blocks
      .filter((block) => block.type === currentBlock.type)
      // @todo: check below code
      // .findIndex((block) => block.id === currentBlock.id);
      .findIndex((block) => block === currentBlock);

    const sameTypeBlocks = previousLiturgy.blocks.filter(
      (block) => block.type === currentBlock.type,
    );

    if (sameTypeBlocks.length === 0) {
      return;
    }

    const previousBlock =
      sameTypeBlocks[currentBlockNumber] || sameTypeBlocks.pop();

    setFormValue(`blocks.${index}.data`, previousBlock.data);
  };

  useEffect(() => {
    if (liturgy) {
      resetForm(liturgy);
    }
  }, [liturgy, resetForm]);

  useEffect(() => {
    const subscription = watch((value) => {
      onLiturgyChanged(value as LiturgyDocument);
    });
    return () => subscription.unsubscribe();
  }, [onLiturgyChanged, watch]);

  return (
    <FormProvider {...form}>
      <BlocksField
        name="blocks"
        disabled={persisting}
        onFillFromLastWeekClicked={handleFillFromLastWeek}
      />
      <SaveButton
        persisting={persisting}
        persisted={persisted}
        dirty={isDirty}
        onClick={onSubmit(handleSubmit)}
        onHide={() => setPersisted(false)}
      />
    </FormProvider>
  );
}

function LiturgyEdit() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { liturgyId } = useParams<{ liturgyId: string }>();
  const [displayCode, setDisplayCode] = useState(false);
  const dispatch = useAppDispatch();
  const liturgyState = useAppSelector((state) =>
    selectLiturgyById(state, `${liturgyId}`),
  );
  const songsStatus = useAppSelector((state) => state.songs.status);
  const songs = useAppSelector(selectAllSongs);
  const recitationsStatus = useAppSelector((state) => state.recitations.status);
  const recitations = useAppSelector(selectAllRecitations);
  const slideshowWindowRef = useRef(new SlideshowWindowManager());

  const currentDate = converToDate(`${liturgyId}`);

  const loading =
    songsStatus === 'loading' ||
    recitationsStatus === 'loading' ||
    !liturgyState;

  const debouncedFetchLiturgy = useRef(
    debounce((date) => {
      dispatch(fetchLiturgy(date));
    }, 1000),
  );

  const handleChangeDate = (date: Date) => {
    navigate(`/liturgies/${getNextLiturgyId(date)}/edit`);
  };

  const handleLiturgyChanged = (liturgy: LiturgyDocument) => {
    slideshowWindowRef.current.setLiturgy(liturgy);
  };

  const handlePlay = () => {
    slideshowWindowRef.current.open();
  };

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

  useEffect(() => {
    slideshowWindowRef.current.setSongs(songs);
  }, [songs]);

  const actionStyles: SxProps<Theme> = {
    display: { xs: 'none', sm: 'flex' },
    width: 96,
    opacity: 0.7,
  };

  const renderNavBar = () => (
    <Box
      sx={{
        display: 'flex',
        height: theme.spacing(8),
        alignItems: 'center',
      }}
    >
      <Box sx={actionStyles} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 16,
          fontWeight: 700,
          margin: theme.spacing(0, 'auto'),
        }}
      >
        <IconButton
          aria-label="delete"
          color="inherit"
          onClick={() => {
            handleChangeDate(subDays(currentDate, 7));
          }}
          size="large"
        >
          <ArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <Typography
          variant="inherit"
          color="textSecondary"
          sx={{ width: { xs: 'auto', lg: 250 }, textAlign: 'center' }}
        >
          {capitalize(formatDate(currentDate))}
        </Typography>
        <IconButton
          aria-label="delete"
          color="inherit"
          onClick={() => {
            handleChangeDate(addDays(currentDate, 7));
          }}
          size="large"
        >
          <ArrowRightIcon fontSize="inherit" />
        </IconButton>
      </Box>

      <Box position="relative" sx={actionStyles}>
        <IconButton
          onClick={() => {
            setDisplayCode(true);
          }}
          size="large"
        >
          <CodeIcon />
        </IconButton>
        <IconButton onClick={handlePlay} size="large">
          <PlayArrowIcon />
          <Box
            position="absolute"
            bgcolor="red"
            color="white"
            fontSize={10}
            fontWeight="bold"
            borderRadius="2px"
            height={12}
            lineHeight="12px"
            px="2px"
            top={0}
            right={-4}
          >
            beta
          </Box>
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1280, marginBottom: '50vh' }}>
      {renderNavBar()}

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            height: 200,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BeatLoader color="#DDD" />
        </Box>
      ) : (
        <>
          {displayCode && (
            <Code
              code={generateCode(liturgyState, { songs, recitations })}
              onHide={() => {
                setDisplayCode(false);
              }}
            />
          )}

          <Form
            key={liturgyState.id}
            liturgy={liturgyState}
            onLiturgyChanged={handleLiturgyChanged}
          />
        </>
      )}
    </Container>
  );
}

export default LiturgyEdit;
