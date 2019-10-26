import React, { useState } from 'react';
import Select from 'react-select';
import './select.sass';
import clsx from 'clsx';

const SelectComponent = ({ className, placeholder, options }) => {
	const [single, setSingle] = useState(null);

	return (
		<Select
			className={clsx('select', className)}
			placeholder={placeholder}
			options={options}
			value={single}
			onChange={v => setSingle(v)}
		/>
	);
};

export default SelectComponent;
