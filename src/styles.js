import styled from "styled-components";

const Program = styled.h2`
color: #ccc;
`;


const Button = styled.button`
  border: none;
  font-family: inherit;
  font-size: 24;
  cursor: pointer;
  padding: 8px 24px;
  display: inline-block;
  margin: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  outline: none;
  position: relative;

  background: #333;
  color: #ccc;
  box-shadow: 0 4px #111, inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 4px;

  :hover {
    box-shadow: 0 2px #111;
    top: 2px;
  }

  :active {
    box-shadow: 0 0 #111;
    top: 4px;
  }
`;

const Group = styled.div`
  display: flex;
`;
const Label = styled.div`
	font-size: 16px;
	color: #aaa;
  margin: 16px 8px 0 0;
  width: 80px;
`;

export { Program, Button, Group, Label };
