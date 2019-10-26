import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import './typo.sass';

const defaultVariantMapping = {
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	body: 'p',
};

const Typo = props => {
	const { className, component, variant, inline, ...other } = props;

	const Component = component || defaultVariantMapping[variant] || 'span';

	return (
		<Component
			className={clsx(className, inline && 'text_inline')}
			{...other}
		/>
	);
};

Text.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'body']),
	variantMapping: PropTypes.object,
};

export default Typo;
