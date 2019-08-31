import React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import books from "../config/bibleBooks.json";

export default () => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField select label="Livre" fullWidth>
            {books.map(book => (
              <MenuItem key={book.id} value={book.name}>
                {book.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={2}>
          <TextField type="number" label="Du chapitre" />
        </Grid>
        <Grid item xs={2}>
          <TextField type="number" label="Du verset" />
        </Grid>
        <Grid item xs={2}>
          <TextField type="number" label="Au chapitre" />
        </Grid>
        <Grid item xs={2}>
          <TextField type="number" label="Au verset" />
        </Grid>
      </Grid>
    </div>
  );
};
