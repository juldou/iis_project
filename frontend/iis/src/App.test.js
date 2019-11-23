import React from 'react';
import ReactDOM from 'react-dom';
import Homescreen from './Homescreen';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Homescreen />, div);
  ReactDOM.unmountComponentAtNode(div);
});
