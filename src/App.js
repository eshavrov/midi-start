import React from "react";

import { onMIDIMessageLog, onMIDIFailure, send } from "./helpers";
import { padReducer, initialState } from "./pad";
import { NAME, NN_INVERT, MM_INVERT, NOTE_TO_NAME } from "./constants";

import { Pad } from "./components/Pad";
import { Item } from "./components/Item";

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
  Line,
  QuestionMark,
  WrapperHelp,
  WindowHelp,
  TextHelp,
} from "./styles";

const STATUS = {
  NO_DEVICES: 1,
  ONE_DEVICE: 0,
  LIST_DEVICES: 2,
  NOT_SUPPORTED: 3,
};

const messages = {
  calibration: (
    <>
      The stroke calibration is&nbsp;in&nbsp;progress now. Please
      do&nbsp;8&nbsp;WEAK strokes and 25&nbsp;HARD strokes on&nbsp;each pad.
      It&nbsp;allows the Pad-Stick to&nbsp;recognize full dynamic range.
      Acoording LEDs should be&nbsp;flashing. Press &laquo;Stop
      Calibration&raquo; button when finish.
    </>
  ),
  nameOption: (
    <>
      The USB-device name has been changed (an&nbsp;index added). Please use the
      system settings of&nbsp;your&nbsp;OS to&nbsp;delete USB-device with
      previous name. New device will appear at&nbsp;the next connection.
    </>
  ),
};

