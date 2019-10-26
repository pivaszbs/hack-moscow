
const kek = () => {
    const $ = q => document.querySelector(q);
    window.addEventListener('resize', () => map.getViewPort().resize());
    const platform = new H.service.Platform({
        'apikey': 'gFekNQJXLJs2GqSJs1ukPhW5ua9Yy6LNHfUPMDcjLdo'
    });
    let lat = 55.815382, lng = 37.57497;
    const center = { lat, lng }
    // Get the default map types from the Platform object:
    const defaultLayers = platform.createDefaultLayers();
    const m = document.getElementById('user-map');
    // Instantiate the map:
    const map = new H.Map(
        m,
        defaultLayers.vector.normal.map,
        {
            zoom: 10,
            center
        });

    // Create the default UI components
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    window.addEventListener('resize', () => map.getViewPort().resize());
    let polygon;
    const start = new H.map.Marker(center, { volatility: true });
    const marker = new H.map.Marker(center, { volatility: true });
    start.draggable = true;
    marker.draggable = true;
    map.addObject(start);
    map.addObject(marker);

    // Add event listeners for marker movement
    map.addEventListener('dragstart', evt => {
        if (evt.target instanceof H.map.Marker) behavior.disable();
    }, false);
    map.addEventListener('dragend', evt => {
        if (evt.target instanceof H.map.Marker) {
            behavior.enable();
        }
    }, false);
    map.addEventListener('drag', evt => {
        const pointer = evt.currentPointer;
        if (evt.target instanceof H.map.Marker) {
            evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
            console.log(map.screenToGeo(pointer.viewportX, pointer.viewportY))
        }
    }, false);

}

setTimeout(kek, 1000);