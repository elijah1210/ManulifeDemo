import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  const { dateLastUpdated, currentUSDCADRate } = props;
  return (
    <header className="App-header">
      <h1 className="App-title">
                Manulife Demo
      </h1>
      <h2 className="App-intro">
                Current Rate:&nbsp;
        {currentUSDCADRate}
        &nbsp;
                Date Last Updated:&nbsp;
        {dateLastUpdated}
      </h2>
    </header>);
};

Header.propTypes = {
  currentUSDCADRate: PropTypes.number.isRequired,
  dateLastUpdated: PropTypes.string.isRequired,
};

export default Header;
