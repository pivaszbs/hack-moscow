import store from '../src/store';
import { updateStart, updateEnd } from '../src/store/actions';
import { bindActionCreators } from 'redux';

const { updateStart: setStart, updateEnd: setEnd } = bindActionCreators(
	{ updateStart, updateEnd },
	store.dispatch
);

let mp, pltfr;

export default () => {
	function interleave(map) {
		var provider = map.getBaseLayer().getProvider();
		var style = provider.getStyle();

		var changeListener = () => {
			if (style.getState() === H.map.Style.State.READY) {
				setTimeout(() => {
					m.style.opacity = 1;
					const s = document.querySelector('.earth');
					s.remove();
				}, 2000);
			}
		};

		style.addEventListener('change', changeListener);
	}

	const H = window.H;
	const platform = new H.service.Platform({
		apikey: 'gFekNQJXLJs2GqSJs1ukPhW5ua9Yy6LNHfUPMDcjLdo',
	});
	let lat = 55.815382,
		lng = 37.57497;
	const center = { lat, lng };
	// Get the default map types from the Platform object:
	const defaultLayers = platform.createDefaultLayers();
	var m = document.querySelector('.user-map');
	console.log(m);
	// Instantiate the map:
	const map = new H.Map(m, defaultLayers.vector.normal.map, {
		zoom: 10,
		center,
	});
	// Create the default UI components
	const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

	window.addEventListener('resize', () => map.getViewPort().resize());
	const start = new H.map.Marker(center, { volatility: true });
	const marker = new H.map.Marker(center, { volatility: true });
	start.draggable = true;
	marker.draggable = true;
	map.addObject(start);
	map.addObject(marker);

	// Add event listeners for marker movement
	map.addEventListener(
		'dragstart',
		evt => {
			if (evt.target instanceof H.map.Marker) behavior.disable();
		},
		false
	);
	map.addEventListener(
		'dragend',
		evt => {
			if (evt.target instanceof H.map.Marker) {
				behavior.enable();
			}
		},
		false
	);
	map.addEventListener(
		'drag',
		evt => {
			const pointer = evt.currentPointer;
			if (evt.target instanceof H.map.Marker) {
				evt.target.setGeometry(
					map.screenToGeo(pointer.viewportX, pointer.viewportY)
				);
				if (evt.target === start) {
					setStart(map.screenToGeo(pointer.viewportX, pointer.viewportY));
				} else {
					setEnd(map.screenToGeo(pointer.viewportX, pointer.viewportY));
				}
			}
		},
		false
	);

	interleave(map);
	mp = map;
	pltfr = platform
};

export {
	mp,
	pltfr
}

export function calculateRoute(platform, map, points) {
	const H = window.H;

	// Get the default map types from the Platform object:
	var m = document.querySelector('.user-map');

	function onSuccess(result) {
		var route = result.response.route[0];
		addRouteShapeToMap(route);
		addManueversToMap(route);
		// ... etc.
	}

	/**
	 * This function will be called if a communication error occurs during the JSON-P request
	 * @param  {Object} error  The error message received.
	 */
	function onError(error) {
		alert('Can\'t reach the remote server');
	}

	/**
	 * Boilerplate map initialization code starts below:
	 */

	// set up containers for the map  + panel
	var mapContainer = m,
		maneuver;

	/**
	 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
	 * @param {Object} route A route as received from the H.service.RoutingService
	 */
	function addRouteShapeToMap(route) {
		var lineString = new H.geo.LineString(),
			routeShape = route.shape,
			polyline;

		routeShape.forEach(function (point) {
			var parts = point.split(',');
			lineString.pushLatLngAlt(parts[0], parts[1]);
		});

		polyline = new H.map.Polyline(lineString, {
			style: {
				lineWidth: 4,
				strokeColor: 'rgba(0, 128, 255, 0.7)'
			}
		});
		// Add the polyline to the map
		map.addObject(polyline);
		// And zoom to its bounding rectangle
		map.getViewModel().setLookAtData({
			bounds: polyline.getBoundingBox()
		});
	}


	/**
	 * Creates a series of H.map.Marker points from the route and adds them to the map.
	 * @param {Object} route  A route as received from the H.service.RoutingService
	 */
	function addManueversToMap(route) {
		var svgMarkup = '',
			dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
			group = new H.map.Group(),
			i,
			j;

		// Add a marker for each maneuver
		for (i = 0; i < route.leg.length; i += 1) {
			for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
				// Get the next maneuver.
				maneuver = route.leg[i].maneuver[j];
				// Add a marker to the maneuvers group
				var marker = new H.map.Marker({
					lat: maneuver.position.latitude,
					lng: maneuver.position.longitude
				},
					{ icon: dotIcon });
				marker.instruction = maneuver.instruction;
				group.addObject(marker);
			}
		}
		// Add the maneuvers group to the map
		map.addObject(group);
	}

	var router = platform.getRoutingService(),
		routeRequestParams = {
			mode: 'fastest;pedestrian',
			representation: 'display',
			routeattributes: 'waypoints,summary,shape,legs',
			maneuverattributes: 'direction,action',
			...points
		};


	router.calculateRoute(
		routeRequestParams,
		onSuccess,
		onError
	);
}
