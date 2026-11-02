import { yupResolver } from '@hookform/resolvers/yup'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import CodeIcon from '@mui/icons-material/Code'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Grid,
  useTheme,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { addDays, format, subDays } from 'date-fns'
import { fr as locale } from 'date-fns/locale/fr'
import { cloneDeep } from 'lodash'
import capitalize from 'lodash/capitalize'
import debounce from 'lodash/debounce'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'
import type * as Yup from 'yup'

import CodeDialog from '../components/CodeDialog'
import BlocksField from '../components/fields/BlocksField'
import SaveButton from '../components/SaveButton'
import { slideshowEnabled } from '../config/global'
import { liturgySchema } from '../config/schemas'
import SlideshowWindowManager from '../libs/SlideshowWindowManager'
import {
  fetchLiturgy,
  persistLiturgy,
  selectLiturgyById,
} from '../redux/slices/liturgies'
import {
  fetchRecitations,
  selectAllRecitations,
} from '../redux/slices/recitations'
import { fetchSongs, selectAllSongs } from '../redux/slices/songs'
import { useAppDispatch, useAppSelector, useAppStore } from '../redux/store'
import type { LiturgyBlock, LiturgyDocument } from '../types'
import generateCode from '../utils/generateCode'
import { converToDate, convertToId, getNextLiturgyId } from '../utils/liturgy'

function formatDate(date: Date) {
  if (date.getDate() === 1) {
    return format(date, 'EEEE \'1er\' MMMM', { locale })
  }

  return format(date, 'EEEE d MMMM', { locale })
}

function Form({
  liturgy,
  disabled,
  onLiturgyChanged,
}: {
  liturgy: LiturgyDocument
  disabled: boolean
  onLiturgyChanged: (liturgy: LiturgyDocument) => void
}) {
  const store = useAppStore()
  const dispatch = useAppDispatch()
  const [persisting, setPersisting] = useState(false)
  const [persisted, setPersisted] = useState(true)
  const date = converToDate(liturgy.id)

  const form = useForm<LiturgyDocument>({
    mode: 'onChange',
    resolver: yupResolver<Yup.Asserts<Yup.AnyObjectSchema>>(liturgySchema),
  })

  const {
    handleSubmit: onSubmit,
    getValues: getFormValues,
    reset: resetForm,
    formState: { isDirty },
    watch,
  } = form

  const handleSubmit = async (data: LiturgyDocument) => {
    setPersisting(true)
    await dispatch(persistLiturgy(data))
    setPersisted(true)
    setPersisting(false)
  }

  const getPreviousWeekBlock = async (
    index: number,
  ): Promise<LiturgyBlock | null> => {
    const { blocks } = getFormValues()
    const currentBlock = blocks[index]

    const previousDate = subDays(date, 7)
    const previousId = convertToId(previousDate)

    await dispatch(fetchLiturgy(previousId))

    const previousLiturgy = selectLiturgyById(store.getState(), previousId)

    if (!previousLiturgy) {
      return null
    }

    if (!blocks) {
      return null
    }

    const currentBlockNumber = blocks
      .filter(block => block.type === currentBlock.type)
      .findIndex(block => block === currentBlock)

    const sameTypeBlocks = previousLiturgy.blocks.filter(
      block => block.type === currentBlock.type,
    )

    if (sameTypeBlocks.length === 0) {
      return null
    }

    return cloneDeep(
      sameTypeBlocks[currentBlockNumber] || sameTypeBlocks.pop(),
    )
  }

  useEffect(() => {
    if (liturgy) {
      resetForm(liturgy)
    }
  }, [liturgy, resetForm])

  useEffect(() => {
    if (!slideshowEnabled) {
      return () => {}
    }

    const subscription = watch((value) => {
      onLiturgyChanged(value as LiturgyDocument)
    })

    return () => subscription.unsubscribe()
  }, [onLiturgyChanged, watch])

  return (
    <FormProvider {...form}>
      <BlocksField
        disabled={disabled || persisting}
        getPreviousWeekBlock={getPreviousWeekBlock}
        name="blocks"
      />
      {!disabled && (
        <SaveButton
          dirty={isDirty}
          onClick={onSubmit(handleSubmit)}
          onHide={() => setPersisted(false)}
          persisted={persisted}
          persisting={persisting}
        />
      )}
    </FormProvider>
  )
}

