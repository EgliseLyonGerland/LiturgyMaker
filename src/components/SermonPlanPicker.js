import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Sortable from './Sortable';

const SermonPlanPicker = ({ items, onChange, onFocus, onBlur }) => {
  const getDefaultItem = () => '';

  const handleChange = (index, value) => {
    const newItems = items;
    newItems[index] = value;
    onChange(newItems);
  };

  const renderItem = (text, index) => (
    <div>
      <TextField
        label={`Point #${index + 1}`}
        value={text}
        onChange={({ target }) => {
          handleChange(index, target.value);
        }}
        onFocus={() => onFocus([index])}
        onBlur={onBlur}
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

SermonPlanPicker.propTypes = {
  items: PropTypes.array,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default SermonPlanPicker;
