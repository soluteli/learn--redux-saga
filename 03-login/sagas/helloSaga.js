import { take, put } from 'redux-saga/effects'
export function* watchFirstThreeHello() {
  for(let i = 0; i < 3; i++) {
    const action = yield take('HELLO')
    // yield put({ type: 'INCREMENT' })
    console.log('hello')
  }
  yield take('HELLO')
  console.log('congratulations😁')
}