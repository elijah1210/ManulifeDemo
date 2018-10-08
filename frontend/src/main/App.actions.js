import makeActionCreator from 'make-action-creator';

const getExchangeData = makeActionCreator('GET_EXCHANGE_DATA');
const getHistoricalExchangeData = makeActionCreator('GET_HISTORICAL_EXCHANGE_DATA');
const getPersistedExchangeData = makeActionCreator('GET_PERSISTED_EXCHANGE_DATA');
const setFilterCriteria = makeActionCreator('SET_FILTER_CRITERIA');
const updateDatabaseWithExchangeData = makeActionCreator('UPDATE_DATABASE_WITH_EXCHANGE_DATA');
const updateDatabaseWithExchangeDataBulk = makeActionCreator('UPDATE_DATABASE_WITH_EXCHANGE_DATA_BULK');
const updateDateLastUpdated = makeActionCreator('UPDATE_DATE_LAST_UPDATED');

export default {
  setFilterCriteria,
  getExchangeData,
  getHistoricalExchangeData,
  getPersistedExchangeData,
  updateDatabaseWithExchangeData,
  updateDatabaseWithExchangeDataBulk,
  updateDateLastUpdated,
};
