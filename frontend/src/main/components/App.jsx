import React, { Component } from 'react';
import { connect } from 'react-redux';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';

import actions from '../App.actions';
import './App.css';

export class App extends Component {
  /**
   * Handles input change
   */
  handleInputChange = (event) => {
    const { updateInputNumber } = this.props;
    updateInputNumber(event.target.value);
  }

  render() {
    const {
      submitNumber,
      inputNumber,
      medianPrimes,
      hasError,
      hasPrimes,
      errorMessage,
      submitted,
      inProgress,
    } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Manulife Demo
          </h1>
        </header>
        <p className="App-intro">
          Enter a number to get the median prime number(s) of the
          set of prime numbers less than your number.
        </p>
        <div className="App-inputs">
          <FormControl error={hasError} id="appNumber">
            <InputLabel htmlFor="appNumberInput" id="appNumberLabel">
              Numeric Input
            </InputLabel>
            <Input
              id="appNumberInput"
              type="number"
              onChange={this.handleInputChange}
              value={inputNumber}
              autoFocus
              inputProps={{ min: 0, max: 10000000 }}
            />
            <FormHelperText id="appNumberInputHelperText">
              {hasError && errorMessage}
              {hasPrimes && `The median primes for ${inputNumber} are ${medianPrimes}.`}
              {submitted && !(hasPrimes || hasError) && `There are no median primes for ${inputNumber}.`}
              {inProgress && 'Calculation currently in progress.'}
            </FormHelperText>
            <Button
              variant="contained"
              color="primary"
              onClick={submitNumber}
              disabled={inProgress}
            >
            Submit
            </Button>
          </FormControl>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  submitNumber: PropTypes.func.isRequired,
  inputNumber: PropTypes.number.isRequired,
  updateInputNumber: PropTypes.func.isRequired,
  medianPrimes: PropTypes.arrayOf(PropTypes.number).isRequired,
  hasError: PropTypes.bool.isRequired,
  hasPrimes: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  submitted: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  submitNumber: () => dispatch(actions.submitSieveNumber.start()),
  updateInputNumber: value => dispatch(actions.inputNumberChange(value)),
});

const mapStateToProps = state => ({
  ...state.appReducer,
});


export default connect(mapStateToProps, mapDispatchToProps)(App);
