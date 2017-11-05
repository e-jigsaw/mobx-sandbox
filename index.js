import 'babel-polyfill'
import {onSnapshot} from 'mobx-state-tree'
import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'mobx-react'
import {enableLogging} from 'mobx-logger'
import App from './src/App1.js'
import {Store} from './src/Store1.js'

enableLogging()
const store = Store.create({
  elements: [],
  undoStack: [],
  redoStack: []
})
window.store = store

render(
  createElement(Provider, {store}, createElement(App)),
  document.getElementById('app')
)
