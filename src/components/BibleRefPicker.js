import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import TextFieldSuggest from "./TextFieldSuggest";
import { validate, getPassage } from "../utils/bibleRef";

import books from "../config/bibleBooks.json";

const useStyles = makeStyles(
  theme => ({
    excerptButton: {
      background: "transparent",
      border: 0,
      padding: 0,
      color: theme.palette.primary.main,
      cursor: "pointer",
      outline: 0
    }
  }),
  { name: "BibleRefPicker" }
);

export default ({ data, onChange, onFocus, onBlur, withExcerpt = true }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  let error = "";
  if (data.ref) {
    error = validate(data.ref);
  }

  const handleChange = (key, value) => {
    data[key] = value;
    data.excerpt = data.excerpt.replace(/\n/gm, "");
    data.excerpt = data.excerpt.replace(/\s+/gm, " ");

    onChange(data);
  };

  const handleFillPassage = async () => {
    setLoading(true);

    let excerpt = await getPassage(data.ref);

    if (excerpt) {
      excerpt = excerpt.trim();
      excerpt = excerpt.replace(/\n*\s+/gm, " ");
      onChange({ ...data, excerpt });
    }

    setLoading(false);
  };

  return (
    <div>
      <TextFieldSuggest
        label="Référence biblique"
        value={data.ref}
        onChange={value => {
          handleChange("ref", value);
        }}
        onFocus={() => onFocus(["ref"])}
        onBlur={onBlur}
        variant="filled"
        margin="dense"
        error={!!error}
        helperText={error}
        fullWidth
        items={books}
        field="name"
      />
      {withExcerpt && (
        <>
          <TextField
            label="Extrait"
            value={data.excerpt}
            onChange={({ target }) => {
              handleChange("excerpt", target.value);
            }}
            onFocus={() => onFocus(["excerpt"])}
            onBlur={onBlur}
            variant="filled"
            margin="dense"
            fullWidth
            multiline
          ></TextField>
          <button className={classes.excerptButton} onClick={handleFillPassage}>
            {loading
              ? "Chargement..."
              : "Remplir automatiquement l'extrait à partir de la référence"}
          </button>
        </>
      )}
    </div>
  );
};
