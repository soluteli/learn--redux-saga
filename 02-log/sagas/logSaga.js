import { take, takeEvery, select } from 'redux-saga/effects'

/* 使用 takeEvery 的方式添加日志功能 */
export function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select()
    console.log('action', action)
    console.log('state after', state)
  })
}
