import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';

const StyledRoot = styled.div`
  color: blue;

  > div {
    border-bottom: 1px solid green;
    padding: 15px;
  }
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

const Root = ({
  count,
  handleClickAdd = () => {},
  handleClickNavigate = () => {},
  location,
}) => {
  return (
    <StyledRoot>
      <NavBar>
        <Location>{location.pathname}</Location>
        <button onClick={(e) => handleClickNavigate(e, '/')}>/</button>
        <button onClick={(e) => handleClickNavigate(e, '/foo')}>foo</button>
      </NavBar>
      <div>
        count
        <Count>
          {count}
        </Count>
        <button onClick={handleClickAdd}>
          add
        </button>
      </div>
    </StyledRoot>
  );
};

Root.defaultProps = {
  count: 0,
};

Root.propTypes = {
  count: PropTypes.number,
  handleClickAdd: PropTypes.func.isRequired,
  handleClickNavigate: PropTypes.func.isRequired,
};

export default Root;
