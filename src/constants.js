const PAD = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
};

const NAME = [PAD.A, PAD.B, PAD.C, PAD.D];

const NN = {
  [0x50]: PAD.A,
  [0x51]: PAD.B,
  [0x52]: PAD.C,
  [0x53]: PAD.D,
};

const MM = {
  [0x55]: PAD.A,
  [0x56]: PAD.B,
  [0x57]: PAD.C,
  [0x58]: PAD.D,
};

const NN_INVERT = Object.keys(NN).reduce((acc, key) => {
  acc[NN[key]] = key;
  return acc;
}, {});

const MM_INVERT = Object.keys(MM).reduce((acc, key) => {
  acc[MM[key]] = key;
  return acc;
}, {});

const NOTE_TO_NAME = {
  21: "A0",
  22: "A#0",
  23: "B0",
  24: "C1",
  25: "C#1",
  26: "D1",
  27: "D#1",
  28: "E1",
  29: "F1",
  30: "F#1",
  31: "G1",
  32: "G#1",
  33: "A1",
  34: "A#1",
  35: "B1",
  36: "C2",
  37: "C#2",
  38: "D2",
  39: "D#2",
  40: "E2",
  41: "F2",
  42: "F#2",
  43: "G2",
  44: "G#2",
  45: "A2",
  46: "A#2",
  47: "B2",
  48: "C3",
  49: "C#3",
  50: "D3",
  51: "D#3",
  52: "E3",
  53: "F3",
  54: "F#3",
  55: "G3",
  56: "G#3",
  57: "A3",
  58: "A#3",
  59: "B3",
  60: "C4",
  61: "C#4",
  62: "D4",
  63: "D#4",
  64: "E4",
  65: "F4",
  66: "F#4",
  67: "G4",
  68: "G#4",
  69: "A4",
  70: "A#4",
  71: "B4",
  72: "C5",
  73: "C#5",
  74: "D5",
  75: "D#5",
  76: "E5",
  77: "F5",
  78: "F#5",
  79: "G5",
  80: "G#5",
  81: "A5",
  82: "A#5",
  83: "B5",
  84: "C6",
  85: "C#6",
  86: "D6",
  87: "D#6",
  88: "E6",
  89: "F6",
  90: "F#6",
  91: "G6",
  92: "G#6",
  93: "A6",
  94: "A#6",
  95: "B6",
  96: "C7",
  97: "C#7",
  98: "D7",
  99: "D#7",
  100: "E7",
  101: "F7",
  102: "F#7",
  103: "G7",
  104: "G#7",
  105: "A7",
  106: "A#7",
  107: "B7",
  108: "C8",
};

const sensOptions = [
  { title: "LOW", value: "0" },
  { title: "MEDIUM", value: "1" },
  { title: "HIGH", value: "2" },
  { title: "HIGHEST", value: "3" },
];

const dynOptions = [
  { title: "EXPANDED", value: "0" },
  { title: "LINEAR", value: "1" },
  { title: "COMPRESSED", value: "2" },
  { title: "AMPLIFIED", value: "3" },
];

const limOptions = [
  { title: "20..70", value: "0" },
  { title: "1..70", value: "1" },
  { title: "1..110", value: "2" },
  { title: "20..110", value: "3" },
  { title: "50..110", value: "4" },
  { title: "50..127", value: "5" },
  { title: "20..127", value: "6" },
  { title: "1..127", value: "7" },
];

export {
  PAD,
  NAME,
  NN,
  MM,
  NN_INVERT,
  MM_INVERT,
  NOTE_TO_NAME,
  sensOptions,
  dynOptions,
  limOptions,
};
