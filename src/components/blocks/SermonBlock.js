import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Block from "../Block";
import Sortable from "../Sortable";
import SermonPlanPicker from "../SermonPlanPicker";

const useStyles = makeStyles(theme => ({
  item: {},
  subtitle: {
    fontSize: 16,
    color: "#777",
    fontWeight: 900,
    margin: theme.spacing(4, 0, 2)
  }
}));

export default ({ block, onChange }) => {
  const classes = useStyles();
  const { value } = block;
  const { title, author, bibleRefs = [], plan = [] } = value;

  const getDefaultBibleRef = () => "";

  const renderBibleRef = (ref, index) => (
    <div className={classes.item}>
      <TextField
        label="Référence biblique"
        value={ref}
        onChange={({ target }) => {
          value.bibleRefs[index] = target.value;
          onChange(value);
        }}
        variant="filled"
        margin="dense"
        fullWidth
      />
    </div>
  );

  return (
    <Block className={classes.root} title="Prédication">
      <TextField
        label="Title"
        defaultValue={title}
        onChange={({ target }) => {
          value.title = target.value;
          onChange(value);
        }}
        variant="filled"
        margin="dense"
        fullWidth
      />
      <TextField
        label="Auteur"
        defaultValue={author}
        onChange={({ target }) => {
          value.author = target.value;
          onChange(value);
        }}
        variant="filled"
        margin="dense"
        fullWidth
      />

      <Typography className={classes.subtitle} variant="h6">
        Passage(s) biblique(s)
      </Typography>

      <Sortable
        items={bibleRefs}
        renderItem={renderBibleRef}
        onChange={refs => {
          value.bibleRefs = refs;
          onChange(value);
        }}
        isItemEmpty={ref => !!ref}
        getDefaultItem={getDefaultBibleRef}
        neverEmpty
      />

      <Typography className={classes.subtitle} variant="h6">
        Plan
      </Typography>

      <SermonPlanPicker
        items={plan}
        onChange={items => {
          value.plan = items;
          onChange(value);
        }}
      />
    </Block>
  );
};
