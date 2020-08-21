import React from "react";

import { onMIDIMessageLog, onMIDIFailure, send } from "./helpers";
import { padReducer, initialState } from "./pad";
import { NAME, NN_INVERT, MM_INVERT } from "./constants";

import { Pad } from "./components/Pad";
import {
  Wrapper,
  PadGroup,
  Program,
  Button,
  Group,
  Label,
  Serial,
} from "./styles";

const commands = [
  ["serial_mode",0,0],
  [0xbf, 0x50, 0x24],
  [0xbf, 0x51, 0x28],
  [0xbf, 0x52, 0x2a],
  [0xbf, 0x53, 0x31],
  [0xbf, 0x54, 0x0],
  [0xbf, 0x55, 0x36],
  [0xbf, 0x56, 0x36],
  [0xbf, 0x57, 0x36],
  [0xbf, 0x58, 0x36],
  [0xbf, 0x59, 0x4],
  [0xbf, 0x50, 0x24],
  [0xbf, 0x51, 0x27],
  [0xbf, 0x52, 0x36],
  [0xbf, 0x53, 0x39],
  [0xbf, 0x54, 0x0],
  [0xbf, 0x55, 0x36],
  [0xbf, 0x56, 0x36],
  [0xbf, 0x57, 0x36],
  [0xbf, 0x58, 0x36],
  [0xbf, 0x59, 0x5],
  [0xbf, 0x50, 0x31],
  [0xbf, 0x51, 0x32],
  [0xbf, 0x52, 0x33],
  [0xbf, 0x53, 0x34],
  [0xbf, 0x54, 0x35],
  [0xbf, 0x55, 0x36],
  [0xbf, 0x56, 0x37],
  [0xbf, 0x57, 0x38],
  [0xbf, 0x50, 0x24],
  [0xbf, 0x51, 0x27],
  [0xbf, 0x52, 0x36],
  [0xbf, 0x53, 0x39],
  [0xbf, 0x54, 0x0],
  [0xbf, 0x55, 0x36],
  [0xbf, 0x56, 0x36],
  [0xbf, 0x57, 0x36],
  [0xbf, 0x58, 0x36],
  [0xbf, 0x59, 0x5],
  [0xbf, 0x50, 0x24],
  [0xbf, 0x51, 0x28],
  [0xbf, 0x52, 0x2a],
  [0xbf, 0x53, 0x31],
  [0xbf, 0x54, 0x0],
  [0xbf, 0x55, 0x36],
  [0xbf, 0x56, 0x36],
  [0xbf, 0x57, 0x36],
  [0xbf, 0x58, 0x36],
  [0xbf, 0x59, 0x4],
  [0xbf, 0x50, 0x24],
  [0xbf, 0x51, 0x27],
  [0xbf, 0x52, 0x36],
  [0xbf, 0x53, 0x39],
  [0xbf, 0x54, 0x0],
  [0xbf, 0x55, 0x36],
  [0xbf, 0x56, 0x36],
  [0xbf, 0x57, 0x36],
  [0xbf, 0x58, 0x36],
  [0xbf, 0x59, 0x5],
  [0xbf, 0x50, 0x28],
  [0xbf, 0x51, 0x32],
  [0xbf, 0x52, 0x2f],
  [0xbf, 0x53, 0x29],
  [0xbf, 0x54, 0x0],
  [0xbf, 0x55, 0x36],
  [0xbf, 0x56, 0x36],
  [0xbf, 0x57, 0x36],
  [0xbf, 0x58, 0x36],
  [0xbf, 0x59, 0x6],
  [0xbf, 0x50, 0x24],
  [0xbf, 0x51, 0x26],
  [0xbf, 0x52, 0x28],
  [0xbf, 0x53, 0x29],
  [0xbf, 0x54, 0x0],
  [0xbf, 0x55, 0x6],
  [0xbf, 0x56, 0x36],
  [0xbf, 0x57, 0x36],
  [0xbf, 0x58, 0x36],
  [0xbf, 0x59, 0x7],
];

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

  // debug code
  const randomBoom = () => {
    setTimeout(() => {
      console.log("boom!");
      // 0x99 0x24 0x10
      const note = 38; //21 + ((Math.random() * (108 - 21)) << 0);
      const delay = (Math.random() * 127) << 0;

      padDispatch({
        type: 0x99,
        code: note,
        value: delay,
      });

      if (true) {
        console.log("hhhhh");
        setTimeout(
          () =>
            padDispatch({
              type: 0x99,
              code: note,
              value: 0,
            }),
          300
        );
      }

      setTimeout(
        () =>
          padDispatch({
            type: 0x89,
            code: note,
            value: 0,
          }),
        400
      );

      randomBoom();
    }, Math.random() * 1000 + 900);
  };

  const randomNext = (index) => {
    if (index > commands.length - 1) return;

    setTimeout(() => {
      console.log("next", index);

      padDispatch({
        type: commands[index][0],
        code: commands[index][1],
        value: commands[index][2],
      });

      randomNext(index + 1);
    }, Math.random() * 100);
  };

  React.useEffect(() => {
    randomBoom();
    randomNext(0);

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
    padDispatch({ type: "serial_mode" });
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

  const isProgram = true; // pad.program !== null;

  // if (status === 3) {
  //   return <Wrapper>WebMIDI is not supported in this browser.</Wrapper>;
  // }

  // if (status === 1) {
  //   return (
  //     <Wrapper>
  //       no device
  //       <Button onClick={onClickReload}>again!</Button>
  //     </Wrapper>
  //   );
  // }

  // if (status === 2) {
  //   return (
  //     <Wrapper>
  //       disconnect other devices
  //       <Button onClick={onClickReload}>again!</Button>
  //     </Wrapper>
  //   );
  // }

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
