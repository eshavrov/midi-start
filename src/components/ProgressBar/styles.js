import styled from "styled-components";

const Progress = styled.div`
  height: 12px;
  position: relative;
  background: #555;
  -moz-border-radius: 25px;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  padding: 10px;
  margin-top: 24px;
  /* box-shadow: inset 0 -1px 1px rgba(255,255,255,0.3); */
  width: 90%;
`;
const Value = styled.span`
  display: block;
  height: 100%;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background-color: rgb(43, 194, 83);
  /* background-image: linear-gradient(
    center bottom,
    rgb(43,194,83) 37%,
    rgb(84,240,84) 69%
  );
  box-shadow: 
    inset 0 2px 9px  rgba(255,255,255,0.3),
    inset 0 -2px 6px rgba(0,0,0,0.4); */
  position: relative;
  overflow: hidden;
`;

export { Progress, Value };
