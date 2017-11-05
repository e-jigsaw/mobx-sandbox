import 'babel-polyfill'
import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'mobx-react'
import {enableLogging} from 'mobx-logger'
import App from './src/App1.js'
import {Store} from './src/Store1.js'

enableLogging()
const store = Store.create({
  elements: []
})
window.store = store

render(
  createElement(Provider, {store}, createElement(App)),
  document.getElementById('app')
)
