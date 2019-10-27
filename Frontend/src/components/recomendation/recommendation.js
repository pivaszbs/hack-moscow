import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Rating from 'material-ui-rating';
import { Card } from '../ui';
import './recommendation.sass';

const Recommendation = props => {
	// TODO remove example
	props = {
		...props,
		...{
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
					available: 0,
					items: [],
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
		},
	};
	const { name, categories, media } = props;
	const init_rating =
		media.ratings.items.reduce((accum, current) => accum + current, 0) /
		media.ratings.available;
	// TODO replace 3 with 0
	const [rating, setRate] = useState(init_rating || 3);
	const [isShown, setShown] = useState(false);

	return (
		<div className={'recommendation'}>
			<Card>
				<div className="title">{name}</div>
				<Categories
					categories={categories}
				/>
				{rating ? (
					<Rating value={rating} max={5} onChange={rate => setRate(rate)} />
				) : (
						<div className="rating-stub">Rating not available</div>
					)}
				<button
					type="button"
					className="recommendation__link"
					onClick={() => setShown(!isShown)}
				>
					See more info
				</button>
			</Card>
			{isShown && (
				<Modal>
					<FullRecommendation {...props} callback={setShown} />
				</Modal>
			)}
		</div>
	);
};

const Categories = ({ categories }) => {
	return (
		<div className="categories">
			{categories.map(({ icon, title, id }) => (
				<div key={id} className="recommendation__category">
					{icon && (
						<div className="icon">
							<img src={icon} alt={id} />
						</div>
					)}
					{title}
				</div>
			))}
		</div>
	);
};

const Extended = extended => {
	const { label, text, isOpen } = extended.extended.openingHours;
	return (
		<div className="extended">
			{label} : {text}
			<p className={isOpen ? 'open' : 'close'}>
				Now is {isOpen ? 'open' : 'close'}
			</p>
		</div>
	);
};

const Tags = ({ tags }) => {
	return (
		<div className="tags">
			{tags.map(({ title }) => (
				<div className="recommendation__tag"> {title} </div>
			))}
		</div>
	);
};

const Contacts = ({ contacts }) => {
	return (
		<div className="contacts">
			{Object.values(contacts).map(([{ value, label }]) => (
				<div className="recommendation__contacts">
					{label} : {value}
				</div>
			))}
		</div>
	);
};

const Media = ({ images, reviews }) => {
	return (
		<div className="media">
			<div className="media_images">
				{images.items.map(image => (
					<>
						<img src={image} alt="Recommendation" />
					</>
				))}
			</div>
			<div className="media_reviews">
				{reviews.items.map(review => (
					<div className="recommendation__review">{review}</div>
				))}
			</div>
			<div className="media_ratings" />
		</div>
	);
};

const FullRecommendation = props => {
	const {
		name,
		contacts,
		categories,
		tags,
		icon,
		media,
		extended,
		callback,
	} = props;
	const avg_rating =
		media.ratings.items.reduce((accum, current) => accum + current, 0) /
		media.ratings.available;
	// TODO replace
	const rating = avg_rating ? (
		<Rating value={avg_rating} max={5} disabled />
	) : (
			<Rating value={3} max={5} disabled />
		);
	// const rating = avg_rating ? (
	//     <Rating value={avg_rating} max={5}/>
	// ) : <div className='rating-stub'>Rating not available</div>
	const clickHandler = e => {
		if (e.target !== e.currentTarget) return;
		callback(false);
	};

	return (
		<div className="full-recommendation recommendation" onClick={clickHandler}>
			<Card>
				{icon && (
					<div className="recommendation__icon">
						<img
							src={icon}
							alt="Recommendation icon"
							style={{ margin: 'auto' }}
						/>
					</div>
				)}
				<div className="title">{name}</div>
				<Categories categories={categories} />
				<Extended extended={extended} />
				{rating}
				<Tags tags={tags} />
				<Contacts contacts={contacts} />
				<Media {...media} />
			</Card>
		</div>
	);
};

const Modal = props => {
	return ReactDOM.createPortal(props.children, document.getElementById('root'));
};

export default Recommendation;
