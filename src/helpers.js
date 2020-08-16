const onMIDIMessageLog = (event) => {
  var str =
    "MIDI message received at timestamp " +
    event.timestamp +
    "[" +
    event.data.length +
    " bytes]: ";

  for (var i = 0; i < event.data.length; i++) {
    str += "0x" + event.data[i].toString(16) + " ";
  }

  console.log(str);
};

const onMIDIFailure = () => {
  console.log("Could not access your MIDI devices.");
};

const getValue = ({ sens = 0, dyn = 0, lim = 0 }) => {
  const value = (lim << 4) + (dyn << 2) + sens;

  return value;
};

export { onMIDIMessageLog, onMIDIFailure, getValue };
