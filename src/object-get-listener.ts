// Return an object that executes a read listener.

type AnyObject = { [key: string]: any };
type Listener = (key: string) => void;

export default function objectGetListener(obj: AnyObject, listener: Listener) {
  return Object.keys(obj).reduce(
    (accumulator, key) => {
      Object.defineProperty(accumulator, key, {
        configurable: false,
        enumerable: true,
        get: () => {
          listener(key);
          return obj[key];
        }
      });
      return accumulator;
    },
    Object.create(null)
  );
};
