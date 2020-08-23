import React from "react";

import { onMIDIMessageLog, onMIDIFailure, send } from "./helpers";
import { padReducer, initialState } from "./pad";
import { NAME, NN_INVERT, MM_INVERT, NOTE_TO_NAME } from "./constants";

import { Pad } from "./components/Pad";
import { ProgressBar } from "./components/ProgressBar";

import {
  Wrapper,
  PadGroup,
  Button,
  Group,
  Label,
  Serial,
  SettingsPanel,
  Header,
  Separator,
  Back,
  Settings,
  Logo,
  Top,
  Name,
  Text,
} from "./styles";

const messages = {
  weak: (
    <>
      The WEAK stroke calibration is in progress now. Please do a few dozen WEAK
      strokes on each pad to learn Pad-Stick to recognize them. To terminate
      this process please press the "Stop Calibration" button.
    </>
  ),
  medium: (
    <>
      The WEAK stroke calibration is in progress now. Please do a few dozen
      MEDIUM strokes on each pad to learn Pad-Stick to recognize them. To
      terminate this process please press the "Stop Calibration" button.
    </>
  ),
  hard: (
    <>
      The WEAK stroke calibration is in progress now. Please do a few dozen HARD
      strokes on each pad to learn Pad-Stick to recognize them. To terminate
      this process please press the "Stop Calibration" button.
    </>
  ),
};

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readAllBytesAsUInt8Array(path) {
  return new Promise((resolve) => {
    var req = new XMLHttpRequest();
    req.open("GET", path, true);
    req.responseType = "arraybuffer";
    req.onload = function () {
      var arrayBuffer = req.response;
      if (arrayBuffer) {
        resolve(arrayBuffer);
      }
    };

    req.send(null);
  });
}

