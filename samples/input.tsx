import { debounce, map, filter, fromPromise, flatten } from 'callbag-common';
import React, { useState } from 'react';

import { useStream } from '../src/use-stream';
import { isEmpty, isLongEnough, isTaken } from './checks';


async function isUnique(name: string, taken: (n: string) => Promise<boolean>) {
  try {
    return { unique: !(await taken(name)) };
  } catch (error) {
    return { error };
  }
}

export interface Props {
  taken?: (n: string) => Promise<boolean>;
}

export default (props: Props) => {
  const taken = props.taken || isTaken;
  const [text, setText] = useState<string>('');

  const empty = isEmpty(text);
  const longEnough = isLongEnough(text);

  const [unique, loading] = useStream(text,
    filter(s => !isEmpty(s) && isLongEnough(s)),
    debounce(200),
    map(s => fromPromise(isUnique(s, taken))),
    flatten,
  );

  return <>
    <input type='text' onInput={e => setText((e.target as any).value)}/>
    <br/>
    { !empty ? <>
      { !longEnough
        ? <div>Username is too short!</div>
        : <>
          {
            loading ? <div>Checking uniqueness ...</div> : <>
              { unique && !unique.error && !unique.unique ? <div>Username is taken</div> : '' }
              { unique && unique.error ? <div>Could not check uniqueness: {unique.error.message }</div> : '' }
            </>
          }
        </>
      }
    </> : '' }
  </>;
};
