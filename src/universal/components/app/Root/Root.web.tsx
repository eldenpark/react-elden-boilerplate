import { compose } from 'redux';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';

import Main from '@components/app/Main/Main.web';
import rootRoutes, { RouteEntry } from './rootRotues';

const StyledRoot = styled.div`
  color: blue;

  > div {
    border-bottom: 1px solid green;
    padding: 15px;
  }
`;

const NavBar = styled.div`
  background-color: orange;
`;

const Location = styled.span`
  display: inline-block;
  width: 120px;
`;

const Root: React.SFC<RootProps> = ({
  handleClickNavigate,
  pathname,
}) => {
  return (
    <StyledRoot>
      <NavBar>
        <Location>{pathname}</Location>
        <button onClick={(e) => handleClickNavigate(e, '/')}>/</button>
        <button onClick={(e) => handleClickNavigate(e, '/foo')}>foo</button>
        <button onClick={(e) => handleClickNavigate(e, '/graphql')}>graphql</button>
      </NavBar>
      {createRoutes(rootRoutes)}
    </StyledRoot>
  );
};

export default Root;

interface RootProps {
  handleClickNavigate: (e: React.SyntheticEvent, path: string) => void,
  pathname: string,
}

function createRoutes(routes: RouteEntry[]) {
  return (
    <Switch>
      {
        routes.map((r, idx) => {
          return (
            <Route
              key={r.path || idx}
              {...r}
            />
          );
        })
      }
    </Switch>
  );
}
