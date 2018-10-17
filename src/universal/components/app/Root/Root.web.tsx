import { compose } from 'redux';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';

const StyledRoot = styled.div`
  color: blue;

  > div {
    border-bottom: 1px solid green;
    padding: 15px;
  }
`;

const InitialState = styled.div`
`;

const Count = styled.p`
  background-color: black;
  color: white;
`;

const NavBar = styled.div`
  background-color: orange;
`;

const Location = styled.span`
  display: inline-block;
  width: 120px;
`;

const Root: React.SFC<RootProps> = ({
  count,
  handleClickAdd,
  handleClickNavigate,
  number,
  pathname,
}) => {
  return (
    <StyledRoot>
      <NavBar>
        <Location>{pathname}</Location>
        <button onClick={(e) => handleClickNavigate(e, '/')}>/</button>
        <button onClick={(e) => handleClickNavigate(e, '/foo')}>foo</button>
      </NavBar>
      <InitialState>
        <p>Initial State</p>
        <p>{number}</p>
      </InitialState>
      <div>
        <p>static file</p>
        <p><img src="/favicon-256.png" alt=""/></p>
      </div>
      <div>
        count
        <Count>
          {count}
        </Count>
        <button onClick={(e) => handleClickAdd(e, {})}>
          add
        </button>
      </div>
    </StyledRoot>
  );
};

Root.defaultProps = {
  count: 0,
};

interface RootProps {
  count: number,
  handleClickAdd: (e: React.SyntheticEvent, data: object) => void,
  handleClickNavigate: (e: React.SyntheticEvent, path: string) => void,
  number: number,
  pathname: string,
}

export default Root;
