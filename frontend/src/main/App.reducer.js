import actions from './App.actions';

// Initial state for redux.
export const initialState = {
  hasError: false,
  inputNumber: 0,
  medianPrimes: [],
  hasPrimes: false,
  errorMessage: '',
  submitted: false,
  inProgress: false,
};

/**
 * Reducer for the main app.
 */
export default (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case actions.submitSieveNumber.SUCCESS:
      return {
        ...state,
        medianPrimes: payload,
        hasError: false,
        hasPrimes: payload.length > 0,
        submitted: true,
        inProgress: false,
      };
    case actions.inputNumberChange.type:
      return {
        ...state,
        inputNumber: payload,
        hasError: false,
        errorMessage: '',
        hasPrimes: false,
        medianPrimes: [],
        submitted: false,
      };
    case actions.submitSieveNumber.FAILURE:
      return {
        ...state,
        hasError: true,
        errorMessage: payload.message,
        medianPrimes: [],
        hasPrimes: false,
        submitted: true,
        inProgress: false,
      };
    case actions.submitSieveNumber.START:
      return {
        ...state,
        inProgress: true,
        hasPrimes: false,
        submitted: false,
      }
    default:
      return state;
  }
};
