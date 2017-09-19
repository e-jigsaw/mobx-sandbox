import {observable, action, computed} from 'mobx'

const asyncFn = () => new Promise(resolve => {
  setTimeout(resolve, 1000)
})

export default class Store {
  constructor (root = null) {
    this.root = root
  }

  @observable count = 0
  @computed get double () {
    return this.count * 2
  }
  @action tick = async event => {
    await asyncFn()
    this.count++
  }

  @observable stores = observable.map()
  @action setStore = (name, Store) => this.stores.set(name, new Store(this))
}
