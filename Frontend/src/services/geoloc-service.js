import store from '../store';

export default class GeolocationService {
	_apiBase = 'http://localhost:5000';

	getResource = async url => {
		const res = await fetch(`${this._apiBase}${url}`);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, received ${res.status}`);
		}
		return await res.json();
	};

	sendRouteInfo() {
		return store.getState();
	}

	async loadCategories() {
		const res = await this.getResource('/categories');
		return res.json();
	}
}
