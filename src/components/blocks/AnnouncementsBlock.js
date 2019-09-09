import React from "react";
import TextField from "@material-ui/core/TextField";
import Sortable from "../Sortable";

export default ({ block, onChange, onFocus, onBlur }) => {
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
        onFocus={() => onFocus([index, "title"])}
        onBlur={onBlur}
        fullWidth
      />
      <TextField
        label="Détail"
        value={item.detail}
        onChange={event => handleChange("detail", index, event.target.value)}
        variant="filled"
        margin="dense"
        onFocus={() => onFocus([index, "detail"])}
        onBlur={onBlur}
        multiline
        fullWidth
      />
    </div>
  );

  return (
    <Sortable
      items={items}
      renderItem={renderItem}
      onChange={onChange}
      getDefaultItem={getDefaultItem}
      gutters={3}
    />
  );
};
