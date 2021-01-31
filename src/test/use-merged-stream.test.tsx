import React from 'react';
import { render } from 'react-dom';
import { should } from 'chai';
import { debounce } from 'callbag-common';
import register from 'jsdom-global';

import { useStream } from '../use-stream';
import { useMergedStream } from '../use-merged-stream';

should();

describe('useMergedStream()', () => {
  beforeEach(function() {
    this.clean = register('<div id="root"/>');
  });

  afterEach(function() {
    this.clean();
  });

  it('should merge two separate variable streams.', done => {
    const Comp = ({ a, b }: any) => {
      const [debounced] = useStream(b, debounce(10));
      const [merged] = useMergedStream([debounced, a]);

      return <>{merged}</>;
    };

    render(<Comp a='A' b='B'/>, document.getElementById('root'));
    setTimeout(() => {
      document.body.textContent!.should.equal('A');
    }, 5);
    setTimeout(() => {
      document.body.textContent!.should.equal('B');
      done();
    }, 20);
  });
});
