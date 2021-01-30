import { debounce, map } from 'callbag-common';
import React, { useState } from 'react';
// import { useMergedStream } from '../src/use-merged-stream';
import { useCombinedStream, useStream } from '../src';


export default ({ text } : {text: string}) => {
  // const [a, setA] = useState('');
  // const [b, setB] = useState('');
  const [stream] = useStream(text, debounce(200));

  // const [merged] = useMergedStream([a, b], debounce(500));
  // const [merged] = useCombinedStream([a, b], debounce(500), map(([x, y]) => x + ' :: ' + y));

  return <>
    {/* <input type='text' onInput={e => setA((e.target as any).value)}/><br/> */}
    {/* <input type='text' onInput={e => setB((e.target as any).value)}/><br/> */}
    {/* {merged} */}
    {stream}
  </>;
};
