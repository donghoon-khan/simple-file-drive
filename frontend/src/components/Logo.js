import React from 'react';

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      src="/static/fileserver.jpg"
      width="100px"
      {...props}
    />
  );
};

export default Logo;
