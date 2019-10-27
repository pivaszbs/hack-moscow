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
					{[{
						name: 'Restoran Armenia',
						location: {
							position: [55.75661, 37.614174],
						},
						contacts: {
							phone: [
								{
									value: '+79642486660',
									label: 'Phone',
								},
							],
							website: [
								{
									value: 'http://www.wikipedia.org',
									label: 'Website',
								},
							],
						},
						categories: [
							{
								id: 'restaurant',
								title: 'Restaurant',
								icon:
									'https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon',
							},
							{
								id: 'Casual',
								title: 'Casual',
								icon:
									'https://download.vcdn.data.here.com/p/d/places2/icons/categories/22.icon',
							},
						],
						tags: [
							{
								id: 'asian',
								title: 'Asian',
								group: 'cuisine',
							},
							{
								id: 'russian',
								title: 'Russian',
								group: 'cuisine',
							},
						],
						icon:
							'https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon',
						media: {
							images: {
								available: 0,
								items: [],
							},
							reviews: {
								available: 0,
								items: [],
							},
							ratings: {
								available: 4,
								items: [2, 2, 3, 1],
							},
						},
						extended: {
							openingHours: {
								text: 'Mon-Sun: 00:00 - 23:59',
								label: 'Opening hours',
								isOpen: true,
								structured: [
									{
										start: 'T000000',
										duration: 'PT23H59M',
										recurrence: 'FREQ:DAILY;BYDAY:MO,TU,WE,TH,FR,SA,SU',
									},
								],
							},
						},
						related: {
							recommended: {
								title: 'Nearby',
								href:
									'https://places.api.here.com/places/v1/places/643aabd1-53ee914dcc23073228363ac59065ec06/related/recommended;context=Zmxvdy1pZD0zNWI1ZjU5NC02ZjliLTVjM2MtYTc4Yi1iNmM1MGMzNzk2NDFfMTU3MjEwMzk4NDI0OV8wXzQ4ODE?app_id=8reSLlIyBBc264xxGyn5&app_code=m4c_8rdryhdtInQLX48HZQ',
								type: 'urn:nlp-types:search-results',
							},
							'public-transport': {
								title: 'Public transport nearby',
								href:
									'https://places.api.here.com/places/v1/places/643aabd1-53ee914dcc23073228363ac59065ec06/related/public-transport;context=Zmxvdy1pZD0zNWI1ZjU5NC02ZjliLTVjM2MtYTc4Yi1iNmM1MGMzNzk2NDFfMTU3MjEwMzk4NDI0OV8wXzQ4ODE?app_id=8reSLlIyBBc264xxGyn5&app_code=m4c_8rdryhdtInQLX48HZQ',
								type: 'urn:nlp-types:search-results',
							},
						},
					}, {
						name: 'Bar Alexandrovsky',
						placeId: '643aabd1-53ee914dcc23073228363ac59065ec06',
						view:
							'https://share.here.com/p/s-Yz1yZXN0YXVyYW50O2lkPTY0M2FhYmQxLTUzZWU5MTRkY2MyMzA3MzIyODM2M2FjNTkwNjVlYzA2O2xhdD01NS43NTY2MTtsb249MzcuNjE0MTc7bj1CYXIrQWxleGFuZHJvdnNreTtubGF0PTU1Ljc1NjYxO25sb249MzcuNjE0MTc7cGg9JTJCNzQ5NTI1ODcwMDA7aD00ZDNjNjU',
						location: {
							position: [55.75661, 37.614174],
							address: {
								text: 'Moskva<br/>125009<br/>Russia',
								postalCode: '125009',
								district: 'Tverskoy',
								city: 'Moskva',
								county: 'Moskva',
								state: "Tsentral'niy federal'niy okrug",
								country: 'Russia',
								countryCode: 'RUS',
							},
							access: [
								{
									position: [55.75661, 37.614174],
									accessType: 'road',
								},
							],
						},
						contacts: {
							phone: [
								{
									value: '+74952587000',
									label: 'Phone',
								},
							],
							website: [
								{
									value: 'http://www.national.ru/cuisine',
									label: 'Website',
								},
							],
						},
						categories: [
							{
								id: 'restaurant',
								title: 'Restaurant',
								href:
									'https://places.api.here.com/places/v1/categories/places/restaurant?app_id=8reSLlIyBBc264xxGyn5&app_code=m4c_8rdryhdtInQLX48HZQ',
								type: 'urn:nlp-types:category',
								system: 'places',
								icon:
									'https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon',
							},
							{
								id: 'bar-pub',
								title: 'Bar/Pub',
								href:
									'https://places.api.here.com/places/v1/categories/places/bar-pub?app_id=8reSLlIyBBc264xxGyn5&app_code=m4c_8rdryhdtInQLX48HZQ',
								type: 'urn:nlp-types:category',
								system: 'places',
								icon:
									'https://download.vcdn.data.here.com/p/d/places2/icons/categories/22.icon',
							},
						],
						tags: [
							{
								id: 'asian',
								title: 'Asian',
								group: 'cuisine',
							},
							{
								id: 'european',
								title: 'European',
								group: 'cuisine',
							},
							{
								id: 'russian',
								title: 'Russian',
								group: 'cuisine',
							},
						],
						icon:
							'https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon',
						media: {
							images: {
								available: 0,
								items: [],
							},
							reviews: {
								available: 0,
								items: [],
							},
							ratings: {
								available: 3,
								items: [3, 4, 5],
							},
						},
						extended: {
							openingHours: {
								text: 'Mon-Sun: 00:00 - 23:59',
								label: 'Opening hours',
								isOpen: true,
								structured: [
									{
										start: 'T000000',
										duration: 'PT23H59M',
										recurrence: 'FREQ:DAILY;BYDAY:MO,TU,WE,TH,FR,SA,SU',
									},
								],
							},
						},
						related: {
							recommended: {
								title: 'Nearby',
								href:
									'https://places.api.here.com/places/v1/places/643aabd1-53ee914dcc23073228363ac59065ec06/related/recommended;context=Zmxvdy1pZD0zNWI1ZjU5NC02ZjliLTVjM2MtYTc4Yi1iNmM1MGMzNzk2NDFfMTU3MjEwMzk4NDI0OV8wXzQ4ODE?app_id=8reSLlIyBBc264xxGyn5&app_code=m4c_8rdryhdtInQLX48HZQ',
								type: 'urn:nlp-types:search-results',
							},
							'public-transport': {
								title: 'Public transport nearby',
								href:
									'https://places.api.here.com/places/v1/places/643aabd1-53ee914dcc23073228363ac59065ec06/related/public-transport;context=Zmxvdy1pZD0zNWI1ZjU5NC02ZjliLTVjM2MtYTc4Yi1iNmM1MGMzNzk2NDFfMTU3MjEwMzk4NDI0OV8wXzQ4ODE?app_id=8reSLlIyBBc264xxGyn5&app_code=m4c_8rdryhdtInQLX48HZQ',
								type: 'urn:nlp-types:search-results',
							},
						},
					}].map(recommend => <Recomendation
						className="main-content__recomendation"
						{...recommend}
					/>)}
				</Roll>
				<Fade right>
					<Card className="main-content__filter" width={250} height={250}>
						<Filter
							onCategoriesChange={v => setPickedCategories(v)}
							options={options}
							select={categories}
							selectValues={pickedCategories}
						/>
					</Card>
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
