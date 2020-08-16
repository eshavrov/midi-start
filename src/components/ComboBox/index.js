import React from "react";

const ComboBox = (props) => {
  const { options, value, onChange } = props;

  const _onChange = React.useCallback((event) => {
    if (!onChange) {
      return;
    }
    onChange(event.target.value);
  }, [onChange]);

  return (
    <select className="select-css" defaultValue={value} onChange={_onChange}>
      {options.map(({ title, value: optionValue }, index) => (
        <option key={index} value={optionValue}>
          {title}
        </option>
      ))}
    </select>
  );
};

export { ComboBox };
