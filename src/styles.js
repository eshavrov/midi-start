import styled, { css } from "styled-components";
import { BackIcon } from "./components/BackIcon";
import { SettingsIcon } from "./components/SettingsIcon";

const Wrapper = styled.header`
  position: relative;
  text-align: center;
  background-color: #252727;
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  font-size: calc(10px + 2vmin);
  color: white;
  width: 100vw;
  box-sizing: content-box;
  overflow: hidden;
  padding-bottom: 40px;
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
  padding: 16px 24px;
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
  align-items: flex-start;
  ${(props) =>
    props.list &&
    css`
      flex-direction: column;
    `}

  @media (max-width: 720px) {
    align-items: stretch;
  }
`;

const Label = styled.div`
  font-size: 16px;
  color: #aaa;
  margin: 4px 0;
  text-align: right;
`;

const Serial = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-size: 18px;
  color: #ccc;
  align-self: start;
  text-align: left;
  max-width: 1020px;
  width: 100%;
  padding: 0 16px;

  @media (min-width: 1020px) {
    align-self: center;
  }
`;

const SettingsPanel = styled.div(
  ({ show }) => css`
    position: absolute;
    transition: 600ms;
    right: 0;
    transform: translate3d(${show ? 0 : `120%`}, 0, 0);
    box-sizing: border-box;
    top: 0;
    bottom: 0;
    width: 100%;
    max-width: 100%;
    padding: 48px 12px;
    background-color: rgba(30, 30, 30, 0.97);
  `
);

const Header = styled.h2`
  width: 100%;
  text-align: start;
  color: #aaa;
  font-weight: normal;

  font-size: 18px;
  padding: 24px 0 12px 8px;
`;
const Text = styled.span`
  color: #aaa;
  font-weight: normal;

  font-size: 18px;
  padding: 48px 0 0;
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
  & g {
    fill: #a8009e;
  }
  @media (max-width: 1120px) {
    & g {
      fill: black;
    }
  }

  :hover g {
    fill: #ccc;
    cursor: pointer;
  }
`;

const Logo = styled.img.attrs(() => ({
  src: "./logo-white.png",
  width: "240",
}))`
  margin: 16px 0 12px;
  /* border: 1px solid red; */
  @media (max-width: 1020px) {
    margin-left: 24px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  width: 100%;
  max-width: 1020px;
  /* height: 80px; */
  margin-bottom: 10px;
  flex-wrap: wrap;

  background-color: #a8009e;

  @media (max-width: 720px) {
    /* flex-direction: column; */
    justify-content: center;
  }
`;

const Name = styled.h1`
  /* border: 1px solid red; */
  display: block;
  line-height: 64px;
  font-size: 64px;
  height: 64px;
  color: #fff;
  font-weight: normal;
  text-shadow: 0 4px 0px rgba(30, 30, 30, 1);
  padding: 0 0 8px 16px;
  margin: 0;
`;

export {
  Wrapper,
  Logo,
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
  Top,
  Name,
  Text,
};
