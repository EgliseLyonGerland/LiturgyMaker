import React from "react";
import TextField from "@material-ui/core/TextField";
import Block from "../FormBlock";
import TextFieldSuggest from "../TextFieldSuggest";
import Sortable from "../Sortable";
import songs from "../../config/songs.json";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export default ({ block, onChange, onFocus, onBlur }) => {
  let items = block.data;

  const getDefaultItem = () => ({ title: "", infos: "", repeat: false });

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
        onFocus={() => onFocus([index, "title"])}
        onBlur={onBlur}
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
        onFocus={() => onFocus([index, "infos"])}
        onBlur={onBlur}
        variant="filled"
        margin="dense"
        gutters={3}
        fullWidth
        multiline
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={item.repeat || false}
            onChange={() => handleChange("repeat", index, !item.repeat)}
          />
        }
        label="Chanté deux fois ?"
      />
    </div>
  );

  return (
    <Block title="Chants">
      <Sortable
        items={items}
        renderItem={renderItem}
        onChange={onChange}
        getDefaultItem={getDefaultItem}
        gutters={3}
      />
    </Block>
  );
};
