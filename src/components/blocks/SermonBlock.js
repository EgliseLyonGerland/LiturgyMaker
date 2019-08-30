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
  const { data } = block;
  const { title, author, bibleRefs = [], plan = [] } = data;

  const getDefaultBibleRef = () => "";

  const renderBibleRef = (ref, index) => (
    <div className={classes.item}>
      <TextField
        label="Référence biblique"
        value={ref}
        onChange={({ target }) => {
          data.bibleRefs[index] = target.value;
          onChange(data);
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
          data.title = target.value;
          onChange(data);
        }}
        variant="filled"
        margin="dense"
        fullWidth
      />
      <TextField
        label="Auteur"
        defaultValue={author}
        onChange={({ target }) => {
          data.author = target.value;
          onChange(data);
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
          data.bibleRefs = refs;
          onChange(data);
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
          data.plan = items;
          onChange(data);
        }}
      />
    </Block>
  );
};
