import React from 'react';
import { render } from 'react-dom';

import './index.less';
import Content from './Content';

const root = document.createElement('div');
root.id = '__chrome-dropship-extension-container__';
document.body.appendChild(root);

render(
  <Content />,
  root
);
