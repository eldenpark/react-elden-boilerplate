import React from "react";
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
      123
      <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/test">Test</Link></li>
        </ul>
    </div>
  );
};
