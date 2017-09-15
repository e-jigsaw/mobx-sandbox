import React, {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import Store from './Store.js'

const onClick = store => event => store.setStore('store1', Store)

export default inject(stores => ({
  store: stores.store,
  store1: stores.store.stores.get('store1')
}))(observer(({store, store1}) => {
  let s1 = null
  if (store1) {
    s1 = pug`
      div
        div {store1.root.count}
        div {store1.count}
        div {store1.double}
        button(onClick='{store1.tick}') inc
    `
  }
  return pug`
    div
      div {s1}
      div {store.count}
      div {store.double}
      button(onClick='{store.tick}') inc
      button(onClick='{onClick(store)}') set
  `
}))
