import React, { useState } from "react";
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
  },
  handle: {
    marginRight: theme.spacing(2)
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
export default ({ block }) => {
  const classes = useStyles();
  const [items, setItems] = useState(block.items);

  const isItemEmpty = item => {
    return !item.title && !item.detail;
  };

  const needsEmpty = items.reduce(
    (acc, item) => (isItemEmpty(item) ? false : acc),
    true
  );

  if (needsEmpty) {
    setItems([...items, { title: "", detail: "" }]);
  }

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const handleChange = (key, index, value) => {
    items[index][key] = value;
    setItems([...items]);
  };

  const handleDelete = index => {
    items.splice(index, 1);
    setItems([...items]);
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
            {!isItemEmpty(item) ? (
              <DeleteIcon
                color="disabled"
                onClick={() => handleDelete(index)}
              />
            ) : (
              <DeleteIcon color="disabled" style={{ opacity: 0.2 }} />
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
