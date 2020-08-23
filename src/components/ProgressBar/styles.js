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
  position: relative;
  overflow: hidden;
`;

export { Progress, Value };
