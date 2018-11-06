import React from 'react';
import useForceUpdate from 'use-force-update';
import createReducer from '../create-reducer';
import globalStateManager from '../global-state-manager';
import reducers from '../reducers';
import setGlobal from './set-global';

export default function useGlobal(property: string, setterOnly: boolean = false) {

  // Require v16.7
  // @ts-ignore
  if (!React.useState) {
    throw new Error('React v16.7 or newer is required for useGlobal.');
  }

  const forceUpdate = useForceUpdate();

  // If this component ever updates or unmounts, remove the force update listener.
  // @ts-ignore
  React.useEffect(() => () => {
    globalStateManager.removePropertyListener(forceUpdate);
  });

  // Return the entire global state.
  if (!property) {

    const globalStateSetter = (newGlobal: any, callback = null) => {
      setGlobal(newGlobal, callback);
    };

    if (setterOnly) {
      return globalStateSetter;
    }
    return [
      globalStateManager.spyStateWithReducers(forceUpdate),
      globalStateSetter
    ];
  }

  // Use a custom reducer.
  if (typeof property === 'function') {
    return createReducer(property);
  }

  // Use a global reducer.
  if (Object.prototype.hasOwnProperty.call(reducers, property)) {
    return reducers[property];
  }

  const globalPropertySetter = (value: any, callback = null) =>
    globalStateManager.setAnyCallback(
      { [property]: value },
      callback
    );

  // Return only the setter (better performance).
  if (setterOnly) {
    return globalPropertySetter;
  }

  // Return both getter and setter.
  return [
    globalStateManager.spyState(forceUpdate)[property],
    globalPropertySetter
  ];
};
