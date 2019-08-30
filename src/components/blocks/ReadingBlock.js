import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Block from "../Block";
// import TextFieldSuggest from "../TextFieldSuggest";
import Sortable from "../Sortable";
import songs from "../../config/songs.json";

const useStyles = makeStyles(theme => ({
  item: {}
}));

export default ({ block, onChange }) => {
  const classes = useStyles();
  let items = block.value;

  const getDefaultItem = () => ({ bibleRef: "", excerpt: "" });

  const handleChange = (key, index, value) => {
    if (!items[index]) {
      items[index] = getDefaultItem();
    }

    items[index][key] = value;
    onChange(items);
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
    <Block className={classes.root} title={block.title}>
      <Sortable
        items={items}
        renderItem={renderItem}
        onChange={onChange}
        isItemEmpty={item => !item.bibleRef && !item.excerpt}
        getDefaultItem={getDefaultItem}
      />
    </Block>
  );
};
