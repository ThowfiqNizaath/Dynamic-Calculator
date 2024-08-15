import { ACTION } from './App'

export const DigitButton = ({dispatch , digit}) => {
  return (
    <button onClick = {()=> dispatch({type : ACTION.ADD_DIGIT , payload : {digit}})}>{digit}</button>
  )
}
