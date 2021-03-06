import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import { useFieldArray } from 'react-hook-form';

const useStyles = makeStyles(
  (theme) => ({
    item: {
      position: 'relative',
    },
    handle: {
      position: 'absolute',
      top: theme.spacing(2),
      right: '100%',
      marginRight: theme.spacing(2),
    },
    trash: {
      position: 'absolute',
      top: theme.spacing(2),
      left: '100%',
      marginLeft: theme.spacing(2),
    },
    add: {
      marginTop: theme.spacing(2),
    },
  }),
  { name: 'Sortable' },
);

const SortableContainer = sortableContainer(({ children }) => (
  <div>{children}</div>
));

const DragHandle = sortableHandle(({ classes }) => (
  <DragHandleIcon color="disabled" className={classes.handle} />
));

const SortableItem = sortableElement(({ children, style, classes }) => (
  <div className={classes.item} style={style}>
    <DragHandle classes={classes} />
    {children}
  </div>
));

const FieldArraySortable = ({
  name,
  control,
  maxItems,
  disabled,
  gutters = 0,
  defaultItem,
  renderItem,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { fields, append, remove, move } = useFieldArray({
    name,
    control,
    keyName: 'key',
  });

  return (
    <div>
      <SortableContainer
        onSortEnd={({ oldIndex, newIndex }) => {
          move(oldIndex, newIndex);
        }}
        useDragHandle
      >
        {fields.map(({ key, ...item }, index) => (
          <SortableItem
            key={key}
            index={index}
            classes={classes}
            disabled={disabled}
            style={{
              marginBottom:
                index === fields.length - 1 ? 0 : theme.spacing(gutters),
            }}
          >
            {renderItem(item, index)}

            <DeleteIcon
              className={classes.trash}
              color="disabled"
              onClick={() => {
                if (!disabled) {
                  remove(index);
                }
              }}
            />
          </SortableItem>
        ))}
      </SortableContainer>

      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.add}
        disabled={disabled || maxItems === fields.length}
        onClick={() => {
          append(defaultItem);
        }}
      >
        Ajouter
      </Button>
    </div>
  );
};

FieldArraySortable.propTypes = {
  items: PropTypes.array,
  maxItems: PropTypes.number,
  gutters: PropTypes.number,
  renderItem: PropTypes.func,
};

export default FieldArraySortable;
