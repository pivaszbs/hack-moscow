import React from 'react';
import Logo from '../../assets/images/logo.png';
import './header.sass';

const Header = () => {
	return (
		<div className="header">
			<img src={Logo} alt="logo" />
		</div>
	);
};

export default Header;
