import { render } from 'react-dom';
import { should } from 'chai';
import register from 'jsdom-global';
import React, { useEffect, useState } from 'react';
import { subscribe } from 'callbag-common';

import { useSource } from '../use-source';

should();


describe('useSource()', () => {
  beforeEach(function() {
    this.clean = register('<div id="root"/>');
  });

  afterEach(function() {
    this.clean();
  });

  it('should cleanup when the component is removed.', done => {
    const Child = () => {
      const [s] = useState();
      const src = useSource(s);

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
