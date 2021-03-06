import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'

export default inject(({store}) => ({store}))(observer(({store}) => {
  console.log(store)
  const translate = _ => {
    const len = parseInt(document.getElementById('len').value)
    const [x, y] = document.getElementById('val').value.split(',')
    store.elements[len].translate(parseFloat(x), parseFloat(y))
  }
  const rotate = _ => {
    const len = parseInt(document.getElementById('len').value)
    const r = parseFloat(document.getElementById('val').value)
    const element = store.elements[len]
    element.rotate(r, element.origin.x, element.origin.y)
  }
  const scale = _ => {
    const len = parseInt(document.getElementById('len').value)
    const element = store.elements[len]
    const [x, y] = document.getElementById('val').value.split(',')
    if (y === undefined) {
      element.equalizeScale(parseFloat(x), element.corners.x3, element.corners.y3)
    } else {
      element.scale(
        parseFloat(x), parseFloat(y), element.midPoints.x1, element.midPoints.y1
      )
    }
  }
  const turn = _ => store.turn(parseFloat(document.getElementById('val').value))
  const expand = _ => store.expand(parseFloat(document.getElementById('val').value))
  const elements = store.elements.map((element, i) => pug`
    g(key='{i}')
      rect(
        fill='{element.color}' transform='{element.transform}'
        width='1' height='1'
      )
      circle(
        r='3' cx='{element.origin.x}' cy='{element.origin.y}' fill='#f00'
      )
      line(
        x1='{element.corners.x1}' y1='{element.corners.y1}'
        x2='{element.corners.x2}' y2='{element.corners.y2}'
        stroke='#f00' strokeWidth='3'
      )
      line(
        x1='{element.corners.x2}' y1='{element.corners.y2}'
        x2='{element.corners.x3}' y2='{element.corners.y3}'
        stroke='#f00' strokeWidth='3'
      )
      line(
        x1='{element.corners.x3}' y1='{element.corners.y3}'
        x2='{element.corners.x4}' y2='{element.corners.y4}'
        stroke='#f00' strokeWidth='3'
      )
      line(
        x1='{element.corners.x4}' y1='{element.corners.y4}'
        x2='{element.corners.x1}' y2='{element.corners.y1}'
        stroke='#f00' strokeWidth='3'
      )
      circle(
        fill='#00f'
        r='3' cx='{element.midPoints.x1}' cy='{element.midPoints.y1}'
      )
      circle(
        fill='#00f'
        r='3' cx='{element.midPoints.x2}' cy='{element.midPoints.y2}'
      )
      circle(
        fill='#00f'
        r='3' cx='{element.midPoints.x3}' cy='{element.midPoints.y3}'
      )
      circle(
        fill='#00f'
        r='3' cx='{element.midPoints.x4}' cy='{element.midPoints.y4}'
      )
  `)
  return pug`
    div
      div
        span {store.elements.length}
        input(id='len')
        input(id='val')
        button(onClick='{translate}') translate
        button(onClick='{rotate}') rotate
        button(onClick='{scale}') scale
        button(onClick='{turn}') turn
        button(onClick='{expand}') expand
        button(onClick='{store.undo}') undo
        button(onClick='{store.redo}') redo
      div
        button(onClick='{store.add}') add
      svg(width='100%' height='100%')
        g {elements}
        g
          line(
            x1='{store.boundingBox.xmin}' y1='{store.boundingBox.ymin}'
            x2='{store.boundingBox.xmax}' y2='{store.boundingBox.ymin}'
            stroke='#0f0' strokeWidth='3'
          )
          line(
            x1='{store.boundingBox.xmax}' y1='{store.boundingBox.ymin}'
            x2='{store.boundingBox.xmax}' y2='{store.boundingBox.ymax}'
            stroke='#0f0' strokeWidth='3'
          )
          line(
            x1='{store.boundingBox.xmax}' y1='{store.boundingBox.ymax}'
            x2='{store.boundingBox.xmin}' y2='{store.boundingBox.ymax}'
            stroke='#0f0' strokeWidth='3'
          )
          line(
            x1='{store.boundingBox.xmin}' y1='{store.boundingBox.ymax}'
            x2='{store.boundingBox.xmin}' y2='{store.boundingBox.ymin}'
            stroke='#0f0' strokeWidth='3'
          )
          circle(
            r='3' fill='#0f0'
            cx='{store.boundingBoxOrigin.x}' cy='{store.boundingBoxOrigin.y}'
          )
  `
}))
