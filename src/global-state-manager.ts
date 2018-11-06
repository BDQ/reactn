import objectGetListener from './object-get-listener';
import reducers from './reducers';
import { GlobalCallback, GlobalState, NewGlobal, NewGlobalFunction } from '../typings/reactn';

type PropertyListener = () => void;
interface Transaction {
  propertyListeners: Set<PropertyListener>;
  state: Partial<GlobalState>;
}

const MAX_SAFE_INTEGER: number = 9007199254740990;

class GlobalStateManager {

  _propertyListeners: Map<string, Set<PropertyListener>> = new Map();
  _state: GlobalState = Object.create(null);
  _transactionId: number = 0;
  _transactions: Map<number, Transaction> = new Map();

  // Map component instance to a state property.
  addPropertyListener(property: string, propertyListener: PropertyListener) {
    if (this._propertyListeners.has(property)) {
      this._propertyListeners.get(property)!.add(propertyListener);
    }
    else {
      this._propertyListeners.set(property, new Set([ propertyListener ]));
    }
  };

  // Begin a transaction.
  beginTransaction() {
    this._transactionId = (this._transactionId + 1) % MAX_SAFE_INTEGER;
    const transaction: Transaction = {
      propertyListeners: new Set(),
      state: new Map()
    };
    this._transactions.set(this._transactionId, transaction);
    return this._transactionId;
  }

  // Commit a transaction.
  commit(transactionId: number) {
    const transaction: Transaction | undefined = this._transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Cannot find transaction ' + transactionId);
    }

    // Commit all state changes.
    for (const [ key, value ] of transaction.state.entries()) {
      this._state[key] = value;
    }

    // Force update all components that were a part of this transaction.
    for (const propertyListener of transaction.propertyListeners) {
      propertyListener();
    }

    this._transactions.delete(transactionId);
  }

  // Unmap a component instance from all state properties.
  removePropertyListener(propertyListener: PropertyListener): void {
    for (const propertyListeners of this._propertyListeners.values()) {
      propertyListeners.delete(propertyListener);
    }
  }

  // Set a key-value pair as a part of a transaction.
  set(key: string, value: any, transactionId: number): void {

    const transaction: Transaction | undefined = this._transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Cannot find transaction ' + transactionId);
    }

    transaction.state.set(key, value);

    const propertyListeners = this._propertyListeners.get(key);
    if (propertyListeners) {
      for (const propertyListener of propertyListeners) {
        transaction.propertyListeners.add(propertyListener);
      }
    }
  }

  // Set any type of state change.
  setAny(any: NewGlobal): Promise<void> | void {

    // No changes, e.g. getDerivedGlobalFromProps.
    if (any === null) {
      return;
    }

    if (any instanceof Promise) {
      return this.setPromise(any);
    }

    if (typeof any === 'function') {
      return this.setFunction(any as NewGlobalFunction);
    }

    if (typeof any === 'object') {
      return this.setObject(any);
    }

    throw new Error('Global state must be a function, null, object, or Promise.');
  }

  setAnyCallback(any: NewGlobal, callback: GlobalCallback | null = null): void {
    const newGlobal = this.setAny(any);

    // If there is a callback,
    if (typeof callback === 'function') {
      if (newGlobal instanceof Promise) {
        newGlobal.then(() => {
          callback(this.stateWithReducers);
        });
      }
      else {
        callback(this.stateWithReducers);
      }
    }
  }

  setFunction(f: NewGlobalFunction): Promise<void> | void {
    return this.setAny(f(this.stateWithReducers));
  }

  // Set the state's key-value pairs via an object.
  setObject(obj: Partial<GlobalState>): void {
    const tran = this.beginTransaction();
    for (const key of Object.keys(obj)) {
      this.set(key, obj[key], tran);
    }
    this.commit(tran);
  }

  // Set the state's key-value pairs via a promise.
  setPromise(promise: Promise<NewGlobal>): Promise<void> {
    return promise
      .then(result => {
        return this.setAny(result);
      });
  }

  spyState(propertyListener: PropertyListener): GlobalState {

    // When this._state is read, execute the listener.
    return objectGetListener(
      this._state,
      (property: string): void => {
        this.addPropertyListener(property, propertyListener);
      }
    );
  }

  spyStateWithReducers(propertyListener: PropertyListener): GlobalState {
    return Object.assign(
      Object.create(null),
      this.spyState(propertyListener),
      reducers
    );
  }

  get stateWithReducers(): GlobalState {
    return Object.assign(
      Object.create(null),
      this._state,
      reducers
    );
  }
};

export default new GlobalStateManager();
