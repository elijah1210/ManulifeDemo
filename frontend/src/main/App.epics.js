import {
  of,
  forkJoin,
} from 'rxjs';
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
import {
  uniqBy,
} from 'lodash';
import actions from './App.actions';

function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

const dayInMilliseconds = 86400000;

/**
 * Epic middleware for getting the latest data from the api openrates endpoint.
 * @param {*} action$ Action stream
 * @param {*} state$ State stream
 * @param {*} param2 Dependencies
 */
export const getExchangeDataEpic = (action$, state$, { getJSON }) => action$.pipe(
  ofType(actions.getExchangeData.START),
  withLatestFrom(action$),
  mergeMap(([, action]) => {
    const { payload } = action;
    const dateString = formatDate(payload);
    return getJSON(`http://api.openrates.io/${dateString}?symbols=GBP,EUR,AUD,CAD&base=USD`).pipe(
      mergeMap((response) => {
        const { base, date, rates } = response;
        return of(
          actions.getExchangeData.success({
            base,
            date,
            ...rates,
            dateLastUpdated: payload.toString(),
          }),
          actions.updateDatabaseWithExchangeData.start(response),
        );
      }),
      catchError(error => of(actions.getExchangeData.failure(error.xhr.response))),
    );
  }),
);

/**
 * Epic middleware for persisting the database with the latest exchange data.
 * @param {*} action$ Action stream
 * @param {*} state$ State stream
 * @param {*} param2 Dependencies
 */
export const updateDatabaseWithExchangeDataEpic = (action$, state$, { post }) => action$.pipe(
  ofType(actions.updateDatabaseWithExchangeData.START),
  withLatestFrom(action$),
  mergeMap(([, action]) => {
    const { payload } = action;
    return post('/api/update-exchange-data', payload, { 'Content-Type': 'application/json; charset=utf-8' })
      .pipe(
        map(() => actions.updateDatabaseWithExchangeData.success()),
        catchError(error => of(actions.updateDatabaseWithExchangeData.failure(error.xhr.response))),
      );
  }),
);

/**
 * Epic middleware for getting last 30 days historical data from the api.
 * @param {*} action$ Action stream
 * @param {*} state$ State stream
 * @param {*} param2 Dependencies
 */
export const getHistoricalExchangeDataEpic = (action$, state$, { getJSON }) => action$.pipe(
  ofType(actions.getHistoricalExchangeData.START),
  withLatestFrom(action$),
  mergeMap(([, action]) => {
    const { payload } = action;
    let dateTime = payload.getTime();
    const requests = [];
    for (let i = 0; i < 91; i += 1) {
      const dateString = formatDate(dateTime);
      requests.push(getJSON(`http://api.openrates.io/${dateString}?symbols=GBP,EUR,AUD,CAD&base=USD`));
      dateTime -= dayInMilliseconds;
    }
    const request = of(requests);
    return request.pipe(
      mergeMap(x => forkJoin(x)
        .pipe(
          mergeMap((response) => {
            const rates = uniqBy(response.map(rate => ({
              base: rate.base,
              date: rate.date,
              ...rate.rates,
            })), 'date');
            return of(
              actions.getHistoricalExchangeData.success({ rates }),
              actions.updateDatabaseWithExchangeDataBulk.start(response),
            );
          }),
          catchError(error => of(actions.getHistoricalExchangeData.failure(error.xhr.response))),
        )),
    );
  }),
);

/**
 * Epic middleware for persisting the database with the last 30 days worth of exchange data.
 * @param {*} action$ Action stream
 * @param {*} state$ State stream
 * @param {*} param2 Dependencies
 */
export const updateDatabaseWithExchangeDataBulkEpic = (action$, state$, { post }) => action$.pipe(
  ofType(actions.updateDatabaseWithExchangeDataBulk.START),
  withLatestFrom(action$),
  mergeMap(([, action]) => {
    const { payload } = action;
    return post('/api/update-exchange-data-bulk', payload, { 'Content-Type': 'application/json; charset=utf-8' })
      .pipe(
        map(() => actions.updateDatabaseWithExchangeDataBulk.success()),
        catchError(error => of(
          actions.updateDatabaseWithExchangeDataBulk.failure(error.xhr.response),
        )),
      );
  }),
);

export default combineEpics(
  getExchangeDataEpic,
  updateDatabaseWithExchangeDataEpic,
  getHistoricalExchangeDataEpic,
  updateDatabaseWithExchangeDataBulkEpic,
);
