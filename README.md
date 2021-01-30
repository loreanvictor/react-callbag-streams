<div align="center">
  
<img src="/logo.svg" width="192"/>

<br>

# React Callbag Streams

[![tests](https://img.shields.io/github/workflow/status/loreanvictor/react-callbag-streams/Test%20and%20Report%20Coverage?label=tests&logo=mocha&logoColor=green&style=flat-square)](https://github.com/loreanvictor/react-callbag-streams/actions?query=workflow%3A%22Test+and+Report+Coverage%22)
[![coverage](https://img.shields.io/codecov/c/github/loreanvictor/react-callbag-streams?logo=codecov&style=flat-square)](https://codecov.io/gh/loreanvictor/react-callbag-streams)
[![version](https://img.shields.io/npm/v/react-callbag-streams?logo=npm&style=flat-square)](https://www.npmjs.com/package/react-callbag-streams)


</div>

<br>

Use [callbag operators](https://loreanvictor.github.io/callbag-common/) on normal JS variables in React components. Easily debounce, flatten,
throttle, maintain order of async operations (like data fetching), etc.

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

  return (
    <>
      <input type='text'
        placeholder='pokemon name ...'
        onInput={e => setQ((e.target as any).value)}/>
      <br/>
      <pre>
        { loading ? 'loading ...' : JSON.stringify(info, undefined, 2) }
      </pre>
    </>
  )
}
```
[ ► Playground ](https://stackblitz.com/edit/react-callbag-streams-demo?file=index.tsx)

<br><br>

# Why?

Some extremely basic reactive programming stuff are weirdly difficult and migrain inducing in React,
while they are pretty trivial with any reactive programming library.

`react-callbag-streams` provides hooks that allow you to treat variables as streams, use these super-convenient
operators on the stream, and then treat the whole thing again as a plain variable (with also a loading indicator
as a bonus).

<br>

### Example: Request Ordering

Imagine you fetch data like this:

```tsx
function App() {
  const [q, setQ] = useState('')
  const [info, setInfo] = useState({})
  
  useEffect(async () => {
    setInfo(await pokeInfo(q))
  }, [q])
  
  ...
}
```

Imagine you want to fetch info for `"charizard"` and then for `"snorlax"`, but the responses
to these requests come out of order. Now your query is for `"snorlax"` but you are displaying information
for `"charizard"`.

Fixing this issue is trivial with [`callbag-flatten`](https://loreanvictor.github.io/callbag-common/operator/flatten):

```tsx
import { flatten, map, fromPromise } from 'callbag-common'
import { useStream } from 'react-callbag-streams'

function App() {
  const [q, setQ] = useState('')
  const [info] = useStream(
    q,
    map(q => fromPromise(pokeInfo(q))),
    flatten
  )
  
  ...
}
```

<br>

### Example: Debouncing

Debouncing, throttling, etc. become extremely easy operations when you treat your data as streams:

```tsx
import { flatten, map, fromPromise, debounce } from 'callbag-common'
import { useStream } from 'react-callbag-streams'

function App() {
  const [q, setQ] = useState('')
  const [info] = useStream(
    q,
    debounce(200),
    map(q => fromPromise(pokeInfo(q))),
    flatten
  )
  
  ...
}
```

<br>

### Loading Indicator

`useStream()` also provides a loading indicator, which is `true` from the time that a stream variable changes until next emission of the stream:

```tsx
function App() {
  const [q, setQ] = useState('')
  const [info, loading] = useStream(
    q,
    debounce(200),
    map(q => fromPromise(pokeInfo(q))),
    flatten
  )
  
  ...
}
```

<br>

### Stream Combination

You can also use `useMergedStream()` and `useCombinedStream()` for combining stream of multiple variables together and manipulate the combined
stream:

```tsx
import { useCombinedStream } from 'react-callbag-streams'

function App() {
  const [x, setX] = useState('')
  const [y, setY] = useState(0)
  
  const [data, loading] = useCombinedStream([x, y],
    debounce(200),
    map(([x, y]) => fromPromise(fetchFilteredData({ x, y }))),
    flatten
  )
  
  ...
}
```

<br><br>

# Contribution

Be nice and respectful, more importantly super open and welcoming to all.

👉 Useful commands for working on this repo:
```bash
git clone https://github.com/loreanvictor/react-callbag-streams.git
```
```bash
npm i              # --> install dependencies
```
```bash
npm start          # --> serves `samples/index.tsx` on localhost:3000
```
```bash
npm test           # --> run all tests
```
```bash
npm run cov:view   # --> view code coverage
```
