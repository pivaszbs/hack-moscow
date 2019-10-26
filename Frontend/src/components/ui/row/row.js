import React from 'react';
import clsx from 'clsx';
import './row.sass';

const Row = ({ children, className }) => {
	return <div className={clsx('row', className)}>{children}</div>;
};

export default Row;
