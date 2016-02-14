import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import Store from './redux/store';
import Overlay from './components/overlay/OverlayComponent';
import Admin from './components/admin/AdminComponent';

function render() {
  ReactDOM.render(
    <Provider store={Store}>
      <Router history={browserHistory}>
        <Route path="/" component={Overlay} />
        <Route path="/admin" component={Admin} />
      </Router>
    </Provider>,
    document.getElementById('root')
  );
}

render();