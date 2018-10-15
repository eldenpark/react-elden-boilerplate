import hoistNonReactStatics from 'hoist-non-react-statics';
import * as React from 'react';

export default function withSome(WrappedComponent) {
  class Clazz extends React.Component {
    static displayName = 'withUuid(' + (WrappedComponent.displayName || WrappedComponent.name) + ')';
    static WrappedComponent = WrappedComponent;

    constructor(props) {
      super(props);
    }

    render() {
      return (
        <WrappedComponent
          some={'some'} 
          {...this.props}/>
      );
    }
  }

  hoistNonReactStatics(Clazz, WrappedComponent);
  return Clazz;
};
