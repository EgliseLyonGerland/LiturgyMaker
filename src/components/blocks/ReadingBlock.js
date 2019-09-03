import React from "react";
import Block from "../Block";
import Sortable from "../Sortable";
import BibleRefPicker from "../BibleRefPicker";

export default ({ block, onChange }) => {
  const { data } = block;
  const { title = "", bibleRefs = [] } = data;

  const getDefaultItem = () => ({ ref: "", excerpt: "" });

  const renderItem = (item, index) => (
    <div>
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
    <Block title={title}>
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
