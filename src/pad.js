import { PAD, NN, MM } from "./constants";

const initialState = {
  disabled: false,
  serialMode: false,
  path: false,
  firmwareVersion: null,
  progress: 0,
  version: "?",
  calibrate: null,
  serial: "        ",
  program: null,
  lastStroke: null,
  pads: {
    [PAD.A]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
    [PAD.B]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
    [PAD.C]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
    [PAD.D]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
  },
};

const replaceAt = (string, index, replacement) => {
  return (
    string.substr(0, index) +
    replacement +
    string.substr(index + replacement.length)
  );
};

const getPad = (state, { code, value }) => {
  if (Object.keys(NN).includes(`${code}`)) {
    const currentPad = NN[code];

    return {
      [currentPad]: {
        ...state[currentPad],
        note: `${value}`,
      },
    };
  }

  if (Object.keys(MM).includes(`${code}`)) {
    const currentPad = MM[code];

    const sensValue = value & 0b01;
    const dynValue = (value >>> 1) & 0b011;
    const limValue = (value >>> 3) & 0b01111;

    return {
      [currentPad]: {
        ...state[currentPad],
        value: value,
        sens: sensValue,
        dyn: dynValue,
        lim: limValue,
      },
    };
  }

  return state;
};

const padReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "progress": {
      return { ...state, progress: action.value };
    }

    case "set_mode": {
      const { code: mode, value = true } = action;
      return { ...state, [mode]: value };
    }

    case 0xbf: {
      if (
        state.serialMode === true &&
        action.code >= 0x50 &&
        action.code <= 0x57
      ) {
        const index = action.code - 0x50;
        const char = String.fromCharCode(action.value);
        const serial = replaceAt(state.serial, index, char);
        const serialMode = action.code !== 0x57;
        return {
          ...state,
          serialMode,
          serial,
        };
      }

      if (action.code === 0x59) {
        const program = action.value & 0b011;

        const version = (action.value >>> 2) & 0b011111;

        return {
          ...state,
          program,
          version,
        };
      }

      return {
        ...state,
        pads: { ...state.pads, ...getPad(state.pads, action) },
      };
    }

    case 0x99: {
      const currentPads = [];

      Object.keys(state.pads).forEach((key) => {
        if (+state.pads[key].note === +action.code) {
          currentPads.push(key);
        }
      });

      if (currentPads.length === 0) {
        return state;
      }

      const lastStroke = action.code;

      const next = currentPads.reduce((acc, pad) => {
        acc[pad] = { ...state.pads[pad], velocity: action.value };
        return acc;
      }, {});

      return {
        ...state,
        lastStroke,

        pads: {
          ...state.pads,
          ...next,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export { padReducer, initialState };
