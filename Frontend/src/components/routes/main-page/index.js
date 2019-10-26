import React, { useState } from 'react';
import Header from '../../header';
import { Select, Avatar, Typo, Filter, Card } from '../../ui';
import './main-page.sass';
import Ava from '../../../assets/images/avatar-placeholder.webp';
import Footer from '../../footer';
import Recomendation from '../../recomendation';

const options = [
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'strawberry', label: 'Strawberry' },
	{ value: 'vanilla', label: 'Vanilla' },
];

const filterOptions = [
	{ label: 'dorowa', onChange: () => console.log('dorowa') },
	{ label: 'dorowa', onChange: () => console.log('dorowa') },
	{ label: 'dorowa', onChange: () => console.log('dorowa') },
	{ label: 'dorowa', onChange: () => console.log('dorowa') },
];

const MainPage = () => {
	const [rate, setRate] = useState(3);

	return (
		<div className="main-page">
			<Header />
			<div className="controls">
				<Select className={'city-pick'} options={options} />
				<Card className="user-card" width={300} height={150}>
					<div className="user-card__name">
						<Typo variant="h1">Name</Typo>
					</div>
					<div className="user-card__info">
						<Typo variant="h2">
							____________________________________________________________________________________
						</Typo>
					</div>
					<Avatar className="user-card__avatar" avatar={Ava} />
				</Card>
			</div>
			<div className="main-content">
				<div className="main-content__map">Карта</div>
				<Card className="main-content__category">CAT</Card>
				<Card className="main-content__filter" width={150} height={150}>
					<Filter options={filterOptions} />
				</Card>
				<Recomendation
					className="main-content__recomendation"
					rate={rate}
					changeRate={v => setRate(v)}
				/>
			</div>
			<Footer />
		</div>
	);
};

export default MainPage;
