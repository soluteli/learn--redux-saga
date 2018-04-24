import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from '../reducers'

// sagas
import rootSaga from '../sagas'
const sagaMiddleware = createSagaMiddleware()

// middlewares
const middlewares = [
  sagaMiddleware,
]

// Enhancer
const win = window;
const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  (win && win.devToolsExtension) ? win.devToolsExtension() : (f) => f,
);

const store = createStore(
  reducer,
  storeEnhancers
)

sagaMiddleware.run(rootSaga)

export default store