import React from 'react';
import { render } from 'react-dom';
import { should } from 'chai';
import { debounce, map } from 'callbag-common';
import register from 'jsdom-global';

import { useStream } from '../use-stream';
import { useCombinedStream } from '../use-combined-stream';

should();

describe('useCombinedStream()', () => {
  beforeEach(function() {
    this.clean = register('<div id="root"/>');
  });

  afterEach(function() {
    this.clean();
  });

  it('should combine two separate variable streams.', done => {
    const Comp = ({ a, b }: any) => {
      const [debounced, loading] = useStream(b, debounce(10));
      const [merged] = useCombinedStream([loading ? '--' : debounced, a], map(([x, y]) => x + ' ' + y));

      return <>{merged}</>;
    };

    render(<Comp a='A' b='B'/>, document.getElementById('root'));
    setTimeout(() => {
      document.body.textContent!.should.equal('-- A');
    }, 5);
    setTimeout(() => {
      document.body.textContent!.should.equal('B A');
      done();
    }, 20);
  });
});
