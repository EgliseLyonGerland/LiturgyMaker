import React from "react";
import Sortable from "../Sortable";
import BibleRefPicker from "../BibleRefPicker";

export default ({ block, onChange, onFocus, onBlur }) => {
  const { data } = block;
  const { bibleRefs = [] } = data;

  const getDefaultItem = () => ({ ref: "", excerpt: "" });

  const renderItem = (item, index) => (
    <BibleRefPicker
      data={item}
      onChange={value => {
        data.bibleRefs[index] = value;
        onChange(data);
      }}
      onFocus={path => {
        onFocus(["bibleRefs", index, ...path]);
      }}
      onBlur={onBlur}
    />
  );

  return (
    <Sortable
      items={bibleRefs}
      renderItem={renderItem}
      onChange={refs => {
        data.bibleRefs = refs;
        onChange(data);
      }}
      getDefaultItem={getDefaultItem}
      gutters={3}
    />
  );
};
