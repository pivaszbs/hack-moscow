import React from 'react';
import Select from 'react-select';
import './select.sass';
import clsx from 'clsx';

const SelectComponent = ({
	className,
	placeholder,
	options,
	isMulti,
	onChange,
	value,
}) => {
	return (
		<Select
			className={clsx('select', className)}
			placeholder={placeholder}
			options={options}
			value={value}
			onChange={v => onChange(v)}
			isMulti={isMulti}
		/>
	);
};

export default SelectComponent;
