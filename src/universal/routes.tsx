import RootContainer from '@containers/app/RootContainer/RootContainer.web';

const routes: Routes = {
  '/': {
    component: RootContainer,
  },
};

export default routes;

interface Routes {
  [path: string]: {
    component: Function & { prefetch },
  },
}
