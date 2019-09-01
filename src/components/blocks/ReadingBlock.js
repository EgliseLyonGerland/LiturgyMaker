import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Block from "../Block";
import Sortable from "../Sortable";
import BibleRefPicker from "../BibleRefPicker";

const useStyles = makeStyles(theme => ({
  item: {}
}));

export default ({ block, onChange }) => {
  const classes = useStyles();
  const { data } = block;
  const { title = "", bibleRefs = [] } = data;

  const getDefaultItem = () => ({ ref: "", excerpt: "" });

  const renderItem = (item, index) => (
    <div className={classes.item}>
      <BibleRefPicker
        data={item}
        onChange={value => {
          data.bibleRefs[index] = value;
          onChange(data);
        }}
      />
    </div>
  );

  return (
    <Block className={classes.root} title={title}>
      <Sortable
        items={bibleRefs}
        renderItem={renderItem}
        onChange={refs => {
          data.bibleRefs = refs;
          onChange(data);
        }}
        isItemEmpty={item => !item.ref && !item.excerpt}
        getDefaultItem={getDefaultItem}
        gutters={3}
        neverEmpty
      />
    </Block>
  );
};
