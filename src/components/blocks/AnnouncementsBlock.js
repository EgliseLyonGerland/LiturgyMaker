import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  sortableContainer,
  sortableElement,
  sortableHandle
} from "react-sortable-hoc";
import arrayMove from "array-move";
import Block from "../Block";

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gridColumnGap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: "center"
  }
}));

const DragHandle = sortableHandle(() => <DragHandleIcon color="disabled" />);

const SortableItem = sortableElement(({ children, classes }) => (
  <div className={classes.item}>
    <DragHandle classes={classes} />
    {children}
  </div>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});
export default ({ block, onChange }) => {
  const classes = useStyles();
  let items = block.value;

  const isItemEmpty = item => {
    return !item.title && !item.detail;
  };

  const isLastItemEmpty = items$ => {
    return isItemEmpty(items$[items$.length - 1]);
  };

  if (!items.length || !isLastItemEmpty(items)) {
    items = [...items, { title: "", detail: "" }];
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

  const handleChange = (key, index, value) => {
    items[index][key] = value;
    sendChange(items);
  };

  const handleDelete = index => {
    items.splice(index, 1);
    sendChange(items);
  };

  return (
    <Block className={classes.root} title="Annonces">
      <SortableContainer onSortEnd={handleSortEnd} useDragHandle>
        {items.map((item, index) => (
          <SortableItem key={index} index={index} classes={classes}>
            <TextField
              label="Titre"
              value={item.title}
              onChange={event =>
                handleChange("title", index, event.target.value)
              }
              variant="filled"
              margin="dense"
              fullWidth
            />
            {index === items.length - 1 && isItemEmpty(item) ? (
              <DeleteIcon color="disabled" style={{ opacity: 0.2 }} />
            ) : (
              <DeleteIcon
                color="disabled"
                onClick={() => handleDelete(index)}
              />
            )}
            <div />
            <TextField
              label="Détail"
              value={item.detail}
              onChange={event =>
                handleChange("detail", index, event.target.value)
              }
              variant="filled"
              margin="dense"
              multiline
              fullWidth
            />
            <div />
          </SortableItem>
        ))}
      </SortableContainer>
    </Block>
  );
};
