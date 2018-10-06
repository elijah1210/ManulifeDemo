import makeActionCreator from 'make-action-creator';

const submitSieveNumber = makeActionCreator('SUBMIT_SIEVE_NUMBER');
const inputNumberChange = makeActionCreator('INPUT_NUMBER_CHANGE');

export default { submitSieveNumber, inputNumberChange };
