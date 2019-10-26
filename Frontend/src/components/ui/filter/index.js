import React from 'react';
import Toggle from '../toggle';
import './filter.sass';

const Filter = ({ options = [] }) => {
    return (
        <div className='filter'>
            {options.map(({ onChange, label }) => {
                return <Toggle onChange={onChange}>{label}</Toggle>
            })}
        </div>
    );
}

export default Filter;