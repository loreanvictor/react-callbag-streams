import subject from 'callbag-subject';
import { Callbag, Source } from 'callbag';
import { useEffect, useRef } from 'react';


export function useSignal(): [Source<undefined>, () => void];
export function useSignal<T>(): [Source<T>, (t: T) => void];
export function useSignal<T=undefined>(): [Source<T>, (t?: T) => void] {
  const src = useRef<Callbag<T, T>>();

  if (!src.current) {
    src.current = subject<T>();
  }

  useEffect(() => () => src.current!(2), []);

  return [src.current, (t?: T) => src.current!(1, t!)];
}
