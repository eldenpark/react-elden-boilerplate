import { compose } from 'redux';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';

const StyledMain = styled.div`
`;

const InitialState = styled.div`
`;

const Count = styled.p`
  background-color: black;
  color: white;
`;

const Main: React.SFC<MainProps> = ({
  count,
  handleClickAdd,
  number,
}) => {
  return (
    <StyledMain>
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
    </StyledMain>
  );
};

Main.defaultProps = {
  count: 0,
};

interface MainProps {
  count: number,
  handleClickAdd: (e: React.SyntheticEvent, data: object) => void,
  number: number,
}

export default Main;
