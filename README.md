<div align="center">
  
<img src="/logo.svg" width="192"/>

<br>

# React Callbag Streams

Seamlessly use [callbag](https://loreanvictor.github.io/callbag-common/what-are-callbags) streams in React components

</div>

<br>

```bash
npm i react-callbag-streams
```

```tsx
import { useStream } from 'react-callbag-streams'
import { debounce, filter, flatten, map, fromPromise } from 'callbag-common'


function App() {
  const [q, setQ] = useState('')
  const [info, loading] =
    useStream(q,                          // 👉 take the stream of values of q
      debounce(200),                      // 👉 debounce by 200 ms
      map(q => fromPromise(pokeInfo(q))), // 👉 get the pokemon info (which is an async function)
      flatten,                            // 👉 flatten requests (only keep one request in-flight)
    )

  return <div>
    <input type='text'
      placeholder='pokemon name ...'
      onInput={e => setQ((e.target as any).value)}/>
    <br/>
    <pre>
      { loading ? 'loading ...' : JSON.stringify(info, undefined, 2) }
    </pre>
  </div>
}
```
