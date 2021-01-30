import { combine } from 'callbag-common';
import { Op } from './types';
import { useStreams } from './use-streams';


export function useCombinedStream<T extends unknown[]>(source: [...T]): [[...T], false];
export function useCombinedStream<T extends unknown[], A>(sources: [...T], a: Op<[...T], A>): [A, boolean];
export function useCombinedStream<T extends unknown[], A, B>
(sources: [...T], a: Op<[...T], A>, b: Op<A, B>): [B, boolean];
export function useCombinedStream<T extends unknown[], A, B, C>
(sources: [...T], a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>): [C, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D>
(sources: [...T], a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>): [D, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D, E>
(sources: [...T], a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>): [E, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D, E, F>
(sources: [...T], a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>): [F, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D, E, F, G>
(sources: [...T],
  a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>
): [G, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D, E, F, G, H>
(sources: [...T],
  a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>, f: Op<E, F>, g: Op<F, G>, h: Op<G, H>
): [H, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D, E, F, G, H, I>
(sources: [...T],
  a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>
):[I, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D, E, F, G, H, I, J>
(sources: [...T],
  a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>
): [J, boolean];
export function useCombinedStream<T extends unknown[], A, B, C, D, E, F, G, H, I, J, K>
(sources: [...T],
  a: Op<[...T], A>, b: Op<A, B>, c: Op<B, C>, d: Op<C, D>, e: Op<D, E>,
  f: Op<E, F>, g: Op<F, G>, h: Op<G, H>, i: Op<H, I>, j: Op<I, J>, l: Op<J, K>
): [K, boolean];
export function useCombinedStream<T extends unknown[]>(sources: [...T], ...pipes: Op<any, any>[]): any;


export function useCombinedStream<T extends unknown[]>(sources: [...T], ...pipes: ((x: any) => any)[]) {
  return useStreams(sources, srcs => (combine as any)(...srcs), ...pipes);
}
