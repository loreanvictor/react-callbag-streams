import { debounce } from 'callbag-common';
import React from 'react';
import { useMergedStream, useStream } from '../src';


export default ({ a, b }: {a : string, b: string}) => {
  const [debounced] = useStream(b, debounce(1000));
  const [merged] = useMergedStream([debounced, a]);

  return <>{merged}</>;
};
