import React from 'react';
import './toggle.sass';
import { Typo } from '..';

const Toggle = ({children}) => {
    return (
        <label className="switch-wrap">
            <input type="checkbox"/>
            <div className="switch"/>
            <Typo>{children}</Typo>
        </label>
    );
};

export default Toggle;
