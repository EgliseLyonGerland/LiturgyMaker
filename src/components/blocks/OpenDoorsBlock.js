import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Sortable from '../Sortable';

const useStyles = makeStyles(
  (theme) => ({
    item: {},
    subtitle: {
      fontSize: 16,
      fontWeight: 900,
      margin: theme.spacing(4, 0, 2),
    },
  }),
  {
    name: 'OpenDoorsBlock',
  },
);

const OpenDoorsBlock = ({ block, onChange, onFocus, onBlur }) => {
  const classes = useStyles();
  const { data } = block;
  const { title, detail, prayerTopics = [] } = data;

  return (
    <div className={classes.root}>
      <TextField
        label="Titre"
        value={title}
        onChange={({ target }) => {
          data.title = target.value;
          onChange(data);
        }}
        onFocus={() => onFocus(['title'])}
        onBlur={onBlur}
        variant="filled"
        margin="dense"
        fullWidth
      />
      <TextField
        label="Informations"
        value={detail}
        onChange={({ target }) => {
          data.detail = target.value;
          onChange(data);
        }}
        onFocus={() => onFocus(['detail'])}
        onBlur={onBlur}
        variant="filled"
        margin="dense"
        gutters={3}
        fullWidth
        multiline
      />
      <Typography
        className={classes.subtitle}
        color="textSecondary"
        variant="h6"
      >
        Sujets de prière
      </Typography>

      <Sortable
        items={prayerTopics}
        maxItems={3}
        renderItem={(ref, index) => (
          <div className={classes.item}>
            <TextField
              label="Titre"
              defaultValue={prayerTopics[index]}
              onChange={({ target }) => {
                data.prayerTopics[index] = target.value;
                onChange(data);
              }}
              onFocus={() => {
                onFocus(['prayerTopics', index]);
              }}
              onBlur={onBlur}
              variant="filled"
              margin="dense"
              fullWidth
            />
          </div>
        )}
        onChange={(items) => {
          data.prayerTopics = items;
          onChange(data);
        }}
        getDefaultItem={() => ''}
      />
    </div>
  );
};

OpenDoorsBlock.propTypes = {
  block: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default OpenDoorsBlock;
