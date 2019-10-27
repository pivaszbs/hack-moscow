import { fetchCategories as fc } from '../actions';

const updateStart = (state, { point }) => {
    return {
        ...state,
        start: point,
    };
};

const updateEnd = (state, { point }) => {
    return {
        ...state,
        end: point,
    };
};

// const updateRate = (state, { rate }) => {
//     return {

//     }
// }

const updateRange = (state, { range }) => {
    return {
        ...state,
        range,
    };
};

const updateTime = (state, { time }) => {
    time = time.replace(/[\D]/, '');

    if (time.length > 2) {
        time = time.slice(0, 2) + ':' + time.slice(2);
    }

    time = time.slice(0, 5);

    return {
        ...state,
        time,
    };
};

const fetchCategories = (state, { categories }) => {
    return {
        ...state,
        categories,
    }
};

const updatePickedCategories = (state, { categories }) => ({
    ...state,
    pickedCategories: categories,
});

const updateCity = (state, { city, dispatch }) => {
    fc(dispatch, city);

    return {
        ...state,
        city
    };
};

const reducers = {
    UPDATE_END: updateEnd,
    UPDATE_RANGE: updateRange,
    // UPDATE_RATE,
    UPDATE_START: updateStart,
    UPDATE_TIME: updateTime,
    FETCH_CATEGORIES_SUCCESS: fetchCategories,
    UPDATE_PICKED_CATEGORIES: updatePickedCategories,
    UPDATE_CITY: updateCity
};

export default (state = { rate: 3, time: '', range: '', start: { lat: 55.815382, lon: 37.57497 }, end: { lat: 55.815382, lon: 37.57497 } }, action) => {
    return reducers[action.type] ? reducers[action.type](state, action) : state;
};
