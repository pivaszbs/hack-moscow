import store from '../store';

export default class GeolocationService {
	_apiBase = 'http://localhost:8000';

	getResource = async url => {
		const res = await fetch(`${this._apiBase}${url}`);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, received ${res.status}`);
		}
		return await res.json();
	};

	sendRouteInfo(state) {
		console.log({
			city: state.city.value,
			start_point_latitude: state.start.lat,
			start_point_longitude: state.start.lon,
			end_point_latitude: state.end.lat,
			end_point_longitude: state.end.lon,
			duration: Number(state.time.slice(0, 2)) * 60 + Number(state.time.slice(3)),
			distance: Number(state.range),
			filters: [...state.pickedCategories.filter(i => Boolean(i))]
		})
		return fetch(`${this._apiBase}/geojourney/journey/create_journey/`,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					city: state.city.value,
					start_point_latitude: state.start.lat,
					start_point_longitude: state.start.lon,
					end_point_latitude: state.end.lat,
					end_point_longitude: state.end.lon,
					duration: Number(state.time.slice(0, 2)) * 60 + Number(state.time.slice(3)),
					distance: Number(state.range),
					filters: [...state.pickedCategories.filter(i => Boolean(i))]
				})
			}
		)
	}

	async loadCategories(city) {
		const res = await this.getResource(`/geojourney/journey/categories/?city=${city.value}`);

		return res;
	}
}
