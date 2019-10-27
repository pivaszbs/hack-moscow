import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PlayButton from '../../../assets/images/play-button.png';
import PauseButton from '../../../assets/images/pause-button.png';
import './audioguide.sass';
import { PrettoSlider } from '../pretty-slider/prettySlider';

const Audioguide = props => {
	const { className, maxTime } = props;
	const [timeOffset, setTimeOffset] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	return (
		<div className="audio-card">
			<h2> Recommended audio guide for this trip </h2>
			<div className={clsx('audioguide', className)}>
				<Icon
					className="audioguide-icon"
					isPlaying={isPlaying}
					callback={setIsPlaying}
				/>
				<AudioBar
					timeOffset={timeOffset}
					maxTime={maxTime}
					isPlaying={isPlaying}
					callback={setTimeOffset}
				/>
			</div>
		</div>
	);
};

const Icon = ({ className, isPlaying, callback }) => {
	const [iconSource, setIconSource] = useState(PlayButton);

	useEffect(() => {
		if (isPlaying) {
			setIconSource(PauseButton);
		} else {
			setIconSource(PlayButton);
		}
	});

	const clickHandle = () => {
		callback(!isPlaying);
	};

	return (
		<img
			className={clsx('icon', className)}
			src={iconSource}
			onClick={clickHandle}
			alt="icon"
		/>
	);
};

const AudioBar = ({
	className,
	maxTime,
	timeOffset = 0,
	isPlaying,
	callback,
}) => {
	const timeOffsetRef = useRef(timeOffset);

	useEffect(() => {
		if (isPlaying) {
			const timerId = setTimeout(() => {
				callback(timeOffset + 1);
			}, 1000);
			return () => {
				clearTimeout(timerId);
			};
		}
	});

	const changeHandler = (event, value) => {
		callback(value);
	};

	const formatTime = time => {
		const seconds = time % 60;
		const minutes = (time / 60).toFixed(0) % 60;
		const hours = (time / 60 / 60).toFixed(0);

		const f_seconds = ('0' + seconds).substr(-2);
		const f_minutes = ('0' + minutes).substr(-2);

		if (hours > 0) return `${hours}:${f_minutes}:${f_seconds}`;

		return `${minutes}:${f_seconds}`;
	};

	return (
		<div className={clsx('slidecontainer', className)}>
			<PrettoSlider
				valueLabelDisplay="auto"
				aria-label="pretto slider"
				value={typeof timeOffset === 'number' ? timeOffset : 0}
				valueLabelFormat={formatTime}
				max={maxTime}
				onChange={changeHandler}
			/>
			<small style={{ float: 'left' }}>{formatTime(timeOffset)}</small>
			<small style={{ float: 'right' }}>{formatTime(maxTime)}</small>
		</div>
	);
};

export default Audioguide;
