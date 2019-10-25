import React from 'react';

const {
    Provider: GeolocServiceProvider,
    Consumer: GeolocServiceConsumer
} = React.createContext();

export {
    GeolocServiceProvider,
    GeolocServiceConsumer
};
