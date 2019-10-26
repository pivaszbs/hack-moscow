import React from 'react';
import './footer.sass';

const Footer = () => {
	return (
		<footer className="footer">
			Здарова братан, сайт сделан настоящими мужиками:{' '}
			<span className="footer__name">Пашей</span>,{' '}
			<span className="footer__name">Камой</span>,{' '}
			<span className="footer__name">Антохой</span> и{' '}
			<span className="footer__name">HardLight</span>
		</footer>
	);
};

export default Footer;
