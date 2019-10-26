import React from 'react';
import Rating from 'material-ui-rating';
import clsx from 'clsx';
import { Card } from '../ui';
import './recomendation.sass';

const Recomendation = ({ img, rate, changeRate, id, audio, className }) => {
	return (
		<div className={clsx('recomendation', className)}>
			<Card>
				<img src={img} />
			</Card>
			<Rating value={rate} max={5} onChange={changeRate} />
			<audio src={audio} />
		</div>
	);
};

export default Recomendation;
