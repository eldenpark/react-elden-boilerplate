import * as React from 'react';

import MainContainer from '@containers/app/MainContainer/MainContainer.web';
import GraphQLContainer from '@containers/app/GraphQLContainer/GraphQLContainer.web';

const rootRoutes: RouteEntry[] = [
  {
    path: '/graphql',
    component: GraphQLContainer,
  },
  {
    component: MainContainer,
  },
];

export default rootRoutes;

export interface RouteEntry {
  path?: string,
  component: React.ComponentType,
}
