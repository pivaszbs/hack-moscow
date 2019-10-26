import React from 'react';
import clsx from 'clsx';
import './card.sass';

const Card = ({ height, width, className, children }) => {
    return (
        <div style={{ height, width }} className={clsx('card', className)}>
            {children}
        </div>
    );
}

export default Card;