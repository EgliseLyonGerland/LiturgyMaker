import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Sortable from "../Sortable";
import SermonPlanPicker from "../SermonPlanPicker";
import BibleRefPicker from "../BibleRefPicker";

const useStyles = makeStyles(
  theme => ({
    item: {},
    subtitle: {
      fontSize: 16,
      color: "#777",
      fontWeight: 900,
      margin: theme.spacing(4, 0, 2)
    }
  }),
  {
    name: "SermonBlock"
  }
);

export default ({ block, onChange, onFocus, onBlur }) => {
  const classes = useStyles();
  const { data } = block;
  const { title, author, bibleRefs = [], plan = [] } = data;

  const getDefaultBibleRef = () => "";

  const renderBibleRef = (ref, index) => (
    <div className={classes.item}>
      <BibleRefPicker
        data={{ ref }}
        onChange={({ ref }) => {
          data.bibleRefs[index] = ref;
          onChange(data);
        }}
        onFocus={path => onFocus(["bibleRefs", index, ...path])}
        onBlur={onBlur}
        withExcerpt={false}
      />
    </div>
  );

  return (
    <div className={classes.root}>
      <TextField
        label="Title"
        defaultValue={title}
        onChange={({ target }) => {
          data.title = target.value;
          onChange(data);
        }}
        onFocus={() => onFocus(["title"])}
        onBlur={onBlur}
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
        onFocus={() => onFocus(["author"])}
        onBlur={onBlur}
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
        getDefaultItem={getDefaultBibleRef}
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
        onFocus={path => onFocus(["plan", ...path])}
        onBlur={onBlur}
      />
    </div>
  );
};
