import React from "react";

import { onMIDIMessageLog, onMIDIFailure, send } from "./helpers";
import { padReducer, initialState } from "./pad";
import { NAME, NN_INVERT, MM_INVERT } from "./constants";

import { Pad } from "./components/Pad";
import { ProgressBar } from "./components/ProgressBar";

import {
  Wrapper,
  PadGroup,
  Program,
  Button,
  Group,
  Label,
  Serial,
} from "./styles";

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readAllBytesAsUInt8Array(path) {
  var req = new XMLHttpRequest();
  req.open("GET", path, false);
  req.overrideMimeType("text/plain; charset=binary-data");
  req.send(null);
  if (req.status !== 200) {
    console.log("error");
    return null;
  }
  var text = req.responseText;
  var encoder = new TextEncoder("utf-8");
  var resultArray = encoder.encode(text);
  return resultArray.buffer;
}

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
    padDispatch({ type: "set_mode", code: "serialMode" });
    send(outputRef.current, [0xbf, 0x5a, 0x22]);

    // Запрос на выдачу текущих настроек
    send(outputRef.current, [0xbf, 0x5a, 0x0e]);
  }, []);

  const onChangePG = (program) => () => {
    send(outputRef.current, [0xc9, program]);
    send(outputRef.current, [0xbf, 0x5a, 0x0e]);
  };

  const onChangeSaveTo = (programIndex) => () => {
    send(outputRef.current, [0xbf, 0x5a, 0x70 + programIndex]);
    send(outputRef.current, [0xbf, 0x5a, 0x0e]);
  };

  const onChangePad = (id, value) => {
    send(outputRef.current, [0xbf, +id, +value]);
    setTimeout(() => send(outputRef.current, [0xbf, 0x5a, 0x0e]), 250);
  };

  const onChangeSendFile = async () => {
    padDispatch({ type: "set_mode", code: "patch" });

    const buffer = readAllBytesAsUInt8Array("./PadStickV01.syx");
    const step = 256;
    const length = buffer.byteLength;
    let pos = 0;
    padDispatch({ type: "progress", value: 0 });

    do {
      const dataView = new DataView(
        buffer,
        [pos],
        [Math.min(step, length - pos)]
      );

      const arr = Array.from({ length: dataView.byteLength }, (_, index) =>
        dataView.getUint8(index)
      );
      console.log("send ->>", arr);
      // send(outputRef.current, arr;

      await timeout(100);
      pos += step;
      padDispatch({ type: "progress", value: Math.min(pos / length, 1) });
    } while (pos < length);

    await timeout(1000);

    padDispatch({ type: "set_mode", code: "patch", value: false });
  };

  const isProgram =  pad.program !== null;
  if (pad.patch) {

    const value = (pad.progress * 100);
    return (
      <Wrapper>
        Updating the device firmware...
        <ProgressBar value={value} />
      </Wrapper>
    );
  }

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
      <Button onClick={onChangeSendFile}>file</Button>
      <Serial>S/N: {pad.serial}</Serial>
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
