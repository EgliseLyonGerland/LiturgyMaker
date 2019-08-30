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
import TextFieldSuggest from "../TextFieldSuggest";

import songs from "../../config/songs.json";

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gridColumnGap: theme.spacing(2),
    alignItems: "center",
    marginBottom: theme.spacing(2)
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
    return !item.title && !item.comments;
  };

  const isLastItemEmpty = items$ => {
    return isItemEmpty(items$[items$.length - 1]);
  };

  if (!isLastItemEmpty(items)) {
    items = [...items, { title: "", comments: "" }];
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
    <Block className={classes.root} title="Chants">
      <SortableContainer onSortEnd={handleSortEnd} useDragHandle>
        {items.map((item, index) => (
          <SortableItem key={index} index={index} classes={classes}>
            <TextFieldSuggest
              label="Titre"
              value={item.title}
              onChange={value => {
                handleChange("title", index, value);
              }}
              variant="filled"
              margin="dense"
              items={songs}
              field="title"
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
              label="Commentaires"
              value={item.comments}
              onChange={event => {
                handleChange("comments", index, event.target.value);
              }}
              variant="filled"
              margin="dense"
              fullWidth
              multiline
            />
            <div />
          </SortableItem>
        ))}
      </SortableContainer>
    </Block>
  );
};
