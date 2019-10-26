import React from 'react';
import GoogleLogin from 'react-google-login';
import { TextField, Button } from '../../ui';
import './login.sass';

const Login = () => {
    return (
        <div className='login'>
            <TextField className='login__text-field' />
            <TextField className='login__text-field' />
            <Button className='login__button'>Kek lol</Button>
            <GoogleLogin className='login__button' disabled buttonText='Google' />
        </div>
    );
}

export default Login;