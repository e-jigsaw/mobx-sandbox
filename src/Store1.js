import {observable, action, computed} from 'mobx'

const rad = Math.PI / 180
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
  @observable v1 = 0
  @observable v2 = 0
  @observable v3 = 0
  @observable v4 = 0
  @observable nearestLine = 1

  constructor (color) {
    super()
    this.color = color
  }

  @computed get transform () {
    return `matrix(${this.a},${this.b},${this.c},${this.d},${this.e},${this.f})`
  }

  @computed get origin () {
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

  @computed get midPoints () {
    return {
      x1: (0.5 * this.a) + this.e,
      y1: (0.5 * this.b) + this.f,
      x2: this.a + (0.5 * this.c) + this.e,
      y2: this.b + (0.5 * this.d) + this.f,
      x3: (0.5 * this.a) + this.c + this.e,
      y3: (0.5 * this.b) + this.d + this.f,
      x4: (0.5 * this.c) + this.e,
      y4: (0.5 * this.d) + this.f
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

  @action equalizeScale = (s, ox, oy) => this.scale(s, s, ox, oy)

  @action scale = (x, y, ox, oy) => {
    this.translate(-ox, -oy)
    this.a *= x
    this.b *= y
    this.c *= x
    this.d *= y
    this.e *= x
    this.f *= y
    this.translate(ox, oy)
  }

  _area = (p1, p2, p3) => {
    return Math.abs(
      (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2
    )
  }

  @action verticalLines = (po) => {
    const {x1, x2, x3, x4, y1, y2, y3, y4} = this.corners
    const p1 = {x: x1, y: y1}
    const p2 = {x: x2, y: y2}
    const p3 = {x: x3, y: y3}
    const p4 = {x: x4, y: y4}
    const s1 = this._area(po, p1, p2)
    const s2 = this._area(po, p2, p3)
    const s3 = this._area(po, p3, p4)
    const s4 = this._area(po, p4, p1)
    if (s1 === 0) {
      this.nearestLine = 1
    } else if (s2 === 0) {
      this.nearestLine = 2
    } else if (s3 === 0) {
      this.nearestLine = 3
    } else if (s4 === 0) {
      this.nearestLine = 4
    } else {
      const candidate = [
        [(2 * s1) / Math.sqrt(
          Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2)
        ), 1],
        [(2 * s2) / Math.sqrt(
          Math.pow((p3.x - p2.x), 2) + Math.pow((p3.y - p2.y), 2)
        ), 2],
        [(2 * s3) / Math.sqrt(
          Math.pow((p4.x - p3.x), 2) + Math.pow((p4.y - p3.y), 2)
        ), 3],
        [(2 * s4) / Math.sqrt(
          Math.pow((p1.x - p4.x), 2) + Math.pow((p1.y - p4.y), 2)
        ), 4]
      ].sort((x, y) => x[0] - y[0])
      this.nearestLine = candidate[0][1]
    }
  }
}

export default class Store {
  @observable elements = observable.array()
  @observable point = {
    x: 0, y: 0
  }

  @action add = _ => this.elements.push(new Element(randColor()))
  @action turn = value => {
    const {x, y} = this.boundingBoxOrigin
    this.elements.forEach(element => element.rotate(value, x, y))
  }
  @action expand = value => {
    const {xmin, ymin} = this.boundingBox
    this.elements.forEach(element => element.equalizeScale(value, xmin, ymin))
  }
  @action onMove = event => {
    const svg = document.getElementById('svg')
    const boundingBox = svg.getBoundingClientRect()
    const ctm = svg.getScreenCTM()
    const point = svg.createSVGPoint()
    point.x = event.clientX - boundingBox.left
    point.y = event.clientY - boundingBox.top
    point.matrixTransform(ctm.inverse())
    this.point = point
    this.elements.forEach(element => element.verticalLines(point))
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
