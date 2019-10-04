import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import okaida from 'react-syntax-highlighter/dist/esm/styles/prism/okaidia';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const copy = require('clipboard-copy');

const useStyles = makeStyles(
  theme => ({
    root: {
      maxWidth: '100%',
      overflowX: 'auto',
      position: 'relative',
    },
    pre: {
      margin: `0 !important`,
      borderRadius: `0 !important`,
      minHeight: '100%',
    },
    copyButton: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
      width: 250,
    },
  }),
  { name: 'Code' },
);

const Code = ({ code }) => {
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

  return (
    <div className={classes.root}>
      <SyntaxHighlighter className={classes.pre} language="js" style={okaida}>
        {code}
      </SyntaxHighlighter>
      <Button
        className={classes.copyButton}
        variant="contained"
        size="small"
        onClick={handleCopy}
      >
        {copied ? 'Copié !' : 'Copier dans le presse-papier'}
      </Button>
    </div>
  );
};

Code.propTypes = {
  code: PropTypes.string,
};

export default Code;
