const kek = () => {
    const platform = new H.service.Platform({
        'apikey': 'gFekNQJXLJs2GqSJs1ukPhW5ua9Yy6LNHfUPMDcjLdo'
    });
    let lat = 55.815382, lng = 37.57497;

    // Get the default map types from the Platform object:
    const defaultLayers = platform.createDefaultLayers();
    const m = document.getElementById('user-map');
    // Instantiate the map:
    const map = new H.Map(
        m,
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center: { lng, lat }
        });

    // Create the default UI:
    const ui = H.ui.UI.createDefault(map, defaultLayers);
}

setTimeout(kek, 1000);