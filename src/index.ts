import React from 'react';
import { ReactNComponent, ReactNPureComponent } from './components';
import ReactN from './decorator';
import { addReducer, setGlobal, useGlobal, withGlobal } from './helpers/index';

Object.assign(ReactN, React, {
  addReducer,
  Component: ReactNComponent,
  default: ReactN,
  PureComponent: ReactNPureComponent,
  setGlobal,
  useGlobal,
  withGlobal
});

module.exports = ReactN;
