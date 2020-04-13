import {applyMiddleware, compose, createStore} from 'redux'
// import logger from 'redux-logger'
import reducers from './reducers'
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
// import {IS_REDUX_LOGGER_OPEN} from './config'

const middlewares = []
const sagaMiddleware = createSagaMiddleware()
middlewares.push(sagaMiddleware)
// if (process.env.NODE_ENV === 'development' && IS_REDUX_LOGGER_OPEN ) {
//   middlewares.push(logger)
// }
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(
    applyMiddleware(...middlewares)
));
sagaMiddleware.run(rootSaga)

export default store;
