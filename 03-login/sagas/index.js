import { delay } from 'redux-saga'
import { put, takeEvery, all, call, select } from 'redux-saga/effects'

import { watchFirstThreeHello } from './helloSaga'
import { loginFlow } from './loginSaga'

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    watchFirstThreeHello(),
    loginFlow()
  ])
}