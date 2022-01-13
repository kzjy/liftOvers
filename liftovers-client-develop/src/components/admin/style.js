import styled, { css } from 'styled-components';
import { Theme } from 'flexibull/build/theme';

export const StyledSideList = styled.div`
    & > div {
        border-right: 0.5px solid ${Theme.PrimaryColor};
        background: #ffffff75;
        min-height: 100vh;
        ${props =>
          !props.collapse &&
          css`
            width: 200px;
          `}
    }

    & .SideMenu_icon {
        & > svg .line , > svg .liner {
            stroke: ${Theme.PrimaryFontColor};
        }
        }
    }
    & .cage { 

        & div {
            border-bottom: 0.5px solid #ececec;
        }
    }

        &  ul {
            padding: 1rem 0.5rem;
            overflow-y: hidden;
        }
    & ul > li {
        border-radius: ${Theme.SecondaryRadius};
        margin: 1rem 0;
        color: ${Theme.PrimaryFontColor};
        font-size: ${Theme.PrimaryFontSize};
        transistion: 0.15s ease-out;

        ${props =>
          props.collapse &&
          css`
            width: calc(50px - 1rem) !important;
          `}

        & > a {
          border-radius: 5px;

          & > i { 
            
              ${props =>
                props.collapse &&
                css`
                  width: calc(50px - 1rem) !important;
                `}
          }
        }

        & .active {
          color: #fff;
          & > a > i { 
            color : #fff;
          }
        }

        &:hover {
        color: #fff;
        background: #fff;

          
        }
    }
`;

export const Square = styled.div`
  width: 50vw;
  height: 50vw;
  position: absolute;
  top: -15vw;
  right: 0;
  overflow: hidden;
  z-index: -1;
  &:after {
    content: '';
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

export const Footer = styled.footer`
  padding: 15px;
  text-align: center;
  font-size: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 20px;

  & a {
    color: ${Theme.PrimaryFontColor};
    text-decoration: none;
  }
`;
