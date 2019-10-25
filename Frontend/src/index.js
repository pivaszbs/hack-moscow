import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from './components/routes';
import ErrorBoundry from './components/error-boundary';
import GeolocService from './services/geoloc-service';
import { GeolocServiceProvider } from './components/geoloc-context';

import store from './store';

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
