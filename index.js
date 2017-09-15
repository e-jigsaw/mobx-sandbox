import {createElement} from 'react'
import {render} from 'react-dom'
import {Provider} from 'mobx-react'
import {enableLogging} from 'mobx-logger'
import App from './src/App.js'
import Store from './src/Store.js'

enableLogging()
const store = new Store()

render(
  createElement(Provider, {store}, createElement(App)),
  document.getElementById('app')
)
