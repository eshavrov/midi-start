import React from "react";
import { Progress, Value } from "./styles";

const ProgressBar = (props) => {
	const { value } = props;
	
  return (
    <Progress>
      <Value
        style={{
          width: `${value << 0}%`,
        }}
        value={value}
      ></Value>
    </Progress>
  );
};

export { ProgressBar };
