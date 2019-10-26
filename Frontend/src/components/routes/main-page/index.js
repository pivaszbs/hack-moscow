import React, { useState } from 'react';
import Header from '../../header';
import {
	Select,
	Avatar,
	Typo,
	Filter,
	Card,
	TextField,
	Button,
} from '../../ui';
import './main-page.sass';
import Ava from '../../../assets/images/avatar-placeholder.webp';
import Footer from '../../footer';
import Recomendation from '../../recomendation';
import Audioguide from "../../ui/audioguide";
import Fade from 'react-reveal/Fade';
import Roll from 'react-reveal/Roll';

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
	const [time, setTime] = useState('');
	const [range, setRange] = useState('');

	const changeTime = time => {
		time = time.replace(/[\D]/, '');

		if (time.length > 2) {
			time = time.slice(0, 2) + ':' + time.slice(2);
		}

		time = time.slice(0, 5);
		setTime(time);
	};

	return (
		<div className="main-page">
			<Header />
			<div className="main-content">
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
				<Roll top left>
					<div id="user-map"></div>

					<Card className="main-content__filter" width={250} height={250}>
						<Filter options={filterOptions} />
					</Card>
				</Roll>
				<Fade right>
					<Recomendation
						className="main-content__recomendation"
						rate={rate}
						changeRate={v => setRate(v)}
					/>
				</Fade>
				<Fade left>
					<div className="user-controls">
						<TextField
							value={time}
							onChange={e => changeTime(e.target.value)}
							placeholder="hh.mm"
							className="time"
							id='time'
						/>
						<TextField
							type="number"
							value={range}
							onChange={e => setRange(e.target.value)}
							placeholder="KM"
							className="range"
							id='range'
						/>
					</div>
					<Button className="main-button" variant="primary">
						НАЙТИ
					</Button>
				</Fade>
			</div>
			<Footer />
		</div>
	);
};

export default MainPage;
