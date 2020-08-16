import React from "react";

import {
  NOTE_TO_NAME,
  sensOptions,
  dynOptions,
  limOptions,
} from "../../constants";
import { getValue } from "../../helpers";

import { Item } from "../Item";
import { Wrapper, Header, Separator } from "./styles";

const noteOptions = Object.keys(NOTE_TO_NAME).map((value) => {
  return { title: `${value} ${NOTE_TO_NAME[value]}`, value };
});

const format = (value) => `${value.toString(2)} ${value}`;

const Pad = React.memo((props) => {
  const { nn, mm, name, note, value, sens, dyn, lim, onChange } = props;

  const onChangeNote = (value) => {
    if (!onChange) {
      return;
    }

    onChange(nn, value);
  };

  const onChangeSens = (v) => {
    if (!onChange) {
      return;
    }

    const value = getValue({
      sens: +v,
      dyn: +dyn,
      lim: +lim,
    });

    onChange(mm, value);
  };

  const onChangeDyn = (v) => {
    if (!onChange) {
      return;
    }

    const value = getValue({
      sens: +sens,
      dyn: +v,
      lim: +lim,
    });

    onChange(mm, value);
  };

  const onChangeLim = (v) => {
    if (!onChange) {
      return;
    }

    const value = getValue({
      sens: +sens,
      dyn: +dyn,
      lim: +v,
    });

    onChange(mm, value);
  };

  return (
    <Wrapper>
      <Header>{name}</Header>
      <Item
        // title={`${note} (${NOTE_TO_NAME[note]})`}
        title="note"
        options={noteOptions}
        value={note}
        onChange={onChangeNote}
      />
      
      <Separator />

      <Item
        title={`sens (${sens})`}
        options={sensOptions}
        value={sens}
        onChange={onChangeSens}
      />

      <Item
        title={`response (${dyn})`}
        options={dynOptions}
        value={dyn}
        onChange={onChangeDyn}
      />

      <Item
        title={`limiter mode (${lim})`}
        options={limOptions}
        value={lim}
        onChange={onChangeLim}
      />
    </Wrapper>
  );
});

export { Pad };
