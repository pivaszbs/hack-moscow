import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import './avatar.sass';

function Avatar({ avatar, className }) {
  return <img alt="avatar" className={clsx('avatar', className)} src={avatar} />;
}

Avatar.propTypes = {
  avatar: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Avatar.defaultProps = {
  className: '',
};

export default Avatar;
