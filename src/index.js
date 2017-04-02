import React from 'react';
import {render} from 'react-dom';
import Counter from './Counter';

render(
  <Counter step={1}/>,
  document.getElementById('root')
);
