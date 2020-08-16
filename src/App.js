import React from "react";

import "./App.css";

import { onMIDIMessageLog, onMIDIFailure } from "./helpers";
import { padReducer, initialState } from "./pad";
import { NAME, NN_INVERT, MM_INVERT } from "./constants";

import { Pad } from "./components/Pad";
import { Program, Button, Group, Label } from "./styles";

function App() {
  const outputRef = React.useRef();

  const [pad, padDispatch] = React.useReducer(padReducer, initialState);

  const onMIDIMessage = (event) => {
    const [type, code, value] = event.data;

    padDispatch({
      type,
      code,
      value,
    });

    onMIDIMessageLog(event);
  };

  const onMIDISuccess = (midiAccess) => {
    console.log(midiAccess);

    const inputs = midiAccess.inputs;
    const outputs = midiAccess.outputs;

    for (const input of inputs.values()) {
      input.onmidimessage = onMIDIMessage;
    }

    for (const output of outputs.values()) {
      outputRef.current = output;
    }
  };

  React.useEffect(() => {
    if (navigator.requestMIDIAccess) {
      console.log("есть поддержка");
    } else {
      console.log("нет поддержки");
      return;
    }

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }, []);

  const onChange = React.useCallback(() => {
    // Получение серийного номера
    outputRef.current.send([0xbf, 0x5a, 0x22]);

    // Запрос на выдачу текущих настроек
    outputRef.current.send([0xbf, 0x5a, 0x0e]);
  }, []);

  const onChangePG = (pg) => () => {
    outputRef.current.send([0xc9, pg]);
    outputRef.current.send([0xbf, 0x5a, 0x0e]);
  };

  const onChangeSaveTo = (pgIndex) => () => {
    outputRef.current.send([0xbf, 0x5a, 0x70 + pgIndex]);
    outputRef.current.send([0xbf, 0x5a, 0x0e]);
  };

  const onChangePad = (id, value) => {
    outputRef.current.send([0xbf, +id, +value]);
    setTimeout(() => outputRef.current.send([0xbf, 0x5a, 0x0e]), 250);
  };

  const isProgram = pad.program !== null;

  return (
    <div className="App">
      <header className="App-header">
        {isProgram && (
          <>
            <Program>Program {pad.program + 1}</Program>
            <Pads pad={pad} onChangePad={onChangePad} />
          </>
        )}
        <Group>
          <Label></Label>
          <Button onClick={onChange}>get current program</Button>
        </Group>
        <Group>
          <Label>Load from</Label>
          <Button onClick={onChangePG(0)}>p1</Button>
          <Button onClick={onChangePG(1)}>p2</Button>
          <Button onClick={onChangePG(2)}>p3</Button>
          <Button onClick={onChangePG(3)}>p4</Button>
        </Group>
        {isProgram && (
          <Group>
            <Label>Save to</Label>
            <Button onClick={onChangeSaveTo(0)}>p1</Button>
            <Button onClick={onChangeSaveTo(1)}>p2</Button>
            <Button onClick={onChangeSaveTo(2)}>p3</Button>
            <Button onClick={onChangeSaveTo(3)}>p4</Button>
          </Group>
        )}
      </header>
    </div>
  );
}

const Pads = React.memo((props) => {
  const { pad, onChangePad } = props;

  return (
    <section>
      {Object.values(pad.pads).map((value, index) => (
        <Pad
          key={index}
          {...value}
          name={NAME[index]}
          nn={NN_INVERT[NAME[index]]}
          mm={MM_INVERT[NAME[index]]}
          onChange={onChangePad}
        />
      ))}
    </section>
  );
});

export default App;
