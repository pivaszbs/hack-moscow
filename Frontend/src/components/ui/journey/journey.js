import './journey.sass'
import React, {useEffect, useState} from "react";
import axios from 'axios'
import Pointer from '../../../assets/images/pointer.png'
import Rating from 'material-ui-rating';
import {Input, TextareaAutosize} from "@material-ui/core";

const Journey = props => {
    const {places} = props;

    return <div className='journey'>
        {places.map((place, ind) => <>
            <PlaceCard {...place} ind={ind}/>
            <PlacePointer/>
        </>)}
        <FeedBack/>
    </div>
};

const PlaceCard = props => {
    const {longitude, latitude, ind} = props;
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [href, setHref] = useState('');

    const getPlaceInfo = ({longitude, latitude}) => {
        axios.get(`https://places.cit.api.here.com/places/v1/discover/here?` +
            `app_id=P0qk3pi3vio7URSRX1UO&app_code=3fLws3lWLusLE0yeFpcLOA&at=${longitude},${latitude}`)
            .then(resp => {
                const {averageRating: rating, title, category, href} = resp.data.results.items[0];
                setRating(rating);
                setTitle(title);
                setCategories([category]);
                setHref(href);
            });
    };

    useEffect(() => getPlaceInfo({longitude, latitude}), []);
    return <div className='place-card'>
        <div className='card-header'>{title}</div>
        <div className='content'>
            <div className='place-image'>
                <img src={`https://source.unsplash.com/200x200?${categories[0]}${ind}`}
                     alt='Place image'/>
            </div>
            <Categories categories={categories}/>
            <Rating value={rating} max={5} onChange={rate => setRating(rate)} />
        </div>
    </div>
};

const PlacePointer = () => {
    return <div className='pointer'><img src={Pointer} alt='pointer'/></div>
};

const FeedBack = () => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [feedback, setFeedback] = useState('');

    const titleChanged = (e, title) => {
      setTitle(title)
    };
    const feedbackChanged = (e, feedback) => {
      setFeedback(feedback)
    };
    // useEffect(() => getPlaceInfo({longitude, latitude}), []);
    return <div className='place-feedback'>
        <div className='feedback-header'><Input value={title} onChange={titleChanged} placeholder={'Trip name'} /> </div>
        <div className='content'>
            <TextareaAutosize value={feedback} onChange={feedbackChanged} placeholder={'Trip name'} />
            <h3>Rate this trip</h3>
            <Rating value={rating} max={5} onChange={rate => setRating(rate)} />
        </div>
    </div>
};

const Categories = ({categories}) => {
    return (
        <div className="categories">
            {categories.map(({title, id}) => (
                <div key={id} className="journey__category">
                    {title}
                </div>
            ))}
        </div>
    );
};

export default Journey;