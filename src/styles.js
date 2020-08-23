import styled, {css} from "styled-components";
import { BackIcon } from "./components/BackIcon";
import { SettingsIcon} from "./components/SettingsIcon"


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

const SettingsPanel = styled.div(
  ({ show }) => css`
  position: absolute;

  transition: 600ms;

  right: 0;
  transform: translate3d(${show ? 0 : `110%`}, 0, 0);

  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 360px;
  padding: 48px 12px;
  background-color: rgba(30, 30, 30, 0.97);
`
);

const Header = styled.h2`
  width: 100%;
  text-align: start;
  color: #888;
  font-weight: normal;

  font-size: 18px;
  padding: 24px 0 12px 8px;
`;

const Separator = styled.div`
  width: 100%;

  border-top: 2px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04);
  margin: 16px 0;
`;

const Back = styled(BackIcon)`
  position: absolute;
  top: 24px;
  left: 24px;

  transform: scale(-1, 1);  

  :hover g {
    fill: #ccc;
    cursor: pointer;
  }
`;

const Settings = styled(SettingsIcon)`
  position: absolute;
  top: 24px;
  right: 24px;

  :hover g {
    fill: #ccc;
    cursor: pointer;
  }
`;

export {
  Wrapper,
  PadGroup,
  Program,
  Button,
  Group,
  Label,
  Serial,
  SettingsPanel,
  Header,
  Separator,
  Back,
  Settings,
};
