import styled, { css } from "styled-components";
const k = 418 / 127;

const Wrapper = styled.div(
  ({ velocity = 0 }) => css`
    flex: 1 0 200px;
    background-color: #333;
    /* box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.04), inset 0 -4px 0 #222; */
    padding: 20px 16px;
    margin: 10px;
    color: #aaa;
    max-width: 220px;
    border-radius: 4px;
    transition: box-shadow ${velocity === 0 ? 1400 : 0}ms;
    box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.04), inset 0 -4px 0 #222,
      inset 0 -${velocity * k}px 0 #222;
  `
);

const Header = styled.h3`
  padding: 0 0 0px;
  margin: 0;
  color: #ccc;
  font-size: 32px;
`;

const Separator = styled.div`
  margin: 18px 0 6px;
  border-bottom: 4px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1);
`;

export { Wrapper, Header, Separator };
