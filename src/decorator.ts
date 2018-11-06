import {
  createReactNGetDerivedStateFromProps,
  ReactNComponentWillUnmount,
  ReactNGlobal,
  ReactNGlobalCallback,
  ReactNSetGlobal
} from './methods';
import { GlobalCallback, GlobalComponentClass, HasGetDerivedGlobalFromProps, NewGlobal } from '../typings/reactn';

// @reactn
const ReactN = function ReactN<P extends {}, S extends {}>(Component: GlobalComponentClass<P, S>): GlobalComponentClass<P, S> {
  class ReactNComponent extends Component {

    static displayName: string = (Component.displayName || Component.name) + '-ReactN';

    constructor(props: P, ...args: any[]) {
      super(props, ...args);
    }

    componentWillUnmount() {

      // @ts-ignore
      ReactNComponentWillUnmount(this);

      // componentWillUnmount
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }
    }

    _globalCallback = () => {

      // @ts-ignore
      ReactNGlobalCallback(this);
    };

    get global() {

      // @ts-ignore
      return ReactNGlobal(this);
    }

    setGlobal(global: NewGlobal, callback: GlobalCallback | null = null) {

      // @ts-ignore
      ReactNSetGlobal(this, global, callback);
    }
  }

  // getDerivedGlobalFromProps
  if (Component.getDerivedGlobalFromProps) {
    ReactNComponent.getDerivedStateFromProps = createReactNGetDerivedStateFromProps(
      Component as GlobalComponentClass<P, S> & HasGetDerivedGlobalFromProps<P, S>
    );
  }

  return ReactNComponent;
};

export default ReactN;