function App() {
  const outputRef = React.useRef();
  const [status, setStatus] = React.useState(1);
  const [pad, padDispatch] = React.useReducer(padReducer, initialState);
  const [showSettings, setShowSettings] = React.useState(false);
  const [changed, setChanged] = React.useState(false);
  const [saved, setSaved] = React.useState(null);

  const onStateChange = ({ port }) => {
    padDispatch({
      type: "set_mode",
      code: "disabled",
      value: port.connection !== "open",
    });
  };

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

    midiAccess.onstatechange = onStateChange;

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

    navigator
      .requestMIDIAccess({ sysex: true })
      .then(onMIDISuccess, onMIDIFailure);
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
    setChanged(false);
    setSaved(null);
  };

  const onChangeSaveTo = (programIndex) => () => {
    send(outputRef.current, [0xbf, 0x5a, 0x70 + programIndex]);
    send(outputRef.current, [0xbf, 0x5a, 0x0e]);
    setChanged(false);
    setSaved(programIndex + 1);
  };

  const onChangePad = (id, value) => {
    send(outputRef.current, [0xbf, +id, +value]);
    setTimeout(() => send(outputRef.current, [0xbf, 0x5a, 0x0e]), 250);
    setChanged(true);
    setSaved(null);
  };

  const onChangeSendFile = async () => {
    padDispatch({ type: "set_mode", code: "patch" });

    const buffer = await readAllBytesAsUInt8Array("./PadStickV01.syx");

    padDispatch({ type: "progress", value: 0 });
    send(outputRef.current, new Uint8Array(buffer));

    const sizeChunk = 256;
    const length = buffer.byteLength;
    let pos = 0;

    do {
      const dataView = new DataView(
        buffer,
        [pos],
        [Math.min(sizeChunk, length - pos)]
      );

      const arr = Array.from({ length: dataView.byteLength }, (_, index) =>
        dataView.getUint8(index)
      );
      // send(outputRef.current, arr);

      await timeout(100);
      pos += sizeChunk;
      padDispatch({ type: "progress", value: Math.min(pos / length, 1) });
    } while (pos < length);

    await timeout(1000);

    // padDispatch({ type: "set_mode", code: "patch", value: false });
  };

  const onChangeCalibrate = (type) => () => {
    padDispatch({ type: "set_mode", code: "calibrate", value: type });

    switch (type) {
      case "weak": {
        send(outputRef.current, [0xbf, 0x5a, 0x7a]);
        break;
      }
      case "medium": {
        send(outputRef.current, [0xbf, 0x5a, 0x7b]);
        break;
      }
      case "hard": {
        send(outputRef.current, [0xbf, 0x5a, 0x7c]);
        break;
      }
      case "stop": {
        send(outputRef.current, [0xbf, 0x5a, 0x7d]);
        break;
      }
    }
  };

  const isProgram = pad.program !== null;
  if (pad.patch) {
    const value = pad.progress * 100;
    return (
      <Wrapper>
        {value === 100 ? (
          <Text>
            Firmware image has been uploaded. Please reconnect the USB and wait
            25 sec for installation.
          </Text>
        ) : (
          <>
            <Text>The Firmware is uploading now. Please wait!</Text>
            <ProgressBar value={value} />
          </>
        )}
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

  if (pad.disabled) {
    return (
      <Wrapper>
        <Text>Opps! No connect with Pad-Stick!</Text>
      </Wrapper>
    );
  }

  const isCalibrate = ["weak", "medium", "hard"].includes(pad.calibrate);
  const isChanged = changed;
  const isSaved = saved;

  return (
    <Wrapper>
      <Top>
        <Logo />
        <Name>Pad-Stick</Name>
      </Top>

      {isProgram && (
        <>
          <Serial>
            Connected&nbsp;device&nbsp;S/N:&nbsp;{pad.serial}&nbsp;
            Firmware&nbsp;version:&nbsp;{pad.version}&nbsp;&nbsp;
            {isSaved !== null ? (
              <>Values saved to program {saved}!</>
            ) : isChanged ? (
              <>Values were changed!</>
            ) : (
              <>Values&nbsp;from&nbsp;program:&nbsp;{pad.program + 1}</>
            )}
            &nbsp;&nbsp;
            {pad.lastStroke && <>Last stroke: {NOTE_TO_NAME[pad.lastStroke]}</>}
          </Serial>
          <Pads pad={pad} onChangePad={onChangePad} />
        </>
      )}
      <Group>
        <Button onClick={onChange}>get current values</Button>
      </Group>
      <Label>Load from</Label>
      <Group>
        <Button onClick={onChangePG(0)}>p1</Button>
        <Button onClick={onChangePG(1)}>p2</Button>
        <Button onClick={onChangePG(2)}>p3</Button>
        <Button onClick={onChangePG(3)}>p4</Button>
      </Group>
      {isProgram && (
        <>
          <Label>Save to</Label>
          <Group>
            <Button onClick={onChangeSaveTo(0)}>p1</Button>
            <Button onClick={onChangeSaveTo(1)}>p2</Button>
            <Button onClick={onChangeSaveTo(2)}>p3</Button>
            <Button onClick={onChangeSaveTo(3)}>p4</Button>
          </Group>
        </>
      )}

      <Settings onClick={() => setShowSettings(true)} />
      <SettingsPanel show={showSettings}>
        {isCalibrate ? (
          <>
            <Header>{messages[pad.calibrate]}</Header>
            <Group l={true}>
              <Button onClick={onChangeCalibrate("stop")}>
                Stop calibration
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Back onClick={() => setShowSettings(false)} />
            <Header>Settings:</Header>
            <Group l={true}>
              <Button onClick={onChangeCalibrate("weak")}>
                Calibrate weak strokes
              </Button>
              <Button onClick={onChangeCalibrate("medium")}>
                Calibrate medium strokes
              </Button>
              <Button onClick={onChangeCalibrate("hard")}>
                Calibrate hard stroke
              </Button>
            </Group>
            <Separator />
            <Group l={true}>
              <Button onClick={onChangeSendFile}>Update firmware</Button>
            </Group>
          </>
        )}
      </SettingsPanel>
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
