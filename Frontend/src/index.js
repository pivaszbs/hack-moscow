import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from './components/routes';
import ErrorBoundry from './components/error-boundary';
import GeolocService from './services/geoloc-service';
import { GeolocServiceProvider } from './components/geoloc-context';

import store from './store';
import './assets/styles/fonts.sass';
import './assets/styles/global-styles.sass';
import map from './map';

const geolocService = new GeolocService();

ReactDOM.render(
	<Provider store={store}>
		<ErrorBoundry>
			<GeolocServiceProvider value={geolocService}>
				<Routes />
			</GeolocServiceProvider>
		</ErrorBoundry>
	</Provider>,
	document.getElementById('root')
);

export default setTimeout(map, 2000);
