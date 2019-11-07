import React from 'react';
import './styles/App.scss';

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
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

epicMiddleware.run(actions.stockDataEpic);

class Repositories extends React.Component {
  state = {
    chosenTicker: ''
  }

  componentDidMount() {
    this.openBasicStocks()
  }

  openBasicStocks = () => {
    const { openStockStream } = this.props;
    openStockStream('AAPL');
    openStockStream('NFLX');
    openStockStream('FB');
    openStockStream('AMZN');
    openStockStream('GOOGL');
    openStockStream('BINANCE:BTCUSDT');
  }

  handleRequest = () => {
    const { stopRequest, isCancelled } = this.props;
    return isCancelled ? this.openBasicStocks() : stopRequest();
  }

  selectSymbol = s => () => this.setState({ chosenTicker: s })

  render() {
    const { isLoading, isError, isCancelled, tickers, error } = this.props;
    const { chosenTicker } = this.state
    const ticker = tickers && tickers.filter(ticker => ticker.s === chosenTicker)[0]
    console.log(ticker)
    // const parseDate = (timestap) => {
    //   return new Date(timestap * 1e3).toISOString().slice(-13, -5);
    // }

    if (isError) return <p className='error'>Error: {error}</p>

    return (
      isLoading ? (
        <p>...Loading</p>
      ) : (
        <>
          <button onClick={this.handleRequest} className='request-button'>
            {isCancelled ? 'OPEN STREAM' : 'STOP REQUEST'}
          </button>
          {isCancelled && <p className='error'> Request canceled </p>}
          <div className='wrapper'>
            <div className='container'>
              <div className='white-background'>
                <Chart tickers={tickers} />
              </div>
              {ticker &&
                <div className='line'>
                  <span className='white-text'>{ticker.s}</span>
                  <span>price: {ticker.p.toFixed(2)}</span>
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
      )
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
  tickers: Object.values(state.repositories),
})

const mapDispatchToProps = (dispatch) => {
  return {
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
            Redux-observable websockets with RxJS for <a href='https://finnhub.io/docs/api'>https://finnhub.io/docs/api</a> API
          </p>
          <Repositories />
        </header>
      </div>
    </Provider>
  );
}

export default App;
