import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import arrayMove from "array-move";

const useStyles = makeStyles(
  theme => ({
    item: {
      position: "relative"
    },
    handle: {
      position: "absolute",
      top: theme.spacing(2),
      right: "100%",
      marginRight: theme.spacing(2)
    },
    trash: {
      position: "absolute",
      top: theme.spacing(2),
      left: "100%",
      marginLeft: theme.spacing(2)
    },
    add: {
      marginTop: theme.spacing(2)
    }
  }),
  { name: "Sortable" }
);

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

const DragHandle = sortableHandle(({ classes }) => (
  <DragHandleIcon color="disabled" className={classes.handle} />
));

const SortableItem = sortableElement(({ children, style, classes }) => (
  <div className={classes.item} style={style}>
    <DragHandle classes={classes} />
    {children}
  </div>
));

export default ({
  items,
  renderItem,
  onChange,
  isItemEmpty,
  getDefaultItem,
  neverEmpty = false,
  gutters = 0
}) => {
  const classes = useStyles();
  const theme = useTheme();

  if (neverEmpty && !items.length) {
    items.push(getDefaultItem());
    onChange([...items]);
  }

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    onChange(arrayMove(items, oldIndex, newIndex));
  };

  const handleDelete = index => {
    items.splice(index, 1);
    onChange([...items]);
  };

  const isLast = index => index === items.length - 1;

  return (
    <SortableContainer onSortEnd={handleSortEnd} useDragHandle>
      {items.map((item, index) => (
        <SortableItem
          key={index}
          index={index}
          classes={classes}
          style={{
            marginBottom: isLast(index) ? 0 : theme.spacing(gutters)
          }}
        >
          {renderItem(item, index)}

          <DeleteIcon
            className={classes.trash}
            color="disabled"
            onClick={() => handleDelete(index)}
          />
        </SortableItem>
      ))}

      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.add}
        onClick={() => {
          items.push(getDefaultItem());
          onChange([...items]);
        }}
      >
        Ajouter
      </Button>
    </SortableContainer>
  );
};
