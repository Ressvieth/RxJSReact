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

    const parseDate = (timestap) => {
      return new Date(timestap * 1e3).toISOString().slice(-13, -5);
    }

    if (isError) return <p className='error'>Error: {error}</p>

    return (
      isLoading ? (
        <>
          <p>...Loading</p>
           <button onClick={this.cancelRequest}>STOP REQUEST</button>
        </>
      ) : (
        <div className='container'>
          {isCancelled && <p> Request canceled </p>}
          {repositories && !isCancelled && repositories.data &&
            repositories.data.map((item, index) => {
              return (
                <div key={index} className='line'>
                <span><span className='white-text has-margin-right'>{item.s}</span></span>
                <span className='has-margin-right'>
                  price: &nbsp;
                  <span className='white-text has-margin-right'>
                    ${item.p.toFixed(2)}
                  </span>
                </span>
                <div> timestamp: {parseDate(item.t)} </div>
              </div>
              );
            })}
            {console.log(repositories)}
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
            Redux-observable websockets with RxJS for <i>investors-exchange-iex-trading</i> API
          </p>
          <Repositories />
        </header>
      </div>
    </Provider>
  );
}

export default App;
