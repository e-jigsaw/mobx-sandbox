import {observable, action, computed} from 'mobx'

const rad = Math.PI / 180
const degreeRound = deg => {
  switch (true) {
    case deg < 0: return 360 + deg
    case deg > 360: return deg - 360
    default: return deg
  }
}
const rand = () => Math.round(Math.random() * 255)
const randColor = () => `rgb(${rand()},${rand()},${rand()})`

class Box {
  @observable a = 100
  @observable b = 0
  @observable c = 0
  @observable d = 100
  @observable e = 100
  @observable f = 100
}

class Element extends Box {
  constructor (color) {
    super()
    this.color = color
  }

  @computed get transform () {
    return `matrix(${this.a},${this.b},${this.c},${this.d},${this.e},${this.f})`
  }

  @computed get origins () {
    return {
      x: (0.5 * this.a) + (0.5 * this.c) + this.e,
      y: (0.5 * this.b) + (0.5 * this.d) + this.f
    }
  }

  @computed get corners () {
    return {
      x1: this.e,
      y1: this.f,
      x2: this.a + this.e,
      y2: this.b + this.f,
      x3: this.a + this.c + this.e,
      y3: this.b + this.d + this.f,
      x4: this.c + this.e,
      y4: this.d + this.f,
    }
  }

  @action translate = (x, y) => {
    this.e += x
    this.f += y
  }

  @action rotate = (r, x, y) => {
    const sin = Math.sin(r * rad)
    const cos = Math.cos(r * rad)
    this.translate(-x, -y)
    const {a, b, c, d, e, f} = this
    this.a = (a * cos) - (b * sin)
    this.b = (a * sin) + (b * cos)
    this.c = (c * cos) - (d * sin)
    this.d = (c * sin) + (d * cos)
    this.e = (e * cos) - (f * sin)
    this.f = (e * sin) + (f * cos)
    this.translate(x, y)
  }

  @action scale = (s, ox, oy) => {
    this.translate(-ox, -oy)
    this.a *= s
    this.b *= s
    this.c *= s
    this.d *= s
    this.e *= s
    this.f *= s
    this.translate(ox, oy)
  }
}

export default class Store {
  @observable elements = observable.array()

  @action add = _ => this.elements.push(new Element(randColor()))
  @action turn = value => {
    const {x, y} = this.boundingBoxOrigin
    this.elements.forEach(element => element.rotate(value, x, y))
  }
  @action expand = value => {
    const {xmin, ymin} = this.boundingBox
    this.elements.forEach(element => element.scale(value, xmin, ymin))
  }

  @computed get boundingBox () {
    return this.elements.reduce((prev, element) => {
      if (prev.xmin === null) {
        prev.xmin = element.corners.x1
        prev.ymin = element.corners.y1
        prev.xmax = element.corners.x1
        prev.ymax = element.corners.y1
      }
      [1, 2, 3, 4].forEach(n => {
        const xc = element.corners[`x${n}`]
        const yc = element.corners[`y${n}`]
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

  @computed get boundingBoxOrigin () {
    if (this.boundingBox.xmin === null) return {
      x: 0,
      y: 0
    }
    return {
      x: this.boundingBox.xmax - (
        (this.boundingBox.xmax - this.boundingBox.xmin) / 2
      ),
      y: this.boundingBox.ymax - (
        (this.boundingBox.ymax - this.boundingBox.ymin) / 2
      )
    }
  }
}
