import globalStateManager from './global-state-manager';
import { GlobalCallback, GlobalComponent, GlobalComponentClass, HasGetDerivedGlobalFromProps, NewGlobal } from '../typings/reactn';


// static getDerivedStateFromProps
export function createReactNGetDerivedStateFromProps<P, S>(
  Component: GlobalComponentClass<P, S> & HasGetDerivedGlobalFromProps<P, S>
) {
  return function ReactNGetDerivedStateFromProps(props: Readonly<P>, prevState: S) {
    const newGlobal = Component.getDerivedGlobalFromProps(props, globalStateManager.stateWithReducers, prevState);
    globalStateManager.setAny(newGlobal);

    // getDerivedStateFromProps
    if (Component.getDerivedStateFromProps) {
      return Component.getDerivedStateFromProps(props, prevState);
    }
    return null;
  };
}



// this.componentWillUnmount
export function ReactNComponentWillUnmount(_this: GlobalComponent) {

  // No longer re-render this component on global state change.
  globalStateManager.removePropertyListener(_this._globalCallback);
}



// this._globalCallback
export function ReactNGlobalCallback(_this: GlobalComponent) {
  _this.updater.enqueueForceUpdate(_this, null, 'forceUpdate');
}



// this.global
export function ReactNGlobal(_this: GlobalComponent) {
  return globalStateManager.spyStateWithReducers(_this._globalCallback);
}



// this.setGlobal
export function ReactNSetGlobal(_this: GlobalComponent, global: NewGlobal, callback: GlobalCallback) {
  globalStateManager.setAnyCallback(global, callback);
}
