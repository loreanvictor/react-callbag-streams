import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { should } from 'chai';
import { debounce } from 'callbag-common';
import register from 'jsdom-global';

import { useStream } from '../use-stream';

should();

describe('useStream()', () => {
  beforeEach(function() {
    this.clean = register('<div id="root"/>');
  });

  afterEach(function() {
    this.clean();
  });

  it('should allow treating variables as streams.', done => {
    const Comp = ({ text } : { text: string }) => {
      const [debounced] = useStream(text, debounce(10));

      return <>{debounced}</>;
    };

    render(<Comp text='hola'/>, document.getElementById('root'));
    setTimeout(() => {
      document.body.textContent!.should.equal('');
    }, 5);
    setTimeout(() => {
      document.body.textContent!.should.equal('hola');
      done();
    }, 20);
  });

  it('should work properly when stream sources change.', done => {
    const Comp = () => {
      const [text, set] = useState('hola');
      const [debounced] = useStream(text, debounce(10));

      useEffect(() => { setTimeout(() => set('ciao'), 15); }, []);

      return <>{debounced}</>;
    };

    render(<Comp/>, document.getElementById('root'));
    setTimeout(() => {
      document.body.textContent!.should.equal('');
    }, 5);
    setTimeout(() => {
      document.body.textContent!.should.equal('hola');
    }, 20);
    setTimeout(() => {
      document.body.textContent!.should.equal('ciao');
      done();
    }, 40);
  });

  it('should provide correct loading status.', done => {
    const Comp = ({ text } : { text: string }) => {
      const [debounced, loading] = useStream(text, debounce(10));

      return <>{loading ? 'loading ...' : debounced}</>;
    };

    render(<Comp text='hola'/>, document.getElementById('root'));
    setTimeout(() => {
      document.body.textContent!.should.equal('loading ...');
    }, 2);
    setTimeout(() => {
      document.body.textContent!.should.equal('hola');
      done();
    }, 20);
  });
});
