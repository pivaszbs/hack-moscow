import React from 'react';
import Toggle from '../toggle';
import './filter.sass';
import { Select } from '..';

const Filter = ({ options, select, onCategoriesChange, value }) => {
	return (
		<div className="filter">
			<Select
				options={select}
				value={value}
				onChange={onCategoriesChange}
				className={'filter-select'}
				isMulti
			/>
			{options.map(({ onChange, label }) => {
				return <Toggle onChange={onChange}>{label}</Toggle>;
			})}
		</div>
	);
};

export default Filter;
