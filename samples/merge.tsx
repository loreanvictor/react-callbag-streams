import { debounce } from 'callbag-common';
import React, { useState } from 'react';
import { useMergedStream } from '../src/use-merged-stream';


export default () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');

  const [merged] = useMergedStream([a, b], debounce(500));

  return <>
    <input type='text' onInput={e => setA((e.target as any).value)}/><br/>
    <input type='text' onInput={e => setB((e.target as any).value)}/><br/>
    {merged}
  </>;
};
