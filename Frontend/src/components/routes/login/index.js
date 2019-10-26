import React from 'react';
import GoogleLogin from 'react-google-login';
import { TextField, Button, Select } from '../../ui';
import './login.sass';

const Login = () => {
	const options = [
		{ value: 'chocolate', label: 'Chocolate' },
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'vanilla', label: 'Vanilla' },
	];

	return (
		<div className="login">
			<TextField className="login__text-field" />
			<TextField className="login__text-field" />
			<Button variant="primary" className="login__button">
				Kek lol
			</Button>
			<GoogleLogin className="login__button" disabled buttonText="Google" />
			<Select options={options} />
		</div>
	);
};

export default Login;
