import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';

import App from './AppHooks';
import * as serviceWorker from './serviceWorker';

import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
