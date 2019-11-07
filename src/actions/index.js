import { of } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError, takeUntil } from 'rxjs/operators';

export const GET_DATA_REQUESTED = 'GET_DATA_REQUESTED';
// export const ADD_TICKER = 'ADD_TICKER'
export const GET_DATA_DONE = 'GET_DATA_DONE';
export const GET_DATA_FAILED = 'GET_DATA_FAILED';
export const GET_DATA_CANCEL = 'GET_DATA_CANCEL'
export const START_STREAM = 'START_STREAM'

const FINNHUBKEY='bn1bubfrh5rdd4srufr0'
const socket = webSocket(`wss://ws.finnhub.io?token=${FINNHUBKEY}`);

export function openStockStream(ticker) {
  console.log(ticker)
  return {
    type: START_STREAM,
    ticker,
  };
}

export function getDataStop() {
  console.log('Request stopped!')
  return {
    type: GET_DATA_CANCEL
  };
}

export function getDataDone(data) {
  console.log('done', data.data[0])
  return {
    type: GET_DATA_DONE,
    payload: {
      [data.data[0].s]: data.data[0]
    }
  };
}

export function getDataFailed(error) {
  return {
    type: GET_DATA_FAILED,
    payload: error
  };
}

export const stockDataEpic = (action$) => {
  return action$.pipe(
    ofType(START_STREAM),
    mergeMap((action) => (
      socket.multiplex(
        () => ({ type: 'subscribe', 'symbol': action.ticker }),
        () => ({ type: 'unsubscribe', 'symbol': action.ticker }),
        msg => msg.type === 'trade' && msg.data[0].s === action.ticker
      )
        .pipe(
          map(response => getDataDone(response)),
          // map(tick => ({
          //   type: GET_DATA_DONE,
          //   ticker: tick.ticker,
          //   value: tick.value
          // }),
          catchError(error => {
            console.log('err:', error)
            return of(getDataFailed('Connection error!'))
          }),
          // retryWhen(
          //   err => err.type = 'error'
          // ),
        takeUntil(
          action$.pipe(
            ofType(GET_DATA_CANCEL)
          )
        )
    ))));
}
