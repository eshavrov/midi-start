import React from "react";

const BackIcon = ({ className, onClick }) => (
  <svg
    className={className}
    onClick={onClick}
    width="18"
    height="28"
    viewBox="0 0 9 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="#999">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.19992 7L8.09998 1.09994L7.00003 0L3.24839e-05 7L7.00003 14L8.09998 12.9001L2.19992 7Z"
      />
    </g>
  </svg>
);

export { BackIcon };
