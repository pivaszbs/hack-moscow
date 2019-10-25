import React from 'react';
import './toggle.sass';
import Text from "../text";

const Toggle = ({children}) => {
    return (
        <label className="switch-wrap">
            <input type="checkbox"/>
            <div className="switch"/>
            <Text>{children}</Text>
        </label>
    );
};

export default Toggle;
