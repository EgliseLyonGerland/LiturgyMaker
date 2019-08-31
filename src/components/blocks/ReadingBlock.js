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
  const { data } = block;
  const { title = "", bibleRefs = [] } = data;

  const getDefaultItem = () => ({ ref: "", excerpt: "" });

  const handleChange = (key, index, value) => {
    data.bibleRefs[index][key] = value;
    onChange(data);
  };

  const renderItem = (item, index) => (
    <div className={classes.item}>
      <TextField
        label="Référence biblique"
        value={item.ref}
        onChange={({ target }) => {
          handleChange("ref", index, target.value);
        }}
        variant="filled"
        margin="dense"
        fullWidth
      />
      <TextField
        label="Extrait"
        value={item.excerpt}
        onChange={({ target }) => {
          handleChange("excerpt", index, target.value);
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
        onChange={refs => {
          data.bibleRefs = refs;
          onChange(data);
        }}
        isItemEmpty={item => !item.ref && !item.excerpt}
        getDefaultItem={getDefaultItem}
        gutters={3}
        neverEmpty
      />
    </Block>
  );
};
