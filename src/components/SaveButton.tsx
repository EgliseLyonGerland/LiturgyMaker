import React, { useEffect, useState } from 'react';

import { Check, Save } from '@mui/icons-material';
import { Box, Fab, useTheme, Zoom } from '@mui/material';
import { createPortal } from 'react-dom';
import BeatLoader from 'react-spinners/BeatLoader';

type Status = 'running' | 'done' | 'ready' | null;

const SaveButton: React.FC<{
  persisting: boolean;
  persisted: boolean;
  dirty: boolean;
  onClick(): void;
  onHide(): void;
}> = ({ persisting, persisted, dirty, onClick, onHide }) => {
  const theme = useTheme();

  const [currentStatus, setCurrentStatus] = useState<Status>(null);
  const [displayed, setDisplayed] = useState(false);

  let status: Status = null;
  if (persisting) {
    status = 'running';
  } else if (persisted) {
    status = 'done';
  } else if (dirty) {
    status = 'ready';
  }

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
          style={{
            background: theme.palette.success.main,
            color: 'white',
          }}
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
            <BeatLoader key="saving" color="white" size={8} />
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
      zIndex={100}
    >
      <Zoom key={currentStatus} in={displayed}>
        {renderButton()}
      </Zoom>
    </Box>,
    document.body,
  );
};

export default SaveButton;
