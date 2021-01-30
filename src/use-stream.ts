import useCallbag from 'use-callbag';
import subject from 'callbag-subject';
import { Callbag, merge, of, pipe, tap } from 'callbag-common';
import { useRef, useEffect, useState } from 'react';

import { Op } from './types';


export function useStream<T, A>(source: T, a: Op<T, A>): [A, boolean];
export function useStream<T, A, B>(source: T, a: Op<T, A>, b: Op<A, B>): [B, boolean];
export function useStream<T, A, B, C>(source: T, a: Op<T, A>, b: Op<A, B>, c: Op<B, C>): [C, boolean];
export function useStream<T, A, B, C, D>(source: T, a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>): [D, boolean];
export function useStream<T, A, B, C, D, E>
(source: T, a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>): [E, boolean];
export function useStream<T, A, B, C, D, E, F>
(source: T, a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>): [F, boolean];
export function useStream<T, A, B, C, D, E, F, G>
(source: T, a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>): [G, boolean];
export function useStream<T, A, B, C, D, E, F, G, H>
(source: T,
  a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>, h: Op<G, H>
): [H, boolean];
export function useStream<T, A, B, C, D, E, F, G, H, I>
(source: T,
  a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>
):[I, boolean];
export function useStream<T, A, B, C, D, E, F, G, H, I, J>
(source: T,
  a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>
): [J, boolean];
export function useStream<T, A, B, C, D, E, F, G, H, I, J, K>
(source: T,
  a: Op<T, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>, l: Op<J, K>
): [K, boolean];
export function useStream<T>(source: T, ...pipes: Op<any, any>[]): any;


export function useStream<T>(source: T, ...pipes: ((x: any) => any)[]) {
  const src = useRef<Callbag<T, T>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!src.current) {
      src.current = subject<T>();
    }

    src.current(1, source);
  }, [source]);

  return [
    useCallbag(undefined, () => (pipe as any)(
      merge(src.current!, of(source)),
      tap(() => setLoading(true)),
      ...pipes,
      tap(() => setLoading(false)),
    )),
    loading
  ];
}
