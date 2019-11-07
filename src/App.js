import React from 'react';
import './styles/App.scss';

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { connect, Provider } from 'react-redux';

import * as actions from './actions';
import { reducer } from './reducer';
import 'rxjs';
import logo from './logoRO.gif'

const epicMiddleware = createEpicMiddleware();
const store = createStore(
  reducer,
  { isLoading: false, isError: false, repositories: [] },
  applyMiddleware(epicMiddleware)
);

// epicMiddleware.run(actions.getDataEpic);
epicMiddleware.run(actions.stockDataEpic);

class Repositories extends React.Component {
  componentDidMount() {
    const { openStockStream } = this.props;
    openStockStream();
  }

  cancelRequest = () => {
    const { stopRequest } = this.props;
    stopRequest();
  }

  render() {
    const { isLoading, isError, isCancelled, repositories, error } = this.props;

    // const parseDate = (timestap) => {
    //   return new Date(timestap * 1e3).toISOString().slice(-13, -5);
    // }
    // const updateData = data => {
    //   if(data && data.data && data.data && JSON.parse(data.data)['type'] !== 'ping') this.setState({ serverData: data });
    //   // console.log(data)
    // }

    // const FINNHUBKEY='bn1bubfrh5rdd4srufr0'
    // const socket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUBKEY}`);

    // socket.addEventListener('open', function (event) {
    //   socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
    //   // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
    //   // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
    // });

    // socket.addEventListener('message', function (event) {
    //   console.log(event)
    //   if (event && event.data) updateData(event);
    // });

    if (isError) return <p className='error'>Error: {error}</p>
    // const data = this.state.serverData.data && this.state.serverData.data && JSON.parse(this.state.serverData.data)
    // console.log(data.data)
    // const data = this.state.serverData && JSON.parse(this.state.serverData.data)
    return (
      isLoading ? (
        <>
          <p>...Loading</p>
           <button onClick={this.cancelRequest}>STOP REQUEST</button>
        </>
      ) : (
        <div className='container'>
          {isCancelled && <p> Request canceled </p>}
          {/* {(data || {}).data && data.data.map((item, i) => <div key={i}><p key={i}>{item.p.toFixed(2)}: <span className='white-text'>{item.s}</span></p></div>)} */}
            {repositories && !isCancelled && repositories.response && repositories.response.data &&
            repositories.response.data.map((item, index) => {
              return (
                <div key={index} className='line'>
                <span><span className='white-text has-margin-right'>{item.symbol}</span></span>
                <span className='has-margin-right'>
                  {item.volume}
                  <span className='white-text has-margin-right'>
                    (${item.price})
                  </span>
                </span>
                <div> {item.last_trade_time} </div>
              </div>
              );
            })}
            {/* {console.log(repositories)} */}
        </div>
      )
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => {
  return {
    openStockStream: () => dispatch(actions.openStockStream()),
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
            Redux-observable with RxJS for <i>investors-exchange-iex-trading</i> API
          </p>
          <Repositories />
        </header>
      </div>
    </Provider>
  );
}

export default App;
