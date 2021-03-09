import { render } from 'react-dom';
import { should } from 'chai';
import scan from 'callbag-scan';
import register from 'jsdom-global';
import React, { useEffect, useState } from 'react';
import { pipe, subscribe } from 'callbag-common';

import { useSignal } from '../use-signal';
import useCallbag from 'use-callbag';

should();


describe('useSignal()', () => {
  beforeEach(function() {
    this.clean = register('<div id="root"/>');
  });

  afterEach(function() {
    this.clean();
  });

  it('should work generally.', done => {
    const Comp = () => {
      const [signal, emit] = useSignal();

      useEffect(() => {
        setTimeout(() => emit(), 10);
      }, []);

      const value = useCallbag(0, () => pipe(signal, scan(i => ++i, 0)));

      return <>{value}</>;
    };

    render(<Comp/>, document.getElementById('root'));
    setTimeout(() => {
      document.body.textContent!.should.equal('0');
    }, 5);
    setTimeout(() => {
      document.body.textContent!.should.equal('1');
      done();
    }, 15);
  });

  it('should cleanup when the component is removed.', done => {
    const Child = () => {
      const [src] = useSignal();

      useEffect(() => {
        subscribe({
          complete: () => done()
        })(src);
      }, []);

      return <></>;
    };

    const Parent = () => {
      const [s, set] = useState(true);

      useEffect(() => {
        setTimeout(() => set(false), 20);
      }, []);

      return s ? <Child/> : <></>;
    };

    render(<Parent/>, document.getElementById('root'));
  });
});
