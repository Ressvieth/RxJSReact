import React from 'react';
import './styles/App.scss';

import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { connect, Provider } from 'react-redux';

import * as actions from './actions';
import { reducer } from './reducer';
import 'rxjs';

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

  render() {
    const { isLoading, isError, repositories } = this.props;

    return (
      isLoading ? <p>...Loading</p> : (
        <div> 
          {repositories.map((item, index) => {
            return (<div key={index}>
              {item.name}
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
    getDataRequested: () => dispatch(actions.getDataRequested())
  }
};

Repositories = connect(mapStateToProps, mapDispatchToProps)(Repositories);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <p>
            ObservableJS
          </p>
          <div className='container'>
            Test
          </div>
          <Repositories />
        </header>
      </div>
    </Provider>
  );
}

export default App;
