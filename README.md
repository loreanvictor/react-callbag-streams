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

### Why Callbags?

- They are extremely lightweight. For example, [callbag-merge](https://github.com/staltz/callbag-merge) is under `350B`, while the [`merge()` factory in RxJS](https://rxjs-dev.firebaseapp.com/api/index/function/merge) is about `4.3KB`
in size.
- They are pritty simple (for example compare [callbag-map](https://github.com/staltz/callbag-map) with [RxJS's `map()`](https://github.com/ReactiveX/rxjs/blob/master/src/internal/operators/map.ts)).
- Callbags is a specification, not a library. This, combined with the simplicity, allows for fully decentralized and community-driven
development of utilities and libraries, while for something like RxJS most of the utilities come from the library itself.

<br><br>

# Usage

The whole point of this library is that it allows using callbag operators on variables inside React components.
You can find a collection of useful and commonly used callbag operators [here](https://loreanvictor.github.io/callbag-common/)
or [here](https://github.com/staltz/callbag-basics), find a list of available community operators [here](https://github.com/callbag/callbag/wiki)
or [here](https://www.npmjs.com/search?q=callbag-), or even [easily create your own operators](https://github.com/callbag/callbag/blob/master/getting-started.md).

<br>

👉 `useStream()` allows you to treat a variable as a stream:

```tsx
import { useStream } from 'react-callbag-streams'
import { filter } from 'callbag-common'

function MyComp({ prop }) {
  //
  // 👉 even will only have even values of prop, and won't be updated
  //    for its odd values.
  //
  const [even] = useStream(prop, filter(x => x % 2 === 0))
  
  ...
}
```
```tsx
import { useStream } from 'react-callbag-streams'
import { debounce } from 'callbag-common'

function MyComp({ prop }) {
  //
  // 👉 debounced will be the latest value of prop, 200ms after its last change.
  //    it will not be updated while prop is changing at intervals shorter than 200ms.
  //
  const [debounced] = useStream(prop, debounce(200))
  
  ...
}
```
```tsx
import { useStream } from 'react-callbag-streams'
import { map, fromPromise, flatten } from 'callbag-common'

function MyComp({ prop }) {
  //
  // 👉 fetched will be the result of asyncFetch() for latest value of prop,
  //    even if values for asyncFetch come out of order.
  //
  const [fetched] = useStream(prop, map(p => fromPromise(asyncFetch(p))), flatten)
  
  ...
}
```

<br>

👉 `useStream()` also provides a loading indicator. The loading indicator is `true` between the time that the
source variable changes until the next emission of the stream.

```tsx
const [fetched, loading] = useStream(prop, map(p => fromPromise(asyncFetch(p))), flatten)
```

<br>

⚡⚡ Checkout this [real-life example](https://stackblitz.com/edit/react-callbag-streams-demo).

<br>

## Working Multiple Streams

👉 `useMergedStream()` allows you to treat multiple variables as one stream. Whenever any of the variables
has a new value, the stream will emit that value.

```tsx
import { useMergedStream } from 'react-callbag-streams'
import { debounce } from 'callbag-common'

function MyComp() {
  const [a] = useState()
  const [b] = useState()
  
  //
  // 👉 merged will be the latest value of either a or b (based on which changed later),
  //    200ms after the latest change to either.
  //
  const [merged] = useMergedStream([a, b], debounce(200))
  
  ...
}
```

<br>

👉 `useCombinedStream()` is similar to `useMergedStream()`, except that it emits an array of latest values of all provided
variables, every time any of them changes:

```tsx
import { useCombinedStream } from 'react-callbag-streams'

//
// this app finds repositories on github based on a query and language
//
function App() {
  const [q, setQ] = useState('')
  const [l, setL] = useState('javascript')

  const [repos, loading] = useCombinedStream(
    [q, l],                                             // 👉 a combined stream of query and language
    filter(([q]) => q.length >= 2),                     // 👉 filter out when query is too short
    debounce(1000),                                     // 👉 debounce the combo by a second (github API will block us o.w.)
    map(([q, l]) => fromPromise(search(q, l))),         // 👉 search in github api using query and language
    flatten,                                            // 👉 flatten the stream (preserve order of responses)
    map(res =>                                          // 👉 format the incoming result ...
      res.items.map(item =>                             // .. take each repository ...
        ({ name: item.name, url: item.html_url })       // .. get its name and its url
      )
    ),
  )

  return <>
    <input type='text'
      placeholder='keywords ....'
      value={q}
      onInput={e => setQ((e.target as any).value)}/>
    <input type='text'
      placeholder='language'
      value={l}
      onInput={e => setL((e.target as any).value)}/>
    <br/>
    { q.length >= 2 ?
      (
        loading ? 'loading ...' : (
          <ul>
            { repos?.map(repo => (
              <li key={repo.url}><a href={repo.url}>{repo.name}</a></li>
            ))}
          </ul>
        )
      ) : ''
    }
  </>
}
```
[ ► Playground ](https://stackblitz.com/edit/react-callbag-streams-2?file=index.tsx)

<br>

## Working with Callbags Directly

👉 `useSource()` provides access to the underlying callbags created from variables / parameters. It is useful for situations
where advanced stream combination is needed:

```tsx
import { useStream, useSource } from 'react-callbag-streams'

import fetch from './fetch'

//
// in this example we have a list of entries that is fetched in a paginated manner,
// and is based on a given query.
//
// - when the user changes the query, we want the pagination to reset and result set to be refreshed
// - when the user loads more content, we want them to be added to current data
//
function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)

  const page$ = useSource(page)                            // 👉 direct access to a stream from values of page
  const [entries, loading] = useStream(
    query,                                                 // 👉 for each query
    tap(() => setPage(0)),                                 // .. reset the page counter
    map(q =>                                               // .. and map the query to a query-specific sub-stream
      pipe(
        combine(of(q), page$),                             // 👉 combine query value and values from page stream
        map(([q, p]) => fromPromise(fetch(q, p))),         // 👉 for each new pair, fetch data
        flatten,
        scan((all, page) => [...all, ...page], []),        // 👉 accumulate results (this is query-specific stream)
      )
    ),
    flatten                                                // 👉 flatten the query-speicifc substream
  )

  return <>
    <input
      type='text'
      placeholder='type something ...'
      onInput={e => setQuery((e.target as any).value)}
    />
    { entries?.map(entry => <div>{entry}</div>) : '' }
    <br />
    <button onClick={() => setPage(page + 1)}>Load More</button>
  </>
}
```
[ ► Playground ](https://stackblitz.com/edit/react-callbag-streams-demo-4?file=index.tsx)

<br>

👉 `useSignal()` provides a callbag source you can utilize in your streams. In the pagination example provided above, instead of a state
for the `page`, we can have a `loadMoreSignal` and calculate the page in the stream accordingly:

```tsx
import { useStream, useSignal } from 'react-callbag-streams'

// ...

function App() {

  // ...
  
  const [loadMoreSignal, loadMore] = useSignal()
  
  const [entries, loading] = useStream(
    query,
    map(q =>
      pipe(
        combine(
          of(q),
          pipe(                                      
            loadMoreSignal,                          // 👉 so for each signal
            scan(p => ++p, 0),                       // .. we increase the page number
            startWith(0)                             // .. starting with 0
          )
        ),
        map(([q, p]) => fromPromise(fetch(q, p))),
        flatten,
        scan((all, page) => [...all, ...page], []),
      )
    ),
    flatten
  )
  
  return (
  
    // ...
    
    <button onClick={() => loadMore()}>Load More</button>
  )
}
```
[ ► Playground ](https://stackblitz.com/edit/react-callbag-streams-demo-5?file=index.tsx)

<br>

⚠️ Note that `useSource()` and `useSignal()` return callbags (basically raw streams) and not plain values, so you cannot use their
returned result as raw values. For turning them into raw values, you can simply use the [`useCallbag()`](https://github.com/Andarist/use-callbag) hook:

```tsx
import useCallbag from 'use-callbag'

// ...

const [signal, loadMore] = useSignal()
const page = useCallbag(
  0,
  (initial) =>
    pipe(signal, scan(p => ++p, initial))
)

// ...

return (
  // ...
  <label>Page: {page}</label>
  // ...
)
```

Essentially, `useStream()` is equivalent to a `useSource()` followed by a `useCallbag()`:
```tsx
const [streamed] = useStream(prop, ...)

// -- OR --

const stream = useSource(prop)
const streamed = useCallbag(undefined, () => pipe(stream, ...))
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
