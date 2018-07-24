import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';

const StyledRoot = styled.div`
  color: blue;
`;

const Root = ({
}) => {
  return (
    <StyledRoot>
      Root
    </StyledRoot>
  );
};

Root.defaultProps = {};
Root.propTypes = {};

export default Root;
