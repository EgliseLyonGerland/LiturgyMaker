import { Check, Save } from '@mui/icons-material'
import { Box, Fab, Zoom, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import type * as React from 'react'
import { createPortal } from 'react-dom'
import BeatLoader from 'react-spinners/BeatLoader'

type Status = 'running' | 'done' | 'ready' | null

const SaveButton: React.FC<{
  persisting: boolean
  persisted: boolean
  dirty: boolean
  onClick: () => void
  onHide: () => void
}> = ({ persisting, persisted, dirty, onClick, onHide }) => {
  const theme = useTheme()

  const [currentStatus, setCurrentStatus] = useState<Status>(null)
  const [displayed, setDisplayed] = useState(false)

  let status: Status = null
  if (persisting) {
    status = 'running'
  }
  else if (persisted) {
    status = 'done'
  }
  else if (dirty) {
    status = 'ready'
  }

  useEffect(() => {
    if (currentStatus === 'done' && displayed) {
      return
    }

    switch (status) {
      case 'running':
      case 'ready': {
        setCurrentStatus(status)
        setDisplayed(true)
        break
      }
      case 'done': {
        setCurrentStatus('done')

        setTimeout(() => {
          setDisplayed(false)
          onHide()
        }, 5000)

        break
      }
      default: {
        setDisplayed(false)
      }
    }
  }, [currentStatus, displayed, onHide, status])

  const renderButton = () => {
    if (currentStatus === 'done') {
      return (
        <Fab
          color="secondary"
          disabled
          style={{
            background: theme.palette.success.main,
            color: 'white',
          }}
          variant="extended"
        >
          <Box display="flex" justifyContent="center" width={168}>
            <Check />
            <Box ml={2}>Enregistré</Box>
          </Box>
        </Fab>
      )
    }

    if (currentStatus === 'running') {
      return (
        <Fab
          color="secondary"
          disabled
          style={{
            background: theme.palette.secondary.main,
            color: 'white',
          }}
          variant="extended"
        >
          <Box display="flex" justifyContent="center" width={168}>
            <BeatLoader color="white" key="saving" size={8} />
          </Box>
        </Fab>
      )
    }

    return (
      <Fab
        aria-label="Enregistrer"
        color="secondary"
        onClick={onClick}
        variant="extended"
      >
        <Box display="flex" justifyContent="center" width={168}>
          <Save />
          <Box ml={2}>Enregistrer</Box>
        </Box>
      </Fab>
    )
  }

  return createPortal(
    <Box
      bottom={32}
      display="flex"
      justifyContent="center"
      position="fixed"
      width="100%"
      zIndex={100}
    >
      <Zoom in={displayed} key={currentStatus}>
        {renderButton()}
      </Zoom>
    </Box>,
    document.body,
  )
}

export default SaveButton
