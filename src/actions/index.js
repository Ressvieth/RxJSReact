// import { ajax } from 'rxjs/ajax';
// import { of, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ofType } from 'redux-observable';
import { mergeMap, map, catchError, takeUntil, retryWhen } from 'rxjs/operators';

export const GET_DATA_REQUESTED = 'GET_DATA_REQUESTED';
export const GET_DATA_DONE = 'GET_DATA_DONE';
export const GET_DATA_FAILED = 'GET_DATA_FAILED';
export const GET_DATA_CANCEL = 'GET_DATA_CANCEL'
export const START_STREAM = 'START_STREAM'

const FINNHUBKEY='bn1bubfrh5rdd4srufr0'
const socket = webSocket(`wss://ws.finnhub.io?token=${FINNHUBKEY}`);
console.log('socket', socket)

// const IEKEY = '7afda1182cmsh7eb95eb8556aa8dp19afe2jsn4935780fe34f'
// const IETOKEN = 'pk_191a27cae96746298c5703e97d8a86cf'
// const IESTOKEN = 'sk_3973cd07dd9d49a390807c15e923b56b'
// const ALPHAKEY = 'O2SXYBJ0A5M7OTOA'
// const WTD = '50VBTDfw27dGiVmTnm3EF41JVbd6Lukjlt0Qd955O02meArInOsl7OpHHoar'
// const BASE ='https://cloud.iexapis.com/v1/'
// const FINNHUBKEY='bn1bubfrh5rdd4srufr0'

// const socket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUBKEY}`);
// export function getDataRequested() {
//   return {
//     type: 'GET_DATA_REQUESTED'
//   };
// }

export function openStockStream() {
  return {
    type: 'START_STREAM',
  };
}

export function getDataStop() {
  console.log('Request stopped!')
  return {
    type: 'GET_DATA_CANCEL'
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

export const stockDataEpic = (action$) => {
  return action$.pipe(
    ofType(START_STREAM),
    mergeMap((action) => {
      console.log('in epic MergeMap', action)
      return socket.multiplex(
        () => {
          console.log('action');
          // return ({ sub: action.ticker })
          return ({ type: 'subscribe', 'symbol': 'AAPL' })
        },
        () => ({ unsub: action.ticker }),
        msg => console.log('msg', msg),
        msg => msg.ticker === action.ticker
      )})
      // )).pipe(
      // retryWhen(
      //   err => window.navigator.onLine ?
      //     Observable.timer(1000) :
      //     Observable.fromEvent(window, 'online')
      // ),
      // map(tick => ({ type: 'TICKER_TICK', tick })),
      // takeUntil(
      //   action$.pipe(
      //     ofType('CLOSE_TICKER_STREAM')
      //     // console.log(closeAction)
      //     // .filter(closeAction => closeAction.ticker === action.ticker)
      //   )
      // )
    );
}

// export const stockDataEpic = (action$, store) => {
//   return action$.pipe(
//     ofType('START_TICKER_STREAM'),
//     mergeMap(action => 
//       socket.multiplex(
//         () => ({ sub: action.ticker }),
//         () => ({ unsub: action.ticker }),
//         msg => msg.ticker === action.ticker
//       )).pipe(
//       // retryWhen(
//       //   err => window.navigator.onLine ?
//       //     Observable.timer(1000) :
//       //     Observable.fromEvent(window, 'online')
//       // ),
//       map(tick => ({ type: 'TICKER_TICK', tick })),
//       takeUntil(
//         action$.pipe(
//           ofType('CLOSE_TICKER_STREAM')
//           // console.log(closeAction)
//           // .filter(closeAction => closeAction.ticker === action.ticker)
//         )
//       )
//     ));
// }

// export const getDataEpic = (action$) => {
//   return action$.pipe(
//     ofType(GET_DATA_REQUESTED),
//     mergeMap(action =>
//       ajax({
//         url: `https://api.worldtradingdata.com/api/v1/stock?symbol=SNAP,TWTR,VOD.L&api_token=${WTD}`,
//         // url: `${BASE}tops/last?token=${IETOKEN}`,
//         // url: 'https://investors-exchange-iex-trading.p.rapidapi.com/stock/AAPL/book',
//         method: 'GET',
//         // headers: {
//         //   // 'x-rapidapi-host': 'mxrck-ser-programadores-apis.p.rapidapi.com',
//         //   'x-rapidapi-host': 'investors-exchange-iex-trading.p.rapidapi.com',
//         //   'x-rapidapi-key': IEKEY
//         // },
//       })
//         .pipe(
//           map(response => getDataDone(response)),
//           catchError(error => {
//             console.log('err:', error)
//             // return of(getDataFailed(error.response.message))
//           }),
//           takeUntil(action$.pipe(
//             ofType(GET_DATA_CANCEL)
//           ))
//         )
//     ))
// }
