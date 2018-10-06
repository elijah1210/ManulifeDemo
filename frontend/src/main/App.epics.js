import { of } from 'rxjs';
import {
  mergeMap,
  map,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';
import {
  ofType,
  combineEpics,
} from 'redux-observable';
import actions from './App.actions';

/**
 * Epic middleware for submitting to api endpoint
 * @param {*} action$ Action stream
 * @param {*} state$ State stream
 * @param {*} param2 Dependencies
 */
export const submitSieveNumberEpic = (action$, state$, { getJSON }) => action$.pipe(
  ofType(actions.submitSieveNumber.START),
  withLatestFrom(state$),
  mergeMap(([, state]) => getJSON(`/api/sieve-number/${state.appReducer.inputNumber}`).pipe(
    map(response => actions.submitSieveNumber.success(response)),
    catchError(error => of(actions.submitSieveNumber.failure(error.xhr.response))),
  )),
);

export default combineEpics(submitSieveNumberEpic);
