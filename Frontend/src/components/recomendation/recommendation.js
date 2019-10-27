import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Rating from 'material-ui-rating';
import { Card } from '../ui';
import './recommendation.sass';

const Recommendation = props => {
	// TODO remove example
	console.log(props);
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
