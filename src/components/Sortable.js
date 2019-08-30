import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import arrayMove from "array-move";

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gridColumnGap: theme.spacing(2)
    // alignItems: "center"
  },
  handle: {
    position: "absolute",
    right: "100%",
    margin: theme.spacing(2, 2, 0, 0)
  },
  trash: {
    marginTop: theme.spacing(2)
  }
}));

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
  gutters = 0
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const isLastItemEmpty = items$ => {
    return isItemEmpty(items$[items$.length - 1]);
  };

  if (!items.length || !isLastItemEmpty(items)) {
    items = [...items, getDefaultItem()];
  }

  const sendChange = newItems => {
    if (isLastItemEmpty(newItems)) {
      newItems.pop();
    }

    onChange([...newItems]);
  };

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    sendChange(arrayMove(items, oldIndex, newIndex));
  };

  const handleDelete = index => {
    items.splice(index, 1);
    sendChange(items);
  };

  return (
    <SortableContainer onSortEnd={handleSortEnd} useDragHandle>
      {items.map((item, index) => (
        <SortableItem
          key={index}
          index={index}
          classes={classes}
          style={{
            marginBottom: theme.spacing(gutters)
          }}
        >
          {renderItem(item, index)}

          {index === items.length - 1 && isItemEmpty(item) ? (
            <DeleteIcon
              className={classes.trash}
              color="disabled"
              style={{ opacity: 0.2 }}
            />
          ) : (
            <DeleteIcon
              className={classes.trash}
              color="disabled"
              onClick={() => handleDelete(index)}
            />
          )}
        </SortableItem>
      ))}
    </SortableContainer>
  );
};
