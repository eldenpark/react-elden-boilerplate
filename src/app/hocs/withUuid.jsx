import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

import { uuid } from '@utils/mathUtils';

export default function withUuid(WrappedComponent) {
  class Clazz extends React.Component {
    constructor(props) {
      super(props);
      this.componentId = makeId(WrappedComponent.displayName || WrappedComponent.name);
    }

    render() {
      return (
        <WrappedComponent
          componentId={this.componentId} 
          {...this.props}/>
      );
    }
  }

  Clazz.displayName = 'withUuid(' + (WrappedComponent.displayName || WrappedComponent.name) + ')';
  Clazz.WrappedComponent = WrappedComponent;
  hoistNonReactStatics(Clazz, WrappedComponent);
  return Clazz;
};

function makeId(name) {
  if (name.indexOf('(') < 0) {
    return name + '-' + uuid();
  } else {
    return name.slice(name.lastIndexOf('(') + 1, name.indexOf(')')) + '-' + uuid();
  }
}
