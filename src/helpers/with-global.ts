import { ComponentType, createElement, ReactElement, ValidationMap } from 'react';
import { ReactNPureComponent } from '../components';
import { GlobalComponentClass, MapGlobalToProps } from '../../typings/reactn';

/*
Creates a Higher-Order Component that passes the global state
  to the wrapped Component as props.
Behaves analogously to Redux's connect() HOC.

const hoc = withGlobal(
  (global, props) => ({
    age: global.people[props.person].age,
    propName: global.property
  })
);
hoc(MyComponent);

*/

export default function withGlobal<GlobalProps extends {}>(getGlobal: MapGlobalToProps<GlobalProps>) {
  return function ReactNWithGlobal<P>(Component: ComponentType<P & GlobalProps>): GlobalComponentClass<P, {}> {
    class ReactNComponent extends ReactNPureComponent {

      static displayName: string = (Component.displayName || Component.name) + '-ReactN';

      static propTypes = {} as ValidationMap<P>;

      render(): ReactElement<P & GlobalProps> {

        // @ts-ignore
        const props = Object.assign({}, this.props, getGlobal(this.global, this.props));

        // @ts-ignore
        return createElement(Component, props);
      }
    };

    // @ts-ignore
    return ReactNComponent;
  };
};
