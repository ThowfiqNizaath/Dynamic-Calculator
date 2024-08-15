import React from 'react'
import { ACTION } from './App'
export const Operator = ({dispatch , Operator}) => {
 return (
   <button
     onClick={() => dispatch({ type: ACTION.OPERATOR, payload: { Operator } })}
   >
     {Operator}
   </button>
 );
}
