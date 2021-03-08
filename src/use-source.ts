import { Callbag, Source } from 'callbag';
import { useEffect, useRef } from 'react';

import { subject } from './util/subject';


export function useSource<T>(value: T): Source<T> {
  const src = useRef<Callbag<T, T>>();

  if (!src.current) {
    src.current = subject(value);
  }

  useEffect(() => {
    src.current!(1, value);
  }, [value]);

  useEffect(() => () => src.current!(2), []);

  return src.current;
}
