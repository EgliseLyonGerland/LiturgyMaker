import React from "react";
import TextField from "@material-ui/core/TextField";
import TextFieldSuggest from "./TextFieldSuggest";
import { validate } from "../utils/bibleRef";

import books from "../config/bibleBooks.json";

export default ({ data, onChange, withExcerpt = true }) => {
  let error = "";
  if (data.ref) {
    error = validate(data.ref);
  }

  const handleChange = (key, value) => {
    data[key] = value;

    onChange(data);
  };

  return (
    <div>
      <TextFieldSuggest
        label="Référence biblique"
        value={data.ref}
        onChange={value => {
          handleChange("ref", value);
        }}
        variant="filled"
        margin="dense"
        error={!!error}
        helperText={error}
        fullWidth
        items={books}
        field="name"
      />
      {withExcerpt && (
        <TextField
          label="Extrait"
          value={data.excerpt}
          onChange={({ target }) => {
            handleChange("excerpt", target.value);
          }}
          variant="filled"
          margin="dense"
          fullWidth
          multiline
        />
      )}
    </div>
  );
};
