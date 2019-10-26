import React from 'react';
import clsx from 'clsx';
import './button.sass';

const variantMap = {
	primary: 'button_primary',
	secondary: 'button_secondary',
};

const Button = ({ className, type, children, variant, ...props }) => {
	return (
		<button
			type={type}
			className={clsx('button', variantMap[variant], className)}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
