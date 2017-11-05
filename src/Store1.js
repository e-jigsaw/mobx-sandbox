import {types, getSnapshot, applySnapshot} from 'mobx-state-tree'

const rad = Math.PI / 180
const rand = () => Math.round(Math.random() * 255)
const randColor = () => `rgb(${rand()},${rand()},${rand()})`

const Box = types.model({
  a: 100,
  b: 0,
  c: 0,
  d: 100,
  e: 100,
  f: 100,
  color: '#f00'
}).views(self => ({
  get transform () {
    return `matrix(${self.a},${self.b},${self.c},${self.d},${self.e},${self.f})`
  },
  get origin () {
    return {
      x: (0.5 * self.a) + (0.5 * self.c) + self.e,
      y: (0.5 * self.b) + (0.5 * self.d) + self.f
    }
  },
  get corners () {
    return {
      x1: self.e,
      y1: self.f,
      x2: self.a + self.e,
      y2: self.b + self.f,
      x3: self.a + self.c + self.e,
      y3: self.b + self.d + self.f,
      x4: self.c + self.e,
      y4: self.d + self.f,
    }
  },
  get midPoints () {
    return {
      x1: (0.5 * self.a) + self.e,
      y1: (0.5 * self.b) + self.f,
      x2: self.a + (0.5 * self.c) + self.e,
      y2: self.b + (0.5 * self.d) + self.f,
      x3: (0.5 * self.a) + self.c + self.e,
      y3: (0.5 * self.b) + self.d + self.f,
      x4: (0.5 * self.c) + self.e,
      y4: (0.5 * self.d) + self.f
    }
  }
})).actions(self => ({
  translate: (x, y) => {
    self.e += x
    self.f += y
  },
  rotate: (r, x, y) => {
    const sin = Math.sin(r * rad)
    const cos = Math.cos(r * rad)
    self.translate(-x, -y)
    const {a, b, c, d, e, f} = self
    self.a = (a * cos) - (b * sin)
    self.b = (a * sin) + (b * cos)
    self.c = (c * cos) - (d * sin)
    self.d = (c * sin) + (d * cos)
    self.e = (e * cos) - (f * sin)
    self.f = (e * sin) + (f * cos)
    self.translate(x, y)
  },
  equalizeScale: (s, ox, oy) => self.scale(s, s, ox, oy),
  scale: (x, y, ox, oy) => {
    self.translate(-ox, -oy)
    self.a *= x
    self.b *= y
    self.c *= x
    self.d *= y
    self.e *= x
    self.f *= y
    self.translate(ox, oy)
  }
}))

export const Store = types.model({
  elements: types.array(Box),
  undoStack: types.array(types.frozen),
  redoStack: types.array(types.frozen)
}).actions(self => ({
  save: () => {
    self.redoStack.replace([])
    self.undoStack.push(getSnapshot(self.elements))
  },
  add: _ => {
    self.save()
    self.elements.push({
      color: randColor()
    })
  },
  turn: value => {
    self.save()
    const {x, y} = self.boundingBoxOrigin
    self.elements.forEach(element => element.rotate(value, x, y))
  },
  expand: value => {
    self.save()
    const {xmin, ymin} = self.boundingBox
    self.elements.forEach(element => element.equalizeScale(value, xmin, ymin))
  },
  undo: _ => {
    const next = self.undoStack.pop()
    self.redoStack.push(getSnapshot(self.elements))
    applySnapshot(self.elements, next)
  },
  redo: _ => {
    const next = self.redoStack.pop()
    self.undoStack.push(getSnapshot(self.elements))
    applySnapshot(self.elements, next)
  }
})).views(self => ({
  get boundingBox () {
    return self.elements.reduce((prev, element) => {
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
  },
  get boundingBoxOrigin () {
    if (self.boundingBox.xmin === null) return {
      x: 0,
      y: 0
    }
    return {
      x: self.boundingBox.xmax - (
        (self.boundingBox.xmax - self.boundingBox.xmin) / 2
      ),
      y: self.boundingBox.ymax - (
        (self.boundingBox.ymax - self.boundingBox.ymin) / 2
      )
    }
  }
}))
