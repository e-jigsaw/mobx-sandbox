import {extendObservable, observable, action, asMap} from 'mobx'

const asyncFn = () => new Promise(resolve => {
  setTimeout(resolve, 1000)
})

export default class Store {
  constructor (root = null) {
    this.root = root
    extendObservable(this, {
      count: 0,
      stores: observable.map({}),
      get double () {
        return this.count * 2
      },
      tick: action(async event => {
        await asyncFn()
        this.count++
      }),
      setStore: action((name, Store) => {
        this.stores.set(name, new Store(this))
      })
    })
  }
}
