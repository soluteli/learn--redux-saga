import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'

import store from './store'

import Counter from './components/Counter'

const action = type => store.dispatch({type})

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onHello={() => action('HELLO')}
      onLogin={() => action('LOGIN')}
      onLogout={() => action('LOGOUT')}
    />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
