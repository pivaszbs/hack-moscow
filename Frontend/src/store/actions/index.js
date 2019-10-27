import Geoloc from '../../services/geoloc-service';

const geoloc = new Geoloc();

export const UPDATE_START = 'UPDATE_START';
export const updateStart = point => ({
	type: UPDATE_START,
	point,
});

export const UPDATE_END = 'UPDATE_END';
export const updateEnd = point => ({
	type: UPDATE_END,
	point,
});

export const UPDATE_RATE = 'UPDATE_RATE';
export const updateRate = (rate, place) => ({
	type: UPDATE_RATE,
	rate,
	place,
});

export const UPDATE_TIME = 'UPDATE_TIME';
export const updateTime = time => ({
	type: UPDATE_TIME,
	time,
});

export const UPDATE_RANGE = 'UPDATE_RANGE';
export const updateRange = range => ({
	type: UPDATE_RANGE,
	range,
});

export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const categoriesLoaded = categories => {
	categories = categories.map(({ id, title, icon }) => ({
		id,
		value: title,
		label: title,
		icon,
	}));

	return {
		type: 'FETCH_CATEGORIES_SUCCESS',
		categories,
	};
};

export const SEND_DATA = 'SEND_DATA';
export const sendData = () => ({
	type: SEND_DATA,
	method: geoloc.sendRouteInfo,
});

export const fetchCategories = dispatch => () => {
	geoloc.getCategories().then(data => dispatch(categoriesLoaded(data.items)));
};

export const UPDATE_CITY = 'UPDATE_CITY';
export const updateCity = city => ({
	type: UPDATE_CITY,
	city,
});

export const UPDATE_PICKED_CATEGORIES = 'UPDATE_PICKED_CATEGORIES';
export const updatePickedCategories = categories => ({
	type: UPDATE_PICKED_CATEGORIES,
	categories,
});
