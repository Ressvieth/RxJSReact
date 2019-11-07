// import { of, Subject } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError, takeUntil, retryWhen } from 'rxjs/operators';

export const GET_DATA_REQUESTED = 'GET_DATA_REQUESTED';
export const GET_DATA_DONE = 'GET_DATA_DONE';
export const GET_DATA_FAILED = 'GET_DATA_FAILED';
export const GET_DATA_CANCEL = 'GET_DATA_CANCEL'
export const START_STREAM = 'START_STREAM'

const FINNHUBKEY='bn1bubfrh5rdd4srufr0'
const socket = webSocket(`wss://ws.finnhub.io?token=${FINNHUBKEY}`);

export function openStockStream() {
  return {
    type: START_STREAM,
  };
}

export function getDataStop() {
  console.log('Request stopped!')
  return {
    type: GET_DATA_CANCEL
  };
}

export function getDataDone(data) {
  console.log('done', data)
  return {
    type: GET_DATA_DONE,
    payload: data
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
    mergeMap((action) => {
      console.log('in epic MergeMap', action)
      return socket.multiplex(
        () => ({ type: 'subscribe', 'symbol': 'AAPL' }),
        () => ({ unsub: action.ticker }),
        msg => msg.type === 'trade'
      )
      .pipe(
        // catchError(error => {
        //   console.log('err:', error)
        //   // return of(getDataFailed(error.response.message))
        // }),
      // retryWhen(
      //   err => window.navigator.onLine ?
      //     Observable.timer(1000) :
      //     Observable.fromEvent(window, 'online')
      // ),
        map(response => getDataDone(response)),
      // takeUntil(
      //   action$.pipe(
      //     ofType('CLOSE_TICKER_STREAM')
      //     // console.log(closeAction)
      //     // .filter(closeAction => closeAction.ticker === action.ticker)
      //   )
      // )
    )}));
}
