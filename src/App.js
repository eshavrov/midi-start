import React from "react";

import { onMIDIMessageLog, onMIDIFailure, send } from "./helpers";
import { padReducer, initialState } from "./pad";
import { NAME, NN_INVERT, MM_INVERT } from "./constants";

import { Pad } from "./components/Pad";
import { Wrapper, PadGroup, Program, Button, Group, Label } from "./styles";

function App() {
  const outputRef = React.useRef();
  const [status, setStatus] = React.useState(1);
  const [pad, padDispatch] = React.useReducer(padReducer, initialState);

  const onMIDIMessage = (event) => {
    const [type, code, value] = event.data;

    padDispatch({
      type,
      code,
      value,
    });

    if (type === 0x99) {
      setTimeout(
        () =>
          padDispatch({
            type: 0x99,
            code,
            value: 0,
          }),
        300
      );
    }

    onMIDIMessageLog(event);
  };

  const onMIDISuccess = (midiAccess) => {
    const inputs = midiAccess.inputs;
    const outputs = midiAccess.outputs;

    if (inputs.size === 0 || outputs.size === 0) {
      setStatus(1);
      return;
    }

    if (inputs.size > 1 || outputs.size > 1) {
      setStatus(2);
      return;
    }

    setStatus(0);

    for (const input of inputs.values()) {
      input.onmidimessage = onMIDIMessage;
    }

    for (const output of outputs.values()) {
      outputRef.current = output;
    }
  };

  React.useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setStatus(3);
      return;
    }

    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
  }, []);

  const onClickReload = React.useCallback(
    () => window.location.reload(true),
    []
  );

  const onChange = React.useCallback(() => {
    // Получение серийного номера
    send(outputRef.current, [0xbf, 0x5a, 0x22]);

    // Запрос на выдачу текущих настроек
    send(outputRef.current, [0xbf, 0x5a, 0x0e]);
  }, []);

  const onChangePG = (program) => () => {
    send(outputRef.current, [0xc9, program]);
    send(outputRef.current, [0xbf, 0x5a, 0x0e]);
  };

  const onChangeSaveTo = (programIndex) => () => {
    send(outputRef.current, [0xbf, 0x5a, 0x70 + programIndex])
    send(outputRef.current, [0xbf, 0x5a, 0x0e]);
  };

  const onChangePad = (id, value) => {
    send(outputRef.current, [0xbf, +id, +value]);
    setTimeout(() => send(outputRef.current, [0xbf, 0x5a, 0x0e]), 250);
  };

  const isProgram = pad.program !== null;

  if (status === 3) {
    return <Wrapper>WebMIDI is not supported in this browser.</Wrapper>;
  }

  if (status === 1) {
    return (
      <Wrapper>
        no device
        <Button onClick={onClickReload}>again!</Button>
      </Wrapper>
    );
  }

  if (status === 2) {
    return (
      <Wrapper>
        disconnect other devices
        <Button onClick={onClickReload}>again!</Button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
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
    </Wrapper>
  );
}

const Pads = React.memo((props) => {
  const { pad, onChangePad } = props;

  return (
    <PadGroup>
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
    </PadGroup>
  );
});

export default App;
