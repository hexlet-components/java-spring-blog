// @ts-check
import ReactDOM from 'react-dom';
import init from './init.jsx';
import './index.scss';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'frontend:*';
}

const app = async () => {
  const vdom = await init();
  ReactDOM.render(vdom, document.querySelector('#container'));
  return vdom;
};

app();
