import { ComponentClass, Component, ComponentElement } from 'react';

interface AnyObject {
  [key: string]: any
}

export type GetDerivedGlobalFromProps<P, S> = (props: Readonly<P>, global: GlobalState, prevState: S) => Partial<S> | null;

export type GlobalCallback = (global: GlobalState) => void;

export interface GlobalComponent<P extends {} = {}, S extends {} = {}> extends Component<P, S> {
  _globalCallback: () => void;
  global: GlobalState;
  setGlobal: (newGlobal: NewGlobal, callback: GlobalCallback | null) => Promise<void> | void;
  updater: ReactComponentUpdater<P, S>;
}

export interface GlobalComponentClass<P extends {} = {}, S extends {} = {}> extends ComponentClass<P, S> {
  getDerivedGlobalFromProps?: GetDerivedGlobalFromProps<P, S>;
}

export interface HasGetDerivedGlobalFromProps<P, S> {
  getDerivedGlobalFromProps: GetDerivedGlobalFromProps<P, S>;
}

export declare type GlobalReducer = (state: GlobalState, ...args: any[]) => GlobalState;

export declare interface GlobalState {
  [key: string]: any;
}

export declare type LocalReducer = (...args: any[]) => Promise<void> | void;

export declare type MapGlobalToProps<Props extends {}> = (global: GlobalState, props: AnyObject) => Props;

export type NewGlobal = NewGlobalFunction | null | Partial<GlobalState> | Promise<Partial<GlobalState>>;

export type NewGlobalFunction = (global: GlobalState) => NewGlobal;

interface ReactComponentUpdater<P, S> {
  enqueueForceUpdate: (_this: Component<P, S>, _: null, method: string) => void;
}

export interface Reducers {
  [key: string]: LocalReducer;
}
