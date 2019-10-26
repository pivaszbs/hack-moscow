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

const fetchCategories = (state, { categories }) => ({
    ...state,
    categories
})

const sendData = (state, { method }) => {
    method(state);
}

const reducers = {
    UPDATE_END: updateEnd,
    UPDATE_RANGE: updateRange,
    // UPDATE_RATE,
    UPDATE_START: updateStart,
    UPDATE_TIME: updateTime,
    FETCH_CATEGORIES_SUCCESS: fetchCategories,
    SEND_DATA: sendData
};

export default (state = { rate: 3, time: '', range: '' }, action) => {
    return reducers[action.type] ? reducers[action.type](state, action) : state;
};
