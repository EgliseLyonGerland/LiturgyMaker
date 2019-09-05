import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import slugify from "../utils/slugify";

const useStyles = makeStyles(
  {
    root: {
      flexGrow: 1
    },
    container: {
      position: "relative"
    },
    suggestionsContainerOpen: {
      position: "absolute",
      zIndex: 100,
      top: 56,
      left: 0,
      right: 0
    },
    suggestion: {
      display: "block"
    },
    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: "none"
    }
  },
  { name: "TextFieldSuggest" }
);

export default function TextFieldSuggest({
  items = [],
  field = "label",
  value,
  onChange,
  onFocus = () => {},
  onBlur = () => {},
  ...rest
}) {
  const classes = useStyles();

  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = value => {
    const inputValue = slugify(value.trim());
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : items.filter(suggestion => {
          const keep =
            count < 5 &&
            slugify(suggestion[field]).slice(0, inputLength) === inputValue;

          if (keep) {
            count += 1;
          }

          return keep;
        });
  };

  const getSuggestionValue = suggestion => {
    return suggestion[field];
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = (event, { newValue }) => {
    onChange(newValue);
  };

  const renderInputComponent = ({
    inputRef = () => {},
    ref,
    onFocus: onFocus2,
    onBlur: onBlur2,
    ...other
  }) => {
    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input
          }
        }}
        onFocus={(event, value) => {
          onFocus();
          onFocus2(event, value);
        }}
        onBlur={event => {
          onBlur();
          onBlur2(event);
        }}
        {...other}
        {...rest}
      />
    );
  };

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
        inputProps={{ value, onChange: handleChange }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInputComponent}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={handleSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
      />
    </div>
  );
}
