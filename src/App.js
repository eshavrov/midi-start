import React from "react";

import "./App.css";

import { onMIDIMessageLog, onMIDIFailure } from "./helpers";
import { padReducer, initialState } from "./pad";
import { NAME, NN_INVERT, MM_INVERT } from "./constants";

import { Pad } from "./components/Pad";

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
      console.log(input?.data);
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
            <h1>Programa {pad.program + 1}</h1>
            <Pads pad={pad} onChangePad={onChangePad} />
          </>
        )}
        <button onClick={onChange}>get current</button>
        <button onClick={onChangePG(0)}>pg1</button>
        <button onClick={onChangePG(1)}>pg2</button>
        <button onClick={onChangePG(2)}>pg3</button>
        <button onClick={onChangePG(3)}>pg4</button>

        <button onClick={onChangeSaveTo(0)}>save pg1</button>
        <button onClick={onChangeSaveTo(1)}>save pg2</button>
        <button onClick={onChangeSaveTo(2)}>save pg3</button>
        <button onClick={onChangeSaveTo(3)}>save pg4</button>
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
