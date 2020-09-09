import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import find from 'lodash/find';
import get from 'lodash/get';
import Sortable from '../Sortable';

const mapStateToProps = ({ songs }) => {
  return {
    songs,
  };
};

const SongsBlock = ({ block, songs, onChange, onFocus, onBlur }) => {
  const items = block.data;

  const getDefaultItem = () => ({
    id: null,
    infos: '',
    repeat: false,
  });

  const handleChange = (key, index, value) => {
    if (!items[index]) {
      items[index] = getDefaultItem();
    }

    items[index][key] = value;
    onChange(items);
  };

  const renderItem = (item, index) => {
    const song = find(songs.data, ['id', item.id]);

    return (
      <div>
        <Autocomplete
          defaultValue={song}
          options={songs.data}
          getOptionLabel={(option) =>
            `${option.title}${option.number ? ` (${option.number})` : ''}`
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Titre"
              variant="filled"
              margin="dense"
              helperText={
                song &&
                song.lyrics.length === 0 &&
                `Paroles manquantes pour ce chant (${song.id})`
              }
              fullWidth
            />
          )}
          onChange={(event, option) => {
            handleChange('id', index, get(option, 'id', null));
          }}
          onFocus={() => onFocus([index, 'title'])}
          onBlur={onBlur}
          autoComplete
        />
        <TextField
          label="Informations"
          value={item.infos}
          onChange={(event) => {
            handleChange('infos', index, event.target.value);
          }}
          onFocus={() => onFocus([index, 'infos'])}
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
              onChange={() => handleChange('repeat', index, !item.repeat)}
            />
          }
          label="Chanté deux fois ?"
        />
      </div>
    );
  };

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

SongsBlock.propTypes = {
  block: PropTypes.object,
  songs: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default connect(mapStateToProps)(SongsBlock);
