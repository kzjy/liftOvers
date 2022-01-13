import styled from "styled-components";
import { Button, Container } from "flexibull";

export const Header = styled.div`
  min-height: 70px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.4);
  & img {
    height: 60px;
    /* margin: 10px 0; */
  }

  @media (max-width: 680px) {
    ${Button} {
      display: none;
    }
  }
`;
export const Contain = styled.div`
  max-width: ${props => (props.width ? props.width : "1000px")};
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const ClearButton = styled(Button)`
  background-color: none;
  background: none;
  color: #444;

  &:hover {
    background: #eee;
  }
`;

export const Wrapper = styled(Container)`
  /* width: 100vw; */
`;

export const Square = styled.div`
  width: 50vw;
  height: 50vw;
  position: absolute;
  top: -15vw;
  right: 0;
  overflow: hidden;
  &:after {
    content: "";
    display: block;
    width: 50vw;
    height: 50vw;
    left: 5vw;
    top: -5vw;
    position: absolute;
    border-radius: 5vw;
    background: #e1f5ee;
    transform: rotateZ(-15deg);
  }
`;
