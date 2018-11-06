import { Component, ComponentClass, PureComponent } from 'react';
import {
  ReactNComponentWillUnmount,
  ReactNGlobal,
  ReactNGlobalCallback,
  ReactNSetGlobal
} from './methods';
import { GlobalCallback, GlobalComponentClass, NewGlobal } from '../typings/reactn';

// import React from 'reactn';
// React.Component, React.PureComponent
const createReactNClassComponent = <P, S>(Super: ComponentClass<P, S>): GlobalComponentClass<P, S> =>
  class ReactNComponent extends Super {

    constructor(props: P, ...args: any[]) {
      super(props, ...args);

      const proto = Object.getPrototypeOf(this);

      // this.componentWillUnmount
      const hasInstanceCWU = Object.prototype.hasOwnProperty.call(this, 'componentWillUnmount');
      const hasProtoCWU = Object.prototype.hasOwnProperty.call(proto, 'componentWillUnmount');
      if (hasInstanceCWU || hasProtoCWU) {
        const cb =
          hasInstanceCWU ?
            this.componentWillUnmount :
            proto.componentWillUnmount.bind(this);
        this.componentWillUnmount = (...a) => {

          // @ts-ignore
          ReactNComponentWillUnmount(this);
          cb(...a);
        };
      }
    }

    componentWillUnmount() {

      // @ts-ignore
      ReactNComponentWillUnmount(this);
    }

    _globalCallback = () => {

      // @ts-ignore
      ReactNGlobalCallback(this);
    };

    get global() {

      // @ts-ignore
      return ReactNGlobal(this);
    }

    setGlobal(newGlobal: NewGlobal, callback: GlobalCallback | null = null) {

      // @ts-ignore
      ReactNSetGlobal(this, newGlobal, callback);
    }
  };

export const ReactNComponent = createReactNClassComponent(Component);

export const ReactNPureComponent = createReactNClassComponent(PureComponent);
