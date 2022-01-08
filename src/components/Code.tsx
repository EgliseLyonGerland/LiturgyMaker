import React, { useState, useEffect } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import { createPortal } from 'react-dom';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import okaida from 'react-syntax-highlighter/dist/esm/styles/prism/okaidia';

const copy = require('clipboard-copy');

interface Props {
  code: string;
  onHide(): void;
}

const useStyles = makeStyles(
  (theme) => ({
    root: {
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 100,
      display: 'flex',
      background: '#13242d',
    },
    inner: {
      padding: theme.spacing(5),
      overflowX: 'auto',
      overflowY: 'auto',
      position: 'relative',
    },
    pre: {
      margin: `0 !important`,
      borderRadius: `0 !important`,
      minHeight: '100%',
      paddingTop: '64px !important',
      background: 'transparent !important',
    },
    actions: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
    },
  }),
  { name: 'Code' },
);

function Code({ code, onHide = () => {} }: Props) {
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  });

  const handleCopy = () => {
    copy(code);
    setCopied(true);
  };

  return createPortal(
    <div className={classes.root}>
      <div className={classes.inner}>
        <SyntaxHighlighter className={classes.pre} language="js" style={okaida}>
          {code}
        </SyntaxHighlighter>
      </div>
      <div className={classes.actions}>
        <Box mr={2}>
          <Button
            variant="contained"
            size="small"
            onClick={handleCopy}
            style={{ width: 250 }}
          >
            {copied ? 'Copié !' : 'Copier dans le presse-papier'}
          </Button>
        </Box>
        <IconButton onClick={onHide} size="large">
          <CloseIcon />
        </IconButton>
      </div>
    </div>,
    document.body,
  );
}

export default Code;
