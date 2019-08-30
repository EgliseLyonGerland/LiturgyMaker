import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Block from "../Block";
import Sortable from "../Sortable";

const useStyles = makeStyles(theme => ({
  root: {},
  item: {}
}));

export default ({ block, onChange }) => {
  const classes = useStyles();
  let items = block.data;

  const getDefaultItem = () => ({ title: "", detail: "" });

  const handleChange = (key, index, value) => {
    if (!items[index]) {
      items[index] = getDefaultItem();
    }

    items[index][key] = value;
    onChange(items);
  };

  const renderItem = (item, index) => (
    <div>
      <TextField
        label="Titre"
        value={item.title}
        onChange={event => handleChange("title", index, event.target.value)}
        variant="filled"
        margin="dense"
        fullWidth
      />
      <TextField
        label="Détail"
        value={item.detail}
        onChange={event => handleChange("detail", index, event.target.value)}
        variant="filled"
        margin="dense"
        multiline
        fullWidth
      />
    </div>
  );

  return (
    <Block className={classes.root} title="Annonces">
      <Sortable
        items={items}
        renderItem={renderItem}
        onChange={onChange}
        isItemEmpty={item => !item.title && !item.detail}
        getDefaultItem={getDefaultItem}
        gutters={2}
        neverEmpty
      />
    </Block>
  );
};
