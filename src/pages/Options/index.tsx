import React from 'react';
import { render } from 'react-dom';

import './index.less';
import Options from './Options';

render(
  <Options />,
  document.getElementById('root')
);

if (module.hot) module.hot.accept();
