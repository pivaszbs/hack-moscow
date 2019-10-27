import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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
import Fade from 'react-reveal/Fade';
import Roll from 'react-reveal/Roll';
import {
	updateTime,
	updateRange,
	fetchCategories,
	updatePickedCategories,
	updateCity,
} from '../../../store/actions';

const options = [
	{ value: 'chocolate', label: 'Chocolate' },
	{ value: 'strawberry', label: 'Strawberry' },
	{ value: 'vanilla', label: 'Vanilla' },
];

const MainPage = ({
	time,
	range,
	setTime,
	setRange,
	categories = options,
	setPickedCategories,
	setCity,
	pickedCategories = [],
	city,
}) => {
	const [rate, setRate] = useState(3);
	const isDisabled = !(time && range && pickedCategories.length > 0 && rate);
	useEffect(() => {
		fetchCategories();
	}, []);

	return (
		<div className="main-page">
			<Header />
			<div className="main-content">
				<Select
					className={'city-pick'}
					options={options}
					value={city}
					onChange={setCity}
				/>
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
				<div className="earth"></div>
				<div className="user-map"></div>
				<Roll top left>
					<Card className="main-content__filter" width={250} height={250}>
						<Filter
							onCategoriesChange={v => setPickedCategories(v)}
							options={options}
							select={categories}
							selectValues={pickedCategories}
						/>
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
							onChange={e => setTime(e.target.value)}
							placeholder="hh.mm"
							className="time"
							id="time"
						/>
						<TextField
							type="number"
							value={range}
							onChange={e => setRange(e.target.value)}
							placeholder="Meters"
							className="range"
							id="range"
						/>
					</div>
					<Button
						className="main-button"
						disabled={isDisabled}
						variant="primary"
					>
						НАЙТИ
					</Button>
				</Fade>
			</div>
			<Footer />
		</div>
	);
};

const msttp = ({ time, range, city, pickedCategories }) => ({
	time,
	city,
	range,
	pickedCategories,
});
const mdtp = dispatch => ({
	setTime: time => dispatch(updateTime(time)),
	setRange: range => dispatch(updateRange(range)),
	fetchCategories: fetchCategories(dispatch),
	setPickedCategories: v => dispatch(updatePickedCategories(v)),
	setCity: v => dispatch(updateCity(v)),
});

export default connect(
	msttp,
	mdtp
)(MainPage);
