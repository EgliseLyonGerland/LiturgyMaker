import { useEffect, useState } from 'react';
import { Box, Fab, useTheme, Zoom } from '@material-ui/core';
import { Check, Save } from '@material-ui/icons';
import BeatLoader from 'react-spinners/BeatLoader';
import { createPortal } from 'react-dom';

function SaveButton({ persisting, persisted, dirty, onClick, onHide }) {
  const theme = useTheme();

  const [currentStatus, setCurrentStatus] = useState(null);
  const [displayed, setDisplayed] = useState(false);

  const status = persisting
    ? 'running'
    : persisted
    ? 'done'
    : dirty
    ? 'ready'
    : null;

  useEffect(() => {
    if (currentStatus === 'done' && displayed) {
      return;
    }

    switch (status) {
      case 'running':
      case 'ready': {
        setCurrentStatus(status);
        setDisplayed(true);
        break;
      }
      case 'done': {
        setCurrentStatus('done');

        setTimeout(() => {
          setDisplayed(false);
          onHide();
        }, 5000);

        break;
      }
      default: {
        setDisplayed(false);
      }
    }
  }, [currentStatus, displayed, onHide, status]);

  const renderButton = () => {
    if (currentStatus === 'done') {
      return (
        <Fab
          variant="extended"
          color="secondary"
          disabled
          style={{ background: '#17d86d', color: 'white' }}
        >
          <Box width={168} display="flex" justifyContent="center">
            <Check />
            <Box ml={2}>Enregistré</Box>
          </Box>
        </Fab>
      );
    }

    if (currentStatus === 'running') {
      return (
        <Fab
          variant="extended"
          color="secondary"
          disabled
          style={{
            background: theme.palette.secondary.main,
            color: 'white',
          }}
        >
          <Box width={168} display="flex" justifyContent="center">
            <BeatLoader key="saving" color="white" size={8} sizeUnit="px" />
          </Box>
        </Fab>
      );
    }

    return (
      <Fab
        aria-label="Enregistrer"
        variant="extended"
        color="secondary"
        onClick={onClick}
      >
        <Box width={168} display="flex" justifyContent="center">
          <Save />
          <Box ml={2}>Enregistrer</Box>
        </Box>
      </Fab>
    );
  };

  return createPortal(
    <Box
      position="fixed"
      bottom={32}
      display="flex"
      justifyContent="center"
      width="100%"
      transition="background .3s"
      zIndex={100}
    >
      <Zoom key={currentStatus} in={displayed}>
        {renderButton()}
      </Zoom>
    </Box>,
    document.body,
  );
}

export default SaveButton;
