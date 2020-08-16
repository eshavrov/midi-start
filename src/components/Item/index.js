import React from "react";

import { ComboBox } from "../ComboBox";
import { Wrapper, Label } from "./styles";

const Item = (props) => {
  const { title, options, value, onChange } = props;

  return (
    <Wrapper>
      <Label>{title}</Label>
      <ComboBox options={options} value={value} onChange={onChange} />
    </Wrapper>
  );
};

export { Item };
