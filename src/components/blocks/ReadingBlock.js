import React from 'react';
import Grid from '@material-ui/core/Grid';
import Sortable from '../Sortable';
import BibleRefPicker from '../BibleRefPicker';
import VerseTemplatePicker from '../VerseTemplatePicker';

export default ({ block, onChange, onFocus, onBlur }) => {
  const { data } = block;
  const { bibleRefs = [] } = data;

  const getDefaultItem = () => ({ ref: '', excerpt: '' });

  const renderItem = ({ template, ...rest }, index) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <BibleRefPicker
          data={rest}
          onChange={value => {
            data.bibleRefs[index] = {
              ...data.bibleRefs[index],
              ...value,
            };
            onChange(data);
          }}
          onFocus={path => {
            onFocus(['bibleRefs', index, ...path]);
          }}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12}>
        <VerseTemplatePicker
          current={template}
          onSelect={value => {
            data.bibleRefs[index] = {
              ...data.bibleRefs[index],
              template: value,
            };
            onChange(data);
          }}
        />
      </Grid>
    </Grid>
  );

  return (
    <Sortable
      items={bibleRefs}
      renderItem={renderItem}
      onChange={refs => {
        data.bibleRefs = refs;
        onChange(data);
      }}
      getDefaultItem={getDefaultItem}
      gutters={3}
    />
  );
};
