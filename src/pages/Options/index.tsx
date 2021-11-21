import React from 'react';
import { render } from 'react-dom';

import './index.less';
import Options from './Options';

render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('root')
);

if (module.hot) module.hot.accept();
