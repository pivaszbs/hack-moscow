import React from 'react';
import clsx from 'clsx';

const Button = ({ className, type, children }) => {
    return (
        <button type={type} className={clsx('button', className)}>
            {children}
        </button>
    );
}

export default Button;