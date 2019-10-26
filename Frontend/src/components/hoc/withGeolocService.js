import React from 'react';
import { GeolocServiceConsumer } from '../geoloc-context';

const withGeolocService = () => Wrapped => {
	return props => {
		return (
			<GeolocServiceConsumer>
				{geolocService => {
					return <Wrapped {...props} geolocService={geolocService} />;
				}}
			</GeolocServiceConsumer>
		);
	};
};

export default withGeolocService;