const helpMessages = {
  nameOption: (
    <>
      This function allows you to&nbsp;alternate the name of&nbsp;this
      USB-device. The alternative names could be&nbsp;required if&nbsp;you use
      two or&nbsp;more Pad-Sticks simultaneously. Some random digital
      or&nbsp;letter index will be&nbsp;added to&nbsp;the current name. This
      function will take affect after disconnection and next connection.
    </>
  ),
  firmwareUpdate: (
    <>Use this function to&nbsp;update the firmware with the last version.</>
  ),
  programChange: (
    <>
      These buttons do&nbsp;the same as&nbsp;the MIDI-commands PC1..PC4 sent
      to&nbsp;Ch10 of&nbsp;the Pad-Sticks. This function loads the set
      of&nbsp;settings to&nbsp;Pad-Sticks. Notes, dynamic response curves and
      velocity limits will be&nbsp;setup to&nbsp;the values preliminary saved
      to&nbsp;a&nbsp;program.
    </>
  ),
  saveToProgram: (
    <>
      Use one of&nbsp;these buttons if&nbsp;you would like to&nbsp;save current
      settings to&nbsp;a&nbsp;program. The set of&nbsp;settings (Notes, dynamic
      response curves and velocity limits) will be&nbsp;saved.
    </>
  ),
  calibrateStrokes: (
    <>
      This is&nbsp;personalization feature. This function allows to&nbsp;learn
      Pad-Stick to&nbsp;work in&nbsp;full dynamic range of&nbsp;your strokes.
      It&nbsp;learns the pads to&nbsp;determine all strokes from weak
      to&nbsp;hard values. Use it&nbsp;a&nbsp;single time before playing.
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
  const [devices, setDevices] = React.useState([]);
  const [deviceId, setDeviceId] = React.useState("-1");
  const [help, setHelp] = React.useState(null);

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
      setStatus(STATUS.NO_DEVICES);
      return;
    }

    if (inputs.size > 0) {
      setDevices({
        inputs,
        outputs,
        list: [
          { title: "Choose the one...", value: "-1" },
          ...[...inputs.values()].map(({ name }) => ({
            value: name,
            title: `${name}`,
          })),
        ],
      });

      setStatus(STATUS.LIST_DEVICES);
      return;
    }

    setStatus(STATUS.ONE_DEVICE);

    for (const input of inputs.values()) {
      input.onmidimessage = onMIDIMessage;
    }

    for (const output of outputs.values()) {
      outputRef.current = output;
    }
  };

  React.useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setStatus(STATUS.NOT_SUPPORTED);
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

  const onChangeDevice = (deviceId) => {
    setDeviceId(deviceId);
  };

  const onChangeConnect = () => {
    if (deviceId && deviceId !== "-1") {
      let selectedInput = false;
      let selectedOutput = false;

      for (const input of devices.inputs.values()) {
        if (input.name === deviceId) {
          input.onmidimessage = onMIDIMessage;
          selectedInput = true;
          break;
        }
      }

      for (const output of devices.outputs.values()) {
        if (output.name === deviceId) {
          outputRef.current = output;
          selectedOutput = true;
          break;
        }
      }

      if (selectedInput && selectedOutput) {
        setStatus(STATUS.ONE_DEVICE);
      } else {
        console.error("Opps!");
      }
    }
  };

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

    const buffer = await readAllBytesAsUInt8Array("./PadStickFW.syx");

    padDispatch({ type: "progress", value: 0 });
    // send(outputRef.current, new Uint8Array(buffer));

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
      send(outputRef.current, arr);

      await timeout(200);

      pos += sizeChunk;
      padDispatch({ type: "progress", value: Math.min(pos / length, 1) });
    } while (pos < length);

    await timeout(1000);

    // padDispatch({ type: "set_mode", code: "patch", value: false });
  };

  const onChangeCalibrate = (type) => () => {
    padDispatch({ type: "set_mode", code: "calibrate", value: type });

    switch (type) {
      case "nameOption": {
        send(outputRef.current, [0xbf, 0x5a, 0x7b]);
        break;
      }
      case "calibration": {
        send(outputRef.current, [0xbf, 0x5a, 0x7c]);
        break;
      }
      case "stop": {
        send(outputRef.current, [0xbf, 0x5a, 0x7d]);
        break;
      }
    }
  };
  const isConnectDisabled = !deviceId || deviceId === "-1";

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

  if (status === STATUS.NOT_SUPPORTED) {
    return <Wrapper>WebMIDI is not supported in this browser.</Wrapper>;
  }

  if (status === STATUS.NO_DEVICES) {
    return (
      <Wrapper>
        no device
        <Button onClick={onClickReload}>again!</Button>
      </Wrapper>
    );
  }

  if (status === STATUS.LIST_DEVICES) {
    return (
      <Wrapper>
        <Item
          title={"Select midi-device:"}
          options={devices.list}
          value={deviceId}
          onChange={onChangeDevice}
        />
        <Button onClick={onChangeConnect} disabled={isConnectDisabled}>
          connect
        </Button>
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

  const isCalibrate = ["calibration"].includes(pad.calibrate);
  const isNameOption = ["nameOption"].includes(pad.calibrate);
  const isChanged = changed;
  const isSaved = saved;

  // if (help && helpMessages[help]) {
  //   return (
  //     <Wrapper>
  //       <TextHelp>{helpMessages[help]}</TextHelp>
  //       <Button onClick={() => setHelp(null)}>Ok</Button>
  //     </Wrapper>
  //   );
  // }

  return (
    <Wrapper>
      <Top>
        <Logo />
        <Name>Pad-Stick</Name>
      </Top>

      {isProgram && (
        <>
          <Serial>
            Connected&nbsp;device&nbsp;S/N:&nbsp;{pad.serial}&nbsp;{" "}
            Firmware&nbsp;version:&nbsp;{pad.version}&nbsp;&nbsp;{" "}
            {isSaved !== null ? (
              <>Values saved to program {saved}!</>
            ) : isChanged ? (
              <>Values were changed!</>
            ) : (
              <>Values&nbsp;from&nbsp;program:&nbsp;{pad.program + 1}</>
            )}
            &nbsp;&nbsp;{" "}
            {pad.lastStroke && (
              <>Last&nbsp;stroke: {NOTE_TO_NAME[pad.lastStroke]}</>
            )}
          </Serial>
          <Pads pad={pad} onChangePad={onChangePad} />
        </>
      )}
      <Group>
        <Button onClick={onChange}>get current values</Button>
      </Group>
      {isProgram && (
        <>
          <Label>
            Load from <QuestionMark onClick={() => setHelp("programChange")} />
          </Label>
          <Group>
            <Button onClick={onChangePG(0)}>p1</Button>
            <Button onClick={onChangePG(1)}>p2</Button>
            <Button onClick={onChangePG(2)}>p3</Button>
            <Button onClick={onChangePG(3)}>p4</Button>
          </Group>

          <Label>
            Save to <QuestionMark onClick={() => setHelp("saveToProgram")} />
          </Label>
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
        {isNameOption ? (
          <>
            <Header>{messages[pad.calibrate]}</Header>
            <Button onClick={onClickReload}>Ok</Button>
          </>
        ) : isCalibrate ? (
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
              <Line>
                <Button onClick={onChangeCalibrate("calibration")}>
                  Calibrate strokes
                </Button>
                <QuestionMark onClick={() => setHelp("calibrateStrokes")} />
              </Line>
              <Line>
                <Button onClick={onChangeCalibrate("nameOption")}>
                  Name option
                </Button>
                <QuestionMark onClick={() => setHelp("nameOption")} />
              </Line>
            </Group>
            <Separator />
            <Group l={true}>
              <Line>
                <Button onClick={onChangeSendFile}>Update firmware</Button>
                <QuestionMark onClick={() => setHelp("firmwareUpdate")} />
              </Line>
            </Group>
          </>
        )}
      </SettingsPanel>
      {help && helpMessages[help] && (
        <WrapperHelp onClick={() => setHelp(null)}>
          <WindowHelp>
            <TextHelp>{helpMessages[help]}</TextHelp>
            <Button onClick={() => setHelp(null)}>Ok</Button>
          </WindowHelp>
        </WrapperHelp>
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
