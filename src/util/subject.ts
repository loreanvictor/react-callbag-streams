// istanbul ignore file

import { Callbag, DATA, END, Sink, START } from 'callbag';


export function subject<T>(initial: T): Callbag<T, T> {
  const sinks: Sink<T>[] = [];
  let done = false;
  let last = initial;

  return (type: START | DATA | END, data: any) => {
    if (done) {
      return;
    }

    if (type === 0) {
      const sink = data;
      sinks.push(sink);

      sink(0, (t: START | DATA | END) => {
        if (t === 2) {
          const i = sinks.indexOf(sink);
          if (i > -1) {
            sinks.splice(i, 1);
          }
        }
      });

      sink(1, last);
    } else {
      if (type === 1) {
        last = data;
      }

      const zinkz = sinks.slice(0);

      for (let i = 0, n = zinkz.length, sink; i < n; i++) {
        sink = zinkz[i];

        if (sinks.indexOf(sink) > -1) {
          sink(type as any, data);
        }
      }

      if (type === 2) {
        done = true;
        sinks.length = 0;
      }
    }
  };
}
