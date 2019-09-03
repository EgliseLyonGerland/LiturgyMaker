import React from "react";
import TextField from "@material-ui/core/TextField";
import Block from "../Block";
import TextFieldSuggest from "../TextFieldSuggest";
import Sortable from "../Sortable";
import songs from "../../config/songs.json";

export default ({ block, onChange }) => {
  let items = block.data;

  const getDefaultItem = () => ({ title: "", infos: "" });

  const handleChange = (key, index, value) => {
    if (!items[index]) {
      items[index] = getDefaultItem();
    }

    items[index][key] = value;
    onChange(items);
  };

  const renderItem = (item, index) => (
    <div>
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
        label="Informations"
        value={item.infos}
        onChange={event => {
          handleChange("infos", index, event.target.value);
        }}
        variant="filled"
        margin="dense"
        gutters={3}
        fullWidth
        multiline
      />
    </div>
  );

  return (
    <Block title="Chants">
      <Sortable
        items={items}
        renderItem={renderItem}
        onChange={onChange}
        isItemEmpty={item => !item.title && !item.infos}
        getDefaultItem={getDefaultItem}
        gutters={3}
      />
    </Block>
  );
};
