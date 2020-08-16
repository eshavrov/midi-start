import React from "react";

import { NOTE_TO_NAME } from "../../constants";
import { ComboBox } from "../ComboBox";
import { getValue } from "../../helpers";

const sensOptions = [
  { title: "0", value: "0" },
  { title: "1", value: "1" },
  { title: "2", value: "2" },
  { title: "3", value: "3" },
];

const dynOptions = [
  { title: "0", value: "0" },
  { title: "1", value: "1" },
  { title: "2", value: "2" },
  { title: "3", value: "3" },
];

const limOptions = [
  { title: "0", value: "0" },
  { title: "1", value: "1" },
  { title: "2", value: "2" },
  { title: "3", value: "3" },
  { title: "4", value: "4" },
  { title: "5", value: "5" },
  { title: "6", value: "6" },
  { title: "7", value: "7" },
];

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
    <div className="pad">
      <h1>{name}</h1>
      <p className="note">
        {note} ({NOTE_TO_NAME[note]})
        <ComboBox options={noteOptions} value={note} onChange={onChangeNote} />
      </p>
      <p className="value">
        {value} {format(value)}
      </p>
      <p className="sens">
        sens: {format(sens)}
        <ComboBox options={sensOptions} value={sens} onChange={onChangeSens} />
      </p>
      <p className="dyn">
        dyn: {format(dyn)}
        <ComboBox options={dynOptions} value={dyn} onChange={onChangeDyn} />
      </p>
      <p className="lim">
        lim: {format(lim)}
        <ComboBox options={limOptions} value={lim} onChange={onChangeLim} />
      </p>
    </div>
  );
});

export { Pad };
