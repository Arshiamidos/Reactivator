import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import 'moment/locale/fa';
import { PersistGate } from 'redux-persist/integration/react';
import fa_IR from 'antd/lib/locale-provider/fa_IR';

import store, { persistor } from 'redux/store/store';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
);
serviceWorker.unregister();
	
	  