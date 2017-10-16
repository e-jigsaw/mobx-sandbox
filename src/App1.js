import React, {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'

export default inject(({store}) => ({store}))(observer(({store}) => {
  console.log(store)
  const onClick = prop => _ => store.change({
    prop,
    len: document.getElementById('len').value,
    value: document.getElementById('val').value
  })
  const onClick1 = _ => store.turn(document.getElementById('val').value)
  const elements = store.elements.map((element, i) => pug`
    g(key='{i}')
      rect(
        transform='{element.transform}'
        x='{element.px}' y='{element.py}' fill='{element.color}'
        width='{element.width}' height='{element.height}'
      )
      line(
        x1='{element.points.x1}' y1='{element.points.y1}'
        x2='{element.points.x2}' y2='{element.points.y2}'
        stroke='#f00' strokeWidth='3'
      )
      line(
        x1='{element.points.x2}' y1='{element.points.y2}'
        x2='{element.points.x3}' y2='{element.points.y3}'
        stroke='#f00' strokeWidth='3'
      )
      line(
        x1='{element.points.x3}' y1='{element.points.y3}'
        x2='{element.points.x4}' y2='{element.points.y4}'
        stroke='#f00' strokeWidth='3'
      )
      line(
        x1='{element.points.x4}' y1='{element.points.y4}'
        x2='{element.points.x1}' y2='{element.points.y1}'
        stroke='#f00' strokeWidth='3'
      )
  `)
  return pug`
    div
      div
        span {store.elements.length}
        input(id='len')
        input(id='val')
        button(onClick="{onClick('x')}") x
        button(onClick="{onClick('y')}") y
        button(onClick="{onClick('width')}") width
        button(onClick="{onClick('height')}") height
        button(onClick="{onClick('rotate')}") rotate
        button(onClick='{onClick1}') turn
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
            x1='{store.boundingBox.xmin}' y1='{store.boundingBox.ymin}'
            x2='{store.boundingBox.xmin}' y2='{store.boundingBox.ymax}'
            stroke='#0f0' strokeWidth='3'
          )
          line(
            x1='{store.boundingBox.xmax}' y1='{store.boundingBox.ymin}'
            x2='{store.boundingBox.xmax}' y2='{store.boundingBox.ymax}'
            stroke='#0f0' strokeWidth='3'
          )
          line(
            x1='{store.boundingBox.xmin}' y1='{store.boundingBox.ymax}'
            x2='{store.boundingBox.xmax}' y2='{store.boundingBox.ymax}'
            stroke='#0f0' strokeWidth='3'
          )
  `
}))
