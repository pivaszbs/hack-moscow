import React from 'react';
import Toggle from '../toggle';
import './filter.sass';
import { Select } from '..';

const select = [
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'strawberry', label: 'Strawberry' },
	{ value: 'vanilla', label: 'Vanilla' }
];

const Filter = ({ options = [] }) => {
	return (
		<div className="filter">
			<Select options={select} className={'filter-select'} isMulti />
			{options.map(({ onChange, label }) => {
				return <Toggle onChange={onChange}>{label}</Toggle>;
			})}
		</div>
	);
};

export default Filter;
