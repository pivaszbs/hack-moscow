import React from 'react';
import './toggle.sass';
import { Typo } from '..';
import clsx from 'clsx';

const Toggle = ({ children, onChange, className, textClass }) => {
	return (
		<label className={clsx('switch-wrap', className)}>
			<input type="checkbox" onChange={onChange} />
			<div className="switch" />
			<Typo className={clsx('switch-text', textClass)}>{children}</Typo>
		</label>
	);
};

export default Toggle;
