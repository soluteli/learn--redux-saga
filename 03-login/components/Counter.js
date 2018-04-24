/*eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react'

const Counter = ({ value, onHello, onLogin, onLogout }) =>
      <div>
        <button onClick={ onHello }>
          hello
        </button>
        <hr/>
        {' '}
        <button onClick={ onLogin }>
          login in
        </button>
        {' '}
        <button onClick={ onLogout }>
          login out
        </button>
      </div>

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onHello: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}

export default Counter
