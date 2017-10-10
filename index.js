import 'babel-polyfill'
import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'mobx-react'
import {enableLogging} from 'mobx-logger'
import App from './src/App1.js'
import {Element} from './src/Store1.js'

enableLogging()
const element = new Element()

render(
  createElement(Provider, {element}, createElement(App)),
  document.getElementById('app')
)
