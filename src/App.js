import React from 'react';
import './styles/App.scss';

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { connect, Provider } from 'react-redux';

import 'rxjs';
import * as actions from './actions';
import { reducer } from './reducer';
import Chart from './Chart';
import logo from './logoRO.gif';

const epicMiddleware = createEpicMiddleware();
const store = createStore(
  reducer,
  { isLoading: false, isError: false, repositories: [] },
  applyMiddleware(epicMiddleware)
);

export const rootEpic = combineEpics(
  actions.stockDataEpic,
  actions.getDataEpic,
);

epicMiddleware.run(rootEpic);

class Repositories extends React.Component {
  state = {
    chosenTicker: ''
  }

  componentDidMount() {
    this.openBasicStocks()
  }

  openBasicStocks = () => {
    const { openStockStream } = this.props;
    ['AAPL', 'NFLX', 'FB', 'AMZN', 'GOOGL', 'BINANCE:BTCUSDT'].forEach(s => openStockStream(s));
  }

  handleRequest = () => {
    const { stopRequest, isCancelled } = this.props;
    return isCancelled ? this.openBasicStocks() : stopRequest();
  }

  selectSymbol = s => () => {
    const { getCandleDataForSymbol } = this.props;
    getCandleDataForSymbol(s)
    this.setState({ chosenTicker: s })
  }

  render() {
    const { isLoading, isError, isCancelled, tickers, error, candleData } = this.props;
    const { chosenTicker } = this.state
    const ticker = tickers && tickers.filter(ticker => ticker.s === chosenTicker)[0]
    const isPriceHigher = ticker && candleData && (ticker.p > candleData.c[candleData.c.length - 1])
    const isPriceLower = ticker && candleData && (ticker.p < candleData.c[candleData.c.length - 1])

    if (isError) return <p className='error'>Error: {error}</p>

    return (
      <>
        <button onClick={this.handleRequest} className='request-button'>
          {isCancelled ? 'OPEN STREAM' : 'STOP REQUEST'}
        </button>
        {isCancelled && <p className='error'> Request canceled </p>}
        <div className='wrapper'>
          <div className='container'>
            <div className='chart-wrapper'>
              {!ticker && <p> Please select a symbol &nbsp;&nbsp;--->> </p>}
              {isLoading && <p> loading chart... </p>}
              {ticker && candleData && !isLoading && <Chart candleData={candleData} />}
            </div>
            {ticker &&
              <div className='line'>
                <span className='white-text'>{ticker.s}</span>
                <span>price: &nbsp;
                  <span style={{ 'color': `${isPriceHigher ? '#3CFE01' : 'magenta'}`}}>
                    {ticker.p.toFixed(2)} {isPriceHigher && '▲'}{isPriceLower && '▼'}
                  </span>
                </span>
                <span>volume: {ticker.v.toFixed(4)}</span>
              </div>
            }
          </div>
          <div className='navRight'>
            SYMBOLS:
            {tickers && !isCancelled && tickers
              .map((item, index) => {
                return (
                  <div key={index} className='line'>
                    <span className='has-margin-right pointer' onClick={this.selectSymbol(item.s)}>
                      {item.s}
                    </span>
                    <span className='has-margin-right'>
                      <span className='white-text'>
                        ${item.p.toFixed(2)}
                      </span>
                    </span>
                  </div>
                );
            })}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
  tickers: Object.values(state.repositories),
})

const mapDispatchToProps = (dispatch) => {
  return {
    getCandleDataForSymbol: s => dispatch(actions.getCandleData(s)),
    openStockStream: (ticker) => dispatch(actions.openStockStream(ticker)),
    stopRequest: () => dispatch(actions.getDataStop())
  }
};

Repositories = connect(mapStateToProps, mapDispatchToProps)(Repositories);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img className='logo' src={logo} alt='logo'/>
          <p>
            Redux-observable websockets with RxJS for <a className='link' href='https://finnhub.io/docs/api'>https://finnhub.io/docs/api</a> API
          </p>
          <Repositories />
        </header>
      </div>
    </Provider>
  );
}

export default App;
