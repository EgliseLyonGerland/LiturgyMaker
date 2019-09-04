import React from "react";
import TextField from "@material-ui/core/TextField";
import Sortable from "./Sortable";

export default ({ items, onChange }) => {
  const getDefaultItem = () => "";

  const handleChange = (index, value) => {
    items[index] = value;
    onChange(items);
  };

  const renderItem = (text, index) => (
    <div>
      <TextField
        label={`Point #${index + 1}`}
        value={text}
        onChange={({ target }) => {
          handleChange(index, target.value);
        }}
        variant="filled"
        margin="dense"
        fullWidth
      />
    </div>
  );

  return (
    <div>
      <Sortable
        items={items}
        renderItem={renderItem}
        onChange={onChange}
        getDefaultItem={getDefaultItem}
      />
    </div>
  );
};
