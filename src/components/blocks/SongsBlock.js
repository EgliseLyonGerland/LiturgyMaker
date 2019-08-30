import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Block from "../Block";
import TextFieldSuggest from "../TextFieldSuggest";
import Sortable from "../Sortable";
import songs from "../../config/songs.json";

const useStyles = makeStyles(theme => ({
  item: {}
}));

export default ({ block, onChange }) => {
  const classes = useStyles();
  let items = block.value;

  const getDefaultItem = () => ({ title: "", comments: "" });

  const handleChange = (key, index, value) => {
    if (!items[index]) {
      items[index] = getDefaultItem();
    }

    items[index][key] = value;
    onChange(items);
  };

  const renderItem = (item, index) => (
    <div className={classes.item}>
      <TextFieldSuggest
        label="Titre"
        value={item.title}
        onChange={value => {
          handleChange("title", index, value);
        }}
        variant="filled"
        margin="dense"
        items={songs}
        field="title"
        fullWidth
      />
      <TextField
        label="Commentaires"
        value={item.comments}
        onChange={event => {
          handleChange("comments", index, event.target.value);
        }}
        variant="filled"
        margin="dense"
        gutters={2}
        fullWidth
        multiline
      />
      <div />
    </div>
  );

  return (
    <Block className={classes.root} title="Chants">
      <Sortable
        items={items}
        renderItem={renderItem}
        onChange={onChange}
        isItemEmpty={item => !item.title && !item.comments}
        getDefaultItem={getDefaultItem}
      />
    </Block>
  );
};
