// istanbul ignore file

import map from 'callbag-map';

export function tap<T>(fn: (t: T) => void) {
  return map<T, T>(t => {
    fn(t);

    return t;
  });
}
