/* eslint-disable react/prop-types */
import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  SortableContainer as ReactSortableContainer,
  SortableElement as ReactSortableElement,
  SortableHandle as ReactSortableHandle,
} from 'react-sortable-hoc';

interface Props<T = any> {
  name: string;
  maxItems?: number;
  disabled: boolean;
  defaultItem: T;
  gutters?: number;
  renderItem: (item: T, index: number) => void;
}

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
  { name: 'ArraySortableControl' },
);

const SortableContainer = ReactSortableContainer(
  ({ children }: { children: JSX.Element }) => <div>{children}</div>,
);

const DragHandle = ReactSortableHandle(
  ({ classes }: { classes: ReturnType<typeof useStyles> }) => (
    <DragHandleIcon color="disabled" className={classes.handle} />
  ),
);

const SortableItem = ReactSortableElement(
  ({
    children,
    style,
    classes,
  }: {
    children: JSX.Element;
    style: React.CSSProperties;
    classes: ReturnType<typeof useStyles>;
  }) => (
    <div className={classes.item} style={style}>
      <DragHandle classes={classes} />
      {children}
    </div>
  ),
);

function ArraySortableControl<T = any>({
  name,
  maxItems = Infinity,
  disabled,
  gutters = 0,
  defaultItem,
  renderItem,
}: Props<T>) {
  const classes = useStyles();
  const theme = useTheme();
  const { control } = useFormContext();
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
        <div>
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
              <>
                {renderItem(item as T, index)}

                <DeleteIcon
                  className={classes.trash}
                  color="disabled"
                  onClick={() => {
                    if (!disabled) {
                      remove(index);
                    }
                  }}
                />
              </>
            </SortableItem>
          ))}
        </div>
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
}

export default ArraySortableControl;
