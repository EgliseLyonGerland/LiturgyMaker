import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Typography,
  useTheme,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BeatLoader from 'react-spinners/BeatLoader'

import {
  fetchRecitations,
  selectAllRecitations,
} from '../redux/slices/recitations'
import { useAppDispatch, useAppSelector } from '../redux/store'

function Recitations() {
  const theme = useTheme()
  const recitationsStatus = useAppSelector(state => state.recitations.status)
  const recitations = useAppSelector(selectAllRecitations)
  const dispatch = useAppDispatch()
  const [expanded, setExpanded] = useState<false | string>(false)

  useEffect(() => {
    if (recitationsStatus === 'idle') {
      dispatch(fetchRecitations())
    }
  }, [dispatch, recitationsStatus])

  const renderToolbar = () => (
    <Box display="flex" sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Box sx={{ ml: 'auto' }}>
        <Button
          component={Link}
          size="small"
          to="/recitations/new"
          variant="contained"
        >
          Nouveau
        </Button>
      </Box>
    </Box>
  )

  if (recitationsStatus !== 'success') {
    return (
      <Box display="flex" justifyContent="center" m={5}>
        <BeatLoader color="#DDD" />
      </Box>
    )
  }

  return (
    <Container maxWidth="md">
      {renderToolbar()}

      <Box>
        {recitations.map(recitation => (
          <Accordion
            elevation={0}
            expanded={expanded === recitation.id}
            key={recitation.id}
            onChange={(event, isExpanded) => {
              setExpanded(isExpanded ? recitation.id : false)
            }}
            sx={{
              'padding': theme.spacing(2, 4),

              '&:first-of-type': {
                borderTopLeftRadius: theme.spacing(0.5),
                borderTopRightRadius: theme.spacing(0.5),
                paddingTop: theme.spacing(3),
              },
              '&:last-child': {
                borderBottomLeftRadius: theme.spacing(0.5),
                borderBottomRightRadius: theme.spacing(0.5),
                paddingBottom: theme.spacing(3),
              },
              '& .MuiAccordion-expanded': {
                borderRadius: 16,
                padding: theme.spacing(4),
              },
            }}
          >
            <AccordionSummary
              sx={{
                'padding': 0,

                '& .MuiAccordionSummary-content': {
                  margin: 0,
                },
                '& .MuiAccordionSummary-expanded': {
                  '&&': {
                    margin: 0,
                    minHeight: 'auto',
                  },
                },
              }}
            >
              <Box>
                <Typography component="span">
                  <b>{recitation.title}</b>
                </Typography>
              </Box>
              <Box alignSelf="center" ml="auto">
                <Button
                  component={Link}
                  size="small"
                  to={`/recitations/${recitation.id}/edit`}
                >
                  Édtier
                </Button>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, display: 'block' }}>
              <Box mt={2} style={{ columnCount: 2, columnGap: 32 }}>
                {recitation.content.length
                  ? (
                      recitation.content.map(({ text }, index) => (
                        <Box
                      // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          mb={2}
                          style={{
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid',
                          }}
                          whiteSpace="pre"
                        >
                          <Typography>{text}</Typography>
                        </Box>
                      ))
                    )
                  : (
                    <i>Aucune parole</i>
                    )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  )
}

export default Recitations
