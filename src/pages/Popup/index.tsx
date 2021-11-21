import React from 'react';
import { render } from 'react-dom';

import './index.less';
import Popup from './Popup';

render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);

if (module.hot) module.hot.accept();
