import { take } from 'redux-saga/effects'

export function* loginFlow() {
  while(true) {
    yield take('LOGIN')
    // ... perform the login logic
    console.log('do login in')
    yield take('LOGOUT')
    // ... perform the logout logic
    console.log('do login out')
  }
}