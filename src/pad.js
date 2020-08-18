import { PAD, NN, MM } from "./constants";

const initialState = {
  program: null,
  pads: {
    [PAD.A]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
    [PAD.B]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
    [PAD.C]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
    [PAD.D]: { note: 0, value: 0, sens: 0, dyn: 0, lim: 0, velocity: 0 },
  },
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

    const sensValue = value & 0b011;
    const dynValue = (value >>> 2) & 0b011;
    const limValue = (value >>> 4) & 0b0111;

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
    case 0xbf: {
      if (action.code === 0x59) {
        const program = action.value & 0b011;

        return {
          ...state,
          program,
        };
      }

      return {
        ...state,
        pads: { ...state.pads, ...getPad(state.pads, action) },
      };
    }

    case 0x99:
    case 0x89: {
      const currentPads = [];

      Object.keys(state.pads).forEach((key) => {
        if (+state.pads[key].note === +action.code) {
          currentPads.push(key);
        }
      });

      if (currentPads.length === 0) {
        return state;
      }

      const currentPad = currentPads[0];

      return {
        ...state,
        pads: {
          ...state.pads,
          [currentPad]: { ...state.pads[currentPad], velocity: action.value },
        },
      };
    }
    default: {
      return state;
    }
  }
};

export { padReducer, initialState };
