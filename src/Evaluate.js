import React from 'react'
import { ACTION } from './App'
export const Evaluate = ({dispatch , Operator}) => {
   
  return (
    <button className = "span-two" onClick = {() => dispatch({type : ACTION.EVALUATE , payload : {Operator} , overwrite : false  })}>{Operator}</button>
  )
}
