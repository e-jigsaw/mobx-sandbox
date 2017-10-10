import React, {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'

export default inject(({element}) => ({element}))(observer(({element}) => {
  console.log(element)
  return pug`
    div
      input(id='input')
      button(onClick="{element.change('x')}") x
      button(onClick="{element.change('y')}") y
      button(onClick="{element.change('width')}") width
      button(onClick="{element.change('height')}") height
      div {element.x}
      div {element.y}
      div {element.width}
      div {element.height}
      div {element.px}
      div {element.py}
  `
}))
