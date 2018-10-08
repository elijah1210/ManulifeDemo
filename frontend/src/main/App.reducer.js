import {
  orderBy,
  get,
  uniqBy,
} from 'lodash';
import actions from './App.actions';

// Initial state for redux.
export const initialState = {
  currentUSDCADRate: 0,
  inProgress: false,
  dateLastUpdated: new Date().toString(),
  rates: [],
  filterCriteria: {
    column: '',
    value: '',
  },
};

/**
 * Reducer for the main app.
 */
export default (state = initialState, action) => {
  const { payload } = action;
  switch (action.type) {
    case actions.getExchangeData.START: {
      return {
        ...state,
        inProgress: true,
      };
    }
    case actions.getExchangeData.SUCCESS: {
      const { dateLastUpdated, CAD, ...rest } = payload;
      return {
        ...state,
        inProgress: false,
        currentUSDCADRate: CAD,
        dateLastUpdated,
        rates: uniqBy(state.rates.concat({ CAD, ...rest }), 'date'),
      };
    }
    case actions.getHistoricalExchangeData.SUCCESS: {
      const currentUSDCADRate = get(orderBy(payload.rates, ['date'], ['desc'])[0], 'CAD', 0);
      return {
        ...state,
        inProgress: false,
        rates: payload.rates,
        currentUSDCADRate,
      };
    }
    case actions.setFilterCriteria.type: {
      return {
        ...state,
        filterCriteria: payload,
      };
    }
    default:
      return state;
  }
};
