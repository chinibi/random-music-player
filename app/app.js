import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';

import AppContainer from './containers/app.container';

class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

ReactDOM.render(<App />, document.getElementById('content')); // eslint-disable-line
