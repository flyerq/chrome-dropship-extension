import React from 'react';
import { render } from 'react-dom';

import './index.less';
import Popup from './Popup';

render(
  <Popup />,
  document.getElementById('root')
);

if (module.hot) module.hot.accept();
