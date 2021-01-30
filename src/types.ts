import { Source } from 'callbag';

export type Op<A, B> = (s: Source<A>) => Source<B>;
