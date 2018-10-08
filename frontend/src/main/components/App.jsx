import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Header from '../../header/components/Header';
import Table from '../../table/components/Table';

import actions from '../App.actions';
import './App.css';

export class App extends Component {
  /**
   * Lifecycle method for when the component is mounted.
   */
  componentDidMount() {
    const currentDate = new Date();
    const { updateDateLastUpdated, getHistoricalExchangeData } = this.props;
    updateDateLastUpdated(currentDate);
    getHistoricalExchangeData(currentDate);
  }

  /**
   * Handles input value changed
   */
  handleInputChange = (event) => {
    const value = get(event, 'target.value', '');
    const match = value.split(':');
    const { setFilterCriteria } = this.props;
    // If there are exactly two records in the array,
    // then the format matches  {columnLabel}:{value}.
    // If the first argument is more than 4 characters or
    // less than 3 characters, then discard it as format is wrong.
    if (match.length === 2 && match[0].length <= 4 && match[0].length >= 3) {
      setFilterCriteria({
        column: match[0].length === 4 ? match[0].toLowerCase() : match[0].toUpperCase(),
        value: match[1],
      });
    }
  }

  /**
   * Handles button click
   */
  handleClick = () => {
    const currentDate = new Date();
    const { getExchangeData } = this.props;
    getExchangeData(currentDate);
  }

  render() {
    const {
      dateLastUpdated,
      currentUSDCADRate,
      inProgress,
      rates,
      filterCriteria,
    } = this.props;

    const filteredHistoricalRates = rates.filter((rate) => {
      const { column, value } = filterCriteria;
      const rateValue = `${get(rate, column, '')}`;
      return rateValue.includes(`${value}`);
    });

    return (
      <div className="App">
        <Header
          dateLastUpdated={dateLastUpdated}
          currentUSDCADRate={currentUSDCADRate}
        />
        <div className="App-inputs">
          <FormControl id="appFilter">
            <InputLabel htmlFor="appFilterInput" id="appFilterLabel">
              Filtering Input
            </InputLabel>
            <Input
              id="appFilterInput"
              autoFocus
              onChange={this.handleInputChange}
            />
            <FormHelperText id="appFilterInputHelperText">
              Filter columns in the format
              &#123;columnLabel&#125;&#58;&#123;value&#125;.
            </FormHelperText>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleClick}
            disabled={inProgress}
          >
            Get Exchange Data
          </Button>
        </div>
        <Table
          columns={['date', 'AUD', 'CAD', 'GBP', 'EUR']}
          historicalRates={filteredHistoricalRates}
        />
      </div>
    );
  }
}

App.propTypes = {
  getExchangeData: PropTypes.func.isRequired,
  getHistoricalExchangeData: PropTypes.func.isRequired,
  setFilterCriteria: PropTypes.func.isRequired,
  updateDateLastUpdated: PropTypes.func.isRequired,
  dateLastUpdated: PropTypes.string,
  filterCriteria: PropTypes.shape({
    column: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  rates: PropTypes.arrayOf(PropTypes.shape({
    base: PropTypes.string,
    date: PropTypes.string,
    AUD: PropTypes.number,
    CAD: PropTypes.number,
    GBP: PropTypes.number,
    EUR: PropTypes.number,
  })).isRequired,
  currentUSDCADRate: PropTypes.number.isRequired,
  inProgress: PropTypes.bool.isRequired,
};

App.defaultProps = {
  dateLastUpdated: Date().toString(),
};

const mapDispatchToProps = dispatch => ({
  getExchangeData: currentDate => (
    dispatch(actions.getExchangeData.start(currentDate))
  ),
  getHistoricalExchangeData: currentDate => (
    dispatch(actions.getHistoricalExchangeData.start(currentDate))
  ),
  updateDateLastUpdated: currentDate => (
    dispatch(actions.updateDateLastUpdated(currentDate))
  ),
  setFilterCriteria: filterCriteria => (
    dispatch(actions.setFilterCriteria(filterCriteria))
  ),
});

const mapStateToProps = state => ({
  ...state.appReducer,
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
