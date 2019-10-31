import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';

export const GET_DATA_REQUESTED = 'GET_DATA_REQUESTED';
export const GET_DATA_DONE = 'GET_DATA_DONE';
export const GET_DATA_FAILED = 'GET_DATA_FAILED';

const IEKEY = '7afda1182cmsh7eb95eb8556aa8dp19afe2jsn4935780fe34f'

export function getDataRequested() {
  return {
    type: 'GET_DATA_REQUESTED'
  };
}

export function getDataDone(data) {
  return {
    type: 'GET_DATA_DONE',
    payload: data
  };
}

export function getDataFailed(error) {
  return {
    type: 'GET_DATA_FAILED',
    payload: error
  };
}

export const getDataEpic = (action$) => (
  action$.pipe(
    ofType(GET_DATA_REQUESTED),
    mergeMap(action =>
      ajax({
        url: 'https://investors-exchange-iex-trading.p.rapidapi.com/stock/GOOG/book',
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'investors-exchange-iex-trading.p.rapidapi.com',
          'x-rapidapi-key': IEKEY
        },
      })
        .pipe(
          map(response => getDataDone(response)),
          catchError(error => {
            console.log('err:', error)
            return of(getDataFailed(error.response.message))
          })
        )
    ))
)
