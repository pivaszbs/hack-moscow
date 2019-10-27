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
	Audioguide, Journey
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
	updatePickedCategories,
	updateCity,
} from '../../../store/actions';
import GeolocationService from '../../../services/geoloc-service';
import store from '../../../store';
import { mp, pltfr } from '../../../map';
import { calculateRoute } from '../../../map';

const options = [
	{ value: 'Moscow', label: 'Moscow', id: 1 },
];

const geoloc = new GeolocationService();

const MainPage = ({
	time,
	range,
	setTime,
	setRange,
	categories,
	setPickedCategories,
	setCity,
	pickedCategories = [],
	city
}) => {
	const [rate, setRate] = useState(3);
	const isDisabled = !(time && range && pickedCategories.length > 0 && rate && city);
	const sendData = () => {
		let state = store.getState();
		geoloc.sendRouteInfo(state)
			.then(data => {
				const H = window.H;
				const points = data.waypoints;

				calculateRoute(mp, points, pltfr);
			});
	}
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
				<Audioguide maxTime={250}/>
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
						onClick={sendData}
					>
						НАЙТИ
					</Button>
				</Fade>
			</div>
			<Journey places={[{longitude: 52.4857, latitude: 13.345}, {longitude: 52.3897, latitude: 13.1046}, {longitude: 52.4099, latitude: 12.99}]}/>
			<Footer />
		</div>
	);
};

const msttp = ({ time, range, city, pickedCategories, categories }) => ({
	time,
	city,
	range,
	pickedCategories,
	categories
});
const mdtp = (dispatch) => ({
	setTime: time => dispatch(updateTime(time)),
	setRange: range => dispatch(updateRange(range)),
	setPickedCategories: v => dispatch(updatePickedCategories(v)),
	setCity: v => dispatch(updateCity(dispatch, v))
});

export default connect(
	msttp,
	mdtp
)(MainPage);
