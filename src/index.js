import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter,Switch,Route } from 'react-router-dom';
import './assets/styles/base.scss';
import 'sweetalert/dist/sweetalert.css';
import Main from './pages/Main';
import store from './store'
import { Provider } from 'react-redux';
import './i18n';
import Dashboard from './pages/Dashboard';
import LoginForm from '../src/containers/Login/LoginFormContainer';


const rootElement = document.getElementById('root');

const renderApp = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Component />
          <Route path="/" name="Home" component={Dashboard} />
          <Route path="/login" component={LoginForm} />
        </Switch>
      </HashRouter>
    </Provider>,
    rootElement
  );
};

renderApp(Main);

if (module.hot) {
  module.hot.accept('./pages/Main', () => {
    const NextApp = require('./pages/Main').default
    renderApp(NextApp);
  });
}

registerServiceWorker();

