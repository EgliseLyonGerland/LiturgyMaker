import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { ClassNameMap } from '@material-ui/styles';

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

const SortableList = SortableContainer(
  ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);

const DragHandle = SortableHandle(
  ({ classes }: { classes: ClassNameMap<'handle'> }) => (
    <DragHandleIcon color="disabled" className={classes.handle} />
  ),
);

const SortableItem = SortableElement(
  ({
    children,
    style,
    classes,
  }: {
    children: React.ReactNode;
    style: React.CSSProperties;
    classes: ClassNameMap<'item' | 'handle'>;
  }) => (
    <div className={classes.item} style={style}>
      <DragHandle classes={classes} />
      {children}
    </div>
  ),
);

interface Props<T> {
  items: T[];
  maxItems: number;
  gutters: number;
  disabled: boolean;
  renderItem(item: T, index: number): void;
  onChange(items: T[]): void;
  getDefaultItem(): T;
}

const Sortable = <T extends any>({
  items,
  maxItems = Infinity,
  renderItem,
  onChange,
  getDefaultItem,
  gutters = 0,
  disabled = false,
}: Props<T>) => {
  const classes = useStyles();
  const theme = useTheme();

  const handleSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  const handleDelete = (index: number) => {
    items.splice(index, 1);
    onChange([...items]);
  };

  const isLast = (index: number) => index === items.length - 1;

  return (
    <SortableList onSortEnd={handleSortEnd} useDragHandle>
      {items.map((item, index) => (
        <SortableItem
          key={index}
          index={index}
          classes={classes}
          disabled={disabled}
          style={{
            marginBottom: isLast(index) ? 0 : theme.spacing(gutters),
          }}
        >
          {renderItem(item, index)}

          <DeleteIcon
            className={classes.trash}
            color="disabled"
            onClick={() => {
              if (!disabled) {
                handleDelete(index);
              }
            }}
          />
        </SortableItem>
      ))}

      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.add}
        disabled={disabled || maxItems === items.length}
        onClick={() => {
          items.push(getDefaultItem());
          onChange([...items]);
        }}
      >
        Ajouter
      </Button>
    </SortableList>
  );
};

export default Sortable;
