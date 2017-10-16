import {observable, action, computed} from 'mobx'

const rad = Math.PI / 180
const degreeRound = deg => {
  switch (true) {
    case deg < 0: return 360 + deg
    case deg > 360: return deg - 360
    default: return deg
  }
}

class Box {
  @observable x = 100
  @observable y = 100
  @observable width = 100
  @observable height = 100
  @observable rotate = 0
}

class Element extends Box {
  constructor (color) {
    super()
    this.color = color
  }

  @computed get px () {
    return this.x - (this.width / 2)
  }

  @computed get py () {
    return this.y - (this.height / 2)
  }

  @computed get r () {
    return Math.sqrt(Math.pow((this.width / 2), 2) + Math.pow((this.height / 2), 2))
  }

  @computed get points () {
    const r1 = degreeRound(
      Math.atan2(this.py - this.y, this.px - this.x) / rad
    )
    const r2 = degreeRound(
      Math.atan2((this.py + this.height) - this.y, this.px - this.x) / rad
    )
    const r3 = degreeRound(
      Math.atan2((this.py + this.height) - this.y, (this.px + this.width) - this.x) / rad
    )
    const r4 = degreeRound(
      Math.atan2(this.py - this.y, (this.px + this.width) - this.x) / rad
    )
    return {
      x1: this.r * Math.cos((r1 + this.rotate) * rad) + this.x,
      y1: this.r * Math.sin((r1 + this.rotate) * rad) + this.y,
      x2: this.r * Math.cos((r2 + this.rotate) * rad) + this.x,
      y2: this.r * Math.sin((r2 + this.rotate) * rad) + this.y,
      x3: this.r * Math.cos((r3 + this.rotate) * rad) + this.x,
      y3: this.r * Math.sin((r3 + this.rotate) * rad) + this.y,
      x4: this.r * Math.cos((r4 + this.rotate) * rad) + this.x,
      y4: this.r * Math.sin((r4 + this.rotate) * rad) + this.y,
    }
  }

  @computed get transform () {
    return `rotate(${this.rotate} ${this.x} ${this.y})`
  }

  @action change = (prop, value) => {
    const candidate = parseFloat(value)
    this[prop] = prop === 'rotate' ? degreeRound(candidate) : candidate
  }
}

const rand = () => Math.round(Math.random() * 255)

const randColor = () => `rgb(${rand()},${rand()},${rand()})`

export default class Store {
  @observable elements = observable.array()

  @action add = _ => this.elements.push(new Element(randColor()))
  @action change = ({len, prop, value}) => this.elements[len].change(prop, value)
  @action turn = value => {
    this.elements.forEach(element => element.change('rotate', element.rotate + parseFloat(value)))
  }

  @computed get boundingBox () {
    return this.elements.reduce((prev, element) => {
      if (prev.xmin === null) {
        prev.xmin = element.points.x1
        prev.ymin = element.points.y1
        prev.xmax = element.points.x1
        prev.ymax = element.points.y1
      }
      [1, 2, 3, 4].forEach(n => {
        const xc = element.points[`x${n}`]
        const yc = element.points[`y${n}`]
        if (xc < prev.xmin) prev.xmin = xc
        if (xc > prev.xmax) prev.xmax = xc
        if (yc < prev.ymin) prev.ymin = yc
        if (yc > prev.ymax) prev.ymax = yc
      })
      return prev
    }, {
      xmin: null,
      ymin: null,
      xmax: null,
      ymax: null
    })
  }
}
