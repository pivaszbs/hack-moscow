import React from 'react';
import './text-field.sass';
import clsx from "clsx";

const TextField = (props) => {
    const {
        placeholder,
        className,
        button,
        ...other
    } = props;

    return (
        <div className={clsx(
            'text-field',
            className)
        }>
            <input
                placeholder={placeholder}
                {...other}
            />
        </div>
    );
};

export default TextField;
