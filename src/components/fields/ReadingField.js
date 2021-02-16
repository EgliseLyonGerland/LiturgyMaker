import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FieldArraySortable from '../FieldArraySortable';
import BibleRefField from './BibleRefField';

const ReadingField = ({ name, control }) => (
  <FieldArraySortable
    name={`${name}.bibleRefs`}
    control={control}
    gutters={3}
    defaultItem={{ ref: '', excerpt: '' }}
    renderItem={(item, index) => (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <BibleRefField
            name={`${name}.bibleRefs[${index}]`}
            control={control}
            defaultValue={item}
          />
        </Grid>
      </Grid>
    )}
  />
);

ReadingField.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ReadingField;
