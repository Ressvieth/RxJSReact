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

epicMiddleware.run(actions.getDataEpic);

class Repositories extends React.Component {
  componentDidMount() {
    const { getDataRequested } = this.props;
    getDataRequested();
  }

  cancelRequest = () => {
    const { stopRequest } = this.props;
    stopRequest();
  }

  render() {
    const { isLoading, isError, isCancelled, repositories, error } = this.props;
    console.log(this.props)

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
          {repositories && !isCancelled && repositories.response && repositories.response
            .map((item, index) => {
              return (
              <div key={index} className='line'>
                <span>Vol: <span className='white-text has-margin-right'>{item.volume}</span></span>
                <span className='has-margin-right'>
                  {item.venueName}
                  <span className='white-text has-margin-right'>
                    ({item.venue})
                  </span>
                </span>
                <div> {item.priceImprovement} </div>
              </div>);
            })}
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
    getDataRequested: () => dispatch(actions.getDataRequested()),
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
