import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import find from 'lodash/find';
import get from 'lodash/get';

const mapStateToProps = ({ recitations }) => {
  return {
    recitations,
  };
};

const RecitationBlock = ({ block, recitations, onChange, onFocus, onBlur }) => {
  const { data } = block;

  const getDefaultItem = () => ({
    id: null,
    infos: '',
  });

  const handleChange = (key, value) => {
    onChange({
      ...getDefaultItem(),
      ...data,
      [key]: value,
    });
  };

  return (
    <div>
      <Autocomplete
        defaultValue={find(recitations.data, ['id', data.id])}
        options={recitations.data}
        getOptionLabel={(option) =>
          `${option.title}${option.number ? ` (${option.number})` : ''}`
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Titre"
            variant="filled"
            margin="dense"
            fullWidth
          />
        )}
        onChange={(event, option) => {
          handleChange('id', get(option, 'id', null));
        }}
        onFocus={() => onFocus(['id'])}
        onBlur={onBlur}
        autoComplete
      />
      <TextField
        label="Informations"
        value={data.infos}
        onChange={(event) => {
          handleChange('infos', event.target.value);
        }}
        onFocus={() => onFocus(['infos'])}
        onBlur={onBlur}
        variant="filled"
        margin="dense"
        gutters={3}
        fullWidth
        multiline
      />
    </div>
  );
};

RecitationBlock.propTypes = {
  block: PropTypes.object,
  recitations: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default connect(mapStateToProps)(RecitationBlock);
