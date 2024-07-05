export type AnonymousFunction = (...args: any[]) => any;

export function createObservableMap<K, V>(
  callback: AnonymousFunction,
): Map<K, V> {
  const map = new Map<K, V>();

  const handler = {
    set(target, key, value) {
      const result = target.set(key, value);
      callback({ key, value, type: 'set' });
      return result;
    },
    delete(target, key) {
      const result = target.delete(key);
      if (result) {
        callback({ key, type: 'delete' });
      }
      return result;
    },
    clear(target) {
      target.clear();
      callback({ type: 'clear' });
    },
    get(target, key, receiver) {
      if (key === 'set') {
        return handler.set.bind(null, target);
      } else if (key === 'delete') {
        return handler.delete.bind(null, target);
      } else if (key === 'clear') {
        return handler.clear.bind(null, target);
      } else if (key === 'size') {
        return handler.size.bind(null, target);
      }

      return Reflect.get(target, key, receiver);
    },
    size(target, key, value) {
      console.log('SİZEEE', target, key, value);
    },
  };

  return new Proxy(map, handler);
}
