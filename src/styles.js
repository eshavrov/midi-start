import styled from "styled-components";

const Wrapper = styled.header`
  position: relative;
  text-align: center;
  background-color: #252727;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  width: 100vw;
`;

const PadGroup = styled.section`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
`;

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
  margin: 6px 8px;
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
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-size: 16px;
  color: #aaa;
  margin: 16px 8px 0 0;
  width: 80px;
  text-align: right;
`;

const Serial = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
  color: #bbb;
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

export { Wrapper, PadGroup, Program, Button, Group, Label, Serial };
