import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Block from "../Block";
import Sortable from "../Sortable";

const useStyles = makeStyles(theme => ({
  item: {}
}));

export default ({ block, onChange }) => {
  const classes = useStyles();
  const { value } = block;
  const { title = "", bibleRefs = [] } = value;

  const getDefaultItem = () => ({ bibleRef: "", excerpt: "" });

  const handleChange = (key, index, value) => {
    if (!value.bibleRefs[index]) {
      value.bibleRefs[index] = getDefaultItem();
    }

    value.bibleRefs[index][key] = value;
    onChange(value);
  };

  const renderItem = (item, index) => (
    <div className={classes.item}>
      <TextField
        label="Référence biblique"
        value={item.bibleRef}
        onChange={event => {
          handleChange("bibleRef", index, event.target.value);
        }}
        variant="filled"
        margin="dense"
        fullWidth
      />
      <TextField
        label="Extrait"
        value={item.excerpt}
        onChange={event => {
          handleChange("excerpt", index, event.target.value);
        }}
        variant="filled"
        margin="dense"
        fullWidth
        multiline
      />
      <div />
    </div>
  );

  return (
    <Block className={classes.root} title={title}>
      <Sortable
        items={bibleRefs}
        renderItem={renderItem}
        onChange={onChange}
        isItemEmpty={item => !item.bibleRef && !item.excerpt}
        getDefaultItem={getDefaultItem}
      />
    </Block>
  );
};
