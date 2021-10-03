import React, { useState } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

import slugify from '../utils/slugify';

const useStyles = makeStyles(
  {
    root: {
      flexGrow: 1,
    },
    container: {
      position: 'relative',
    },
    suggestionsContainerOpen: {
      position: 'absolute',
      zIndex: 100,
      top: 56,
      left: 0,
      right: 0,
    },
    suggestion: {
      display: 'block',
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
  },
  { name: 'TextFieldSuggest' },
);

const TextFieldSuggest = ({
  items = [],
  field = 'label',
  value,
  name,
  disabled = false,
  inputRef = () => {},
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  ...rest
}) => {
  const classes = useStyles();

  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = (str) => {
    const inputValue = slugify(str.trim());
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : items.filter((suggestion) => {
          const keep =
            count < 5 &&
            slugify(suggestion[field]).slice(0, inputLength) === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  const getSuggestionValue = (suggestion) => suggestion[field];

  const handleSuggestionsFetchRequested = (options) => {
    setSuggestions(getSuggestions(options.value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = (event, { newValue }) => {
    onChange(newValue);
  };

  const renderInputComponent = ({
    ref,
    onFocus: onFocus2,
    onBlur: onBlur2,
    ...other
  }) => (
    <TextField
      fullWidth
      disabled={disabled}
      InputProps={{
        inputRef: (node) => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      onFocus={(event, newValue) => {
        onFocus();
        onFocus2(event, newValue);
      }}
      onBlur={(event) => {
        onBlur(event);
        onBlur2(event);
      }}
      {...other}
      {...rest}
    />
  );

  const renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion[field], query);
    const parts = parse(suggestion[field], matches);

    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map((part, index) => (
            <span
              key={index}
              style={{ fontWeight: part.highlight ? 500 : 400 }}
            >
              {part.text}
            </span>
          ))}
        </div>
      </MenuItem>
    );
  };

  return (
    <div className={classes.root}>
      <Autosuggest
        suggestions={suggestions}
        inputProps={{ value, name, onChange: handleChange }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInputComponent}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={handleSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={(options) => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    </div>
  );
};

TextFieldSuggest.propTypes = {
  items: PropTypes.array,
  field: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputRef: PropTypes.any,
  ref: PropTypes.any,
};

export default TextFieldSuggest;
