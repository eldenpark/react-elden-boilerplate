import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';

const StyledRoot = styled.div`
  color: blue;
`;

const Count = styled.p`
  background-color: black;
  color: white;
`;

const Root = ({
  count,
  handleClickAdd = () => {},
}) => {
  return (
    <StyledRoot>
      Root
      <Count>
        {count}
      </Count>
      <button onClick={handleClickAdd}>
        add
      </button>
    </StyledRoot>
  );
};

Root.defaultProps = {
  count: 0,
};

Root.propTypes = {
  count: PropTypes.number,
  handleClickAdd: PropTypes.func.isRequired,
};

export default Root;
