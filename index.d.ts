/// <reference types="react" />
declare module "object-get-listener" {
    type AnyObject = {
        [key: string]: any;
    };
    type Listener = (key: string) => void;
    export default function objectGetListener(obj: AnyObject, listener: Listener): any;
}
declare module "reducers" {
    import { Reducers } from '../typings/reactn';
    const reducers: Reducers;
    export default reducers;
}
declare module "global-state-manager" {
    import { GlobalCallback, GlobalState, NewGlobal, NewGlobalFunction } from '../typings/reactn';
    type PropertyListener = () => void;
    interface Transaction {
        propertyListeners: Set<PropertyListener>;
        state: Partial<GlobalState>;
    }
    class GlobalStateManager {
        _propertyListeners: Map<string, Set<PropertyListener>>;
        _state: GlobalState;
        _transactionId: number;
        _transactions: Map<number, Transaction>;
        addPropertyListener(property: string, propertyListener: PropertyListener): void;
        beginTransaction(): number;
        commit(transactionId: number): void;
        removePropertyListener(propertyListener: PropertyListener): void;
        set(key: string, value: any, transactionId: number): void;
        setAny(any: NewGlobal): Promise<void> | void;
        setAnyCallback(any: NewGlobal, callback?: GlobalCallback | null): void;
        setFunction(f: NewGlobalFunction): Promise<void> | void;
        setObject(obj: Partial<GlobalState>): void;
        setPromise(promise: Promise<NewGlobal>): Promise<void>;
        spyState(propertyListener: PropertyListener): GlobalState;
        spyStateWithReducers(propertyListener: PropertyListener): GlobalState;
        readonly stateWithReducers: GlobalState;
    }
    const _default: GlobalStateManager;
    export default _default;
}
declare module "methods" {
    import { GlobalCallback, GlobalComponent, GlobalComponentClass, HasGetDerivedGlobalFromProps, NewGlobal } from '../typings/reactn';
    export function createReactNGetDerivedStateFromProps<P, S>(Component: GlobalComponentClass<P, S> & HasGetDerivedGlobalFromProps<P, S>): (props: Readonly<P>, prevState: S) => Partial<S> | null;
    export function ReactNComponentWillUnmount(_this: GlobalComponent): void;
    export function ReactNGlobalCallback(_this: GlobalComponent): void;
    export function ReactNGlobal(_this: GlobalComponent): import("../typings/reactn").GlobalState;
    export function ReactNSetGlobal(_this: GlobalComponent, global: NewGlobal, callback: GlobalCallback): void;
}
declare module "components" {
    import { GlobalComponentClass } from '../typings/reactn';
    export const ReactNComponent: GlobalComponentClass<{}, {}>;
    export const ReactNPureComponent: GlobalComponentClass<{}, {}>;
}
declare module "create-reducer" {
    import { GlobalReducer, LocalReducer } from '../typings/reactn';
    export default function createReducer(reducer: GlobalReducer): LocalReducer;
}
declare module "decorator" {
    import { GlobalComponentClass } from '../typings/reactn';
    const ReactN: <P extends {}, S extends {}>(Component: GlobalComponentClass<P, S>) => GlobalComponentClass<P, S>;
    export default ReactN;
}
declare module "helpers/add-reducer" {
    import { GlobalReducer } from '../../typings/reactn';
    export default function addReducer(name: string, reducer: GlobalReducer): void;
}
declare module "helpers/set-global" {
    import { GlobalCallback, NewGlobal } from '../../typings/reactn';
    export default function setGlobal(newGlobal: NewGlobal, callback?: GlobalCallback | null): void;
}
declare module "helpers/use-global" {
    export default function useGlobal(property: string, setterOnly?: boolean): any[] | ((newGlobal: any, callback?: null) => void);
}
declare module "helpers/with-global" {
    import { ComponentType } from 'react';
    import { GlobalComponentClass, MapGlobalToProps } from '../../typings/reactn';
    export default function withGlobal<GlobalProps extends {}>(getGlobal: MapGlobalToProps<GlobalProps>): <P>(Component: ComponentType<P & GlobalProps>) => GlobalComponentClass<P, {}>;
}
declare module "helpers/index" {
    export { default as addReducer } from "helpers/add-reducer";
    export { default as setGlobal } from "helpers/set-global";
    export { default as useGlobal } from "helpers/use-global";
    export { default as withGlobal } from "helpers/with-global";
}
declare module "index" { }
