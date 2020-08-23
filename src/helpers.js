const onMIDIMessageLog = (event) => {
  let str ="<< ";

  for (var i = 0; i < event.data.length; i++) {
    str += "0x" + event.data[i].toString(16) + " ";
  }

  console.log(str);
};

const onMIDIFailure = () => {
  console.log("Could not access your MIDI devices.");
};

const getValue = ({ sens = 0, dyn = 0, lim = 0 }) => {
  const value = (lim << 3) + (dyn << 1) + sens;

  return value;
};

const send = (ref,...args) => {
  ref.send(...args);
  const [values] = args;

  let str =">> ";

  for (var i = 0; i < values.length; i++) {
    str += "0x" + values[i].toString(16) + " ";
  }

  console.log(str);

}

export { onMIDIMessageLog, onMIDIFailure, getValue, send };
