import useCallbag from 'use-callbag';
import subject from 'callbag-subject';
import pipe from 'callbag-pipe';
import merge from 'callbag-merge';
import of from 'callbag-of';
import { Source, Callbag } from 'callbag';
import { useRef, useEffect, useState } from 'react';

import { Op } from './types';
import { tap } from './tap';


export type Combinator<X, Y> = (sources: Source<X>[]) => Source<Y>;

export function useStreams<T, W>(sources: T[], combinator: Combinator<T, W>): [W, boolean];
export function useStreams<T, W, A>(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>): [A, boolean];
export function useStreams<T, W, A, B>
(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>, b: Op<A, B>): [B, boolean];
export function useStreams<T, W, A, B, C>
(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>, b: Op<A, B>, c: Op<B, C>): [C, boolean];
export function useStreams<T, W, A, B, C, D>
(sources: T[], combinator: Combinator<T, W>, a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>): [D, boolean];
export function useStreams<T, W, A, B, C, D, E>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>
): [E, boolean];
export function useStreams<T, W, A, B, C, D, E, F>
(sources: T[],  combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>
): [F, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>): [G, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>, h: Op<G, H>
): [H, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H, I>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>
):[I, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H, I, J>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>
): [J, boolean];
export function useStreams<T, W, A, B, C, D, E, F, G, H, I, J, K>
(sources: T[], combinator: Combinator<T, W>,
  a: Op<W, A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>, l: Op<J, K>
): [K, boolean];
export function useStreams<T, W>(sources: T[], combinator: Combinator<T, W>, ...pipes: Op<any, any>[]): any;


export function useStreams<T, W>(sources: T[], combinator: Combinator<T, W>, ...pipes: ((x: any) => any)[]) {
  const srcs = useRef<Callbag<T, T>[]>();
  const [loading, setLoading] = useState(false);

  sources.forEach((source, i) => {
    useEffect(() => {
      if (!srcs.current) {
        srcs.current = [];
      }

      if (!srcs.current[i]) {
        srcs.current[i] = subject<T>();
      }

      srcs.current[i](1, source);
    }, [source]);
  });

  return [
    useCallbag(undefined, () => (pipe as any)(
      combinator(srcs.current!.map((s, i) => merge(s, of(sources[i])))),
      tap(() => setLoading(true)),
      ...pipes,
      tap(() => setLoading(false)),
    )),
    loading
  ];
}
