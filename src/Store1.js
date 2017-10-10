import {observable, action, computed} from 'mobx'

class Box {
  @observable x = 0
  @observable y = 0
  @observable width = 0
  @observable height = 0
}

export class Element extends Box {
  @computed get px () {
    return this.x - (this.width / 2)
  }

  @computed get py () {
    return this.y - (this.height / 2)
  }

  @action change = prop => _ => (
    this[prop] = document.getElementById('input').value
  )
}