function LiturgyEdit() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { liturgyId } = useParams<{ liturgyId: string }>()
  const [displayCode, setDisplayCode] = useState(false)
  const [versionNoticeAcknowledged, setVersionNoticeAcknowledged] = useState(false)
  const dispatch = useAppDispatch()
  const liturgyState = useAppSelector(state =>
    selectLiturgyById(state, `${liturgyId}`),
  )
  const songsStatus = useAppSelector(state => state.songs.status)
  const songs = useAppSelector(selectAllSongs)
  const recitationsStatus = useAppSelector(state => state.recitations.status)
  const recitations = useAppSelector(selectAllRecitations)
  const slideshowWindowRef = useRef(new SlideshowWindowManager())

  const currentDate = converToDate(`${liturgyId}`)

  const loading
    = songsStatus === 'loading'
    || recitationsStatus === 'loading'
    || !liturgyState

  const debouncedFetchLiturgy = useRef(
    debounce((date) => {
      dispatch(fetchLiturgy(date))
    }, 1000),
  )

  const handleChangeDate = (date: Date) => {
    navigate(`/liturgies/${getNextLiturgyId(date)}/edit`)
  }

  const handleLiturgyChanged = (liturgy: LiturgyDocument) => {
    slideshowWindowRef.current.setLiturgy(liturgy)
  }

  const handlePlay = () => {
    slideshowWindowRef.current.open()
  }

  useEffect(() => {
    if (songsStatus === 'idle') {
      dispatch(fetchSongs())
    }
    if (recitationsStatus === 'idle') {
      dispatch(fetchRecitations())
    }
    if (!liturgyState) {
      debouncedFetchLiturgy.current(liturgyId)
    }
  }, [liturgyId, dispatch, liturgyState, recitationsStatus, songsStatus])

  useEffect(() => {
    slideshowWindowRef.current.setSongs(songs)
  }, [songs])

  const renderNavBar = () => (
    <Grid container sx={{ height: theme.spacing(8), alignItems: 'center' }}>
      <Grid item md={2} xs={0} />
      <Grid
        item
        md={8}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
        }}
        xs={12}
      >
        <IconButton
          aria-label="delete"
          color="inherit"
          onClick={() => {
            handleChangeDate(subDays(currentDate, 7))
          }}
          size="large"
        >
          <ArrowLeftIcon fontSize="inherit" />
        </IconButton>
        <Typography
          sx={{ width: { xs: 'auto', lg: 250 }, textAlign: 'center' }}
          variant="inherit"
        >
          {capitalize(formatDate(currentDate))}
        </Typography>
        <IconButton
          aria-label="delete"
          color="inherit"
          onClick={() => {
            handleChangeDate(addDays(currentDate, 7))
          }}
          size="large"
        >
          <ArrowRightIcon fontSize="inherit" />
        </IconButton>
      </Grid>
      <Grid
        item
        md={2}
        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}
        xs={0}
      >
        <IconButton
          onClick={() => {
            setDisplayCode(true)
          }}
          size="large"
        >
          <CodeIcon />
        </IconButton>
        {slideshowEnabled && (
          <IconButton onClick={handlePlay} size="large">
            <PlayArrowIcon />
            <Box
              bgcolor="red"
              borderRadius="2px"
              color="white"
              fontSize={10}
              fontWeight="bold"
              height={12}
              lineHeight="12px"
              position="absolute"
              px="2px"
              right={-4}
              top={0}
            >
              beta
            </Box>
          </IconButton>
        )}
      </Grid>
    </Grid>
  )

  return (
    <>
      {!versionNoticeAcknowledged && (
        <Container
          maxWidth={false}
          sx={{
            maxWidth: slideshowEnabled ? 1280 : 900,
          }}
        >
          <Alert
            severity="warning"
            sx={{ mt: 2 }}
            variant="standard"
          >
            <AlertTitle sx={{ fontWeight: 700 }}>
              Nouvelle version disponible
            </AlertTitle>
            <Box>
              Une nouvelle version de la plateforme de saisie des présidences est disponible. Elle remplace cette version, qui sera prochainement supprimée. Merci de ne continuer à utiliser cette version qu’en cas de problème avec la nouvelle.
            </Box>
            <Box display="flex" gap={2} justifyContent="flex-start" px={0} mt={2}>
              <Button
                onClick={() => setVersionNoticeAcknowledged(true)}
                variant="contained"
              >
                J’ai compris
              </Button>
              <Button
                href="https://culte2.egliselyongerland.org"
                rel="noopener noreferrer"
                target="_blank"
                variant="text"
              >
                Accéder à la nouvelle version
              </Button>
            </Box>
          </Alert>
        </Container>
      )}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: slideshowEnabled ? 1280 : 900,
          opacity: versionNoticeAcknowledged ? 1 : 0.2,
          pointerEvents: versionNoticeAcknowledged ? 'auto' : 'none',
        }}
      >
        {renderNavBar()}

        {loading
          ? (
            <Box display="flex" justifyContent="center" m={5}>
              <BeatLoader color="#DDD" />
            </Box>
            )
          : (
            <>
              <CodeDialog
                code={generateCode(liturgyState, { songs, recitations })}
                onHide={() => {
                  setDisplayCode(false)
                }}
                open={displayCode}
              />

              <Form
                key={liturgyState.id}
                liturgy={liturgyState}
                onLiturgyChanged={handleLiturgyChanged}
              />
            </>
            )}
      </Container>
    </>
  )
}

export default LiturgyEdit
