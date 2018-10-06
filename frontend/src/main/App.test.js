import React from 'react';
import { render } from 'react-dom';
import { of } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { ActionsObservable } from 'redux-observable';
import { App } from './components/App';
import actions from './App.actions';
import appReducer, { initialState as reducerInitialState } from './App.reducer';
import * as epics from './App.epics';

describe('<App />', () => {
  it('shall render without crashing.', () => {
    const div = document.createElement('div');
    render(
      <App
        submitNumber={jest.fn()}
        updateInputNumber={jest.fn()}
        inputNumber={0}
        medianPrimes={[]}
        hasError={false}
        hasPrimes={false}
        errorMessage=""
        submitted
        inProgress={false}
      />, div,
    );
  });
});

describe('App Reducer', () => {
  it('shall handle input number change action.', () => {
    const stateAfter = {
      ...reducerInitialState,
      inputNumber: 4,
    };

    const action = actions.inputNumberChange(4);

    expect(appReducer(reducerInitialState, action)).toEqual(stateAfter);
  });

  it('shall handle submit sieve start action.', () => {
    const stateAfter = {
      ...reducerInitialState,
      inProgress: true,
    };

    const action = actions.submitSieveNumber.start();

    expect(appReducer(reducerInitialState, action)).toEqual(stateAfter);
  });

  it('shall handle submit sieve success action.', () => {
    const stateAfter = {
      ...reducerInitialState,
      medianPrimes: [3, 5],
      hasPrimes: true,
      submitted: true,
    };

    const action = actions.submitSieveNumber.success([3, 5]);

    expect(appReducer(reducerInitialState, action)).toEqual(stateAfter);
  });

  it('shall handle submit sieve failure action.', () => {
    const stateAfter = {
      ...reducerInitialState,
      hasError: true,
      errorMessage: 'ACTION_FAILED',
      submitted: true,
    };

    const action = actions.submitSieveNumber.failure({ message: 'ACTION_FAILED' });

    expect(appReducer(reducerInitialState, action)).toEqual(stateAfter);
  });
});

describe('App Epics', () => {
  it('shall handle submitSieveNumber.', () => {
    const mockResponse = [3, 5];
    const action$ = ActionsObservable.of(actions.submitSieveNumber.start());
    const state$ = of({
      appReducer: {
        inputNumber: 10,
      },
    });

    const expectedOutput = [actions.submitSieveNumber.success(mockResponse)];

    const dependencies = {
      getJSON: () => of(mockResponse),
    };

    let actualOutput = null;

    epics.submitSieveNumberEpic(action$, state$, dependencies)
      .pipe(
        toArray(),
      ).subscribe((outputActions) => {
        // For some reason, the expect being always passes when called here.
        // Cache the output in a variable and then evaluate outside.
        actualOutput = outputActions;
      });

    expect(actualOutput).toEqual(expectedOutput);
  });
});
