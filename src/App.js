import './App.css';
import { useReducer } from 'react';
import { DigitButton } from './DigitButton';
import { Operator } from './Operator';
import { Evaluate } from './Evaluate';

export const ACTION = {
   ADD_DIGIT : 'add-digit',
   OPERATOR : 'operator',
   DELETE_DIGIT : 'delete-digit',
   CLEAR_ALL : 'clear-all',
  EVALUATE : 'evaluate'
}

function reduce(state, {type , payload , overwrite}){
  switch(type){
  case ACTION.ADD_DIGIT:
    if(state.overwrite === undefined || state.overwrite && !state.posible || state.posible === undefined){
       if(state.currentOperation){
         if (payload.digit == "." && state.currentOperation.includes(".")) {
           return state;
         }
       }
       if(state.previousOperation && (state.oparator == null || state.oparator == "" ) && (state.currentOperation == "" || state.currentOperation == null)
       ){
        return{
          ...state,
          previousOperation: `${state.previousOperation||""}${payload.digit}`
        }
       }
       if(state.currentOperation === "0" && payload.digit === 0){
        return state
       } 
      if(state.previousOperation && state.oparator == null || state.oparator == ""){
        console.log("previous operation")
        return state
      }
      return {...state, currentOperation : `${state.currentOperation || ""}${payload.digit}` , posible : false}
    }


  if(state.posible && !state.overwrite){
     if(state.replace){
      if(state.currentOperation.includes(".") && payload.digit === "."){
        return state
      }
      if(state.currentOperation === "0" && payload.digit === 0){
        return state
      }
       return{
        ...state ,
        currentOperation : `${state.currentOperation || ""}${payload.digit}`
       }
     }
     return{
      ...state,
      currentOperation : `${payload.digit}`,
      replace : true
     }
    }
  return state

    case ACTION.OPERATOR:
       if(state.currentOperation && (state.previousOperation == "" || state.previousOperation == undefined)){

        if(state.currentOperation == "."){
          return state
        }
          return {...state , previousOperation : state.currentOperation , currentOperation : "" , oparator : payload.Operator , overwrite : true , posible : false}
       }
     
       if(state.previousOperation && state.oparator && state.currentOperation== null){
        return state
       }

       if(state.previousOperation && state.oparator == null ||state.oparator == ""){
        return{
          ...state , 
          oparator : payload.Operator,
          currentOperation : ""
        }
       }

       if(state.currentOperation && state.previousOperation && state.oparator){
         return {
           ...state,
           previousOperation: `${evaluate(
             state.currentOperation,
             state.previousOperation,
             state.oparator
           )}`,
           currentOperation: "",
           oparator: payload.Operator,
           evaluatedValue: `${evaluate(
             state.currentOperation,
             state.previousOperation,
             state.oparator
           )}`,
         };
     }
     return state

     case ACTION.DELETE_DIGIT :
      
     if(state.overwrite == undefined || state.overwrite){
       if(state.currentOperation && (state.previousOperation == "" || state.previousOperation == null)){
         return {
           ...state,
           currentOperation: removeDigits(state.currentOperation),
         }
       }

       if(state.previousOperation && state.evaluatedValue && (state.oparator == null || state.oparator == "") && state.previousOperation.includes(state.evaluatedValue)){
        return{
          ...state,
          previousOperation: "",
          evaluatedValue : 0
        }
       }

       if(state.currentOperation && state.previousOperation && state.oparator){
         return {
           ...state,
           currentOperation: removeDigits(state.currentOperation),
         };
       }

       if(state.currentOperation == "" && state.previousOperation && state.oparator){
        return {
          ...state,
          oparator : null
        }
       }

       if(state.currentOperation == "" && state.oparator == null && state.previousOperation){
           return{
            ...state,
            previousOperation : removeDigits(state.previousOperation) 
           }
       }
     }
   return state

     case ACTION.EVALUATE:
      if(state.currentOperation && state.previousOperation && state.oparator){
         return {
           currentOperation: `${evaluate(
             state.currentOperation,
             state.previousOperation,
             state.oparator
           )}`,
           previousOperation: null,
           oparator: null,
           overwrite: overwrite,
           posible: true,
           evaluatedValue :`${evaluate(
             state.currentOperation,
             state.previousOperation,
             state.oparator
           )}`,
         };
      }
       return state;
    
    case ACTION.CLEAR_ALL:
      return {}
}
}

function removeDigits(oparant){
  if(oparant.trim){
      return oparant.slice(0 , length - 1)
  }
  return oparant
}

function evaluate(currentOperation, previousOperation, oparator){
    const previous = parseFloat(previousOperation)
    const current = parseFloat(currentOperation)
    var finalCalculation = 0
    if(isNaN(previous) || isNaN(current)){
      return ""
    }
    switch(oparator){
      case "÷" :
        finalCalculation = previous / current
        break
      case "*":
        finalCalculation = previous * current
        break
      case "-":
        finalCalculation = previous - current
        break
      case "+":
        finalCalculation = previous + current
        break
    }
    return finalCalculation
}

function App() {
  const [{currentOperation , previousOperation , oparator , overwrite , posible , replace , evaluatedValue} ,dispatch] = useReducer(reduce , {});


  function formatted(string){
    return string.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operation">{formatted(previousOperation || "")} {oparator}</div>
        <div className="current-operation">{formatted(currentOperation||"")}</div>
      </div>
      <button onClick = {() => dispatch({type : ACTION.CLEAR_ALL})} className="span-two">AC</button>
      <button onClick = {() => dispatch({type : ACTION.DELETE_DIGIT})}>DEL</button>
      <Operator dispatch={dispatch} Operator={"÷"}></Operator>
      <DigitButton dispatch={dispatch} digit={1}></DigitButton>
      <DigitButton dispatch={dispatch} digit={2}></DigitButton>
      <DigitButton dispatch={dispatch} digit={3}></DigitButton>
      <Operator dispatch={dispatch} Operator={"*"}></Operator>
      <DigitButton dispatch={dispatch} digit={4}></DigitButton>
      <DigitButton dispatch={dispatch} digit={5}></DigitButton>
      <DigitButton dispatch={dispatch} digit={6}></DigitButton>
      <Operator dispatch={dispatch} Operator={"-"}></Operator>
      <DigitButton dispatch={dispatch} digit={7}></DigitButton>
      <DigitButton dispatch={dispatch} digit={8}></DigitButton>
      <DigitButton dispatch={dispatch} digit={9}></DigitButton>
      <Operator dispatch={dispatch} Operator={"+"}></Operator>
      <DigitButton dispatch={dispatch} digit={"."}></DigitButton>
      <DigitButton dispatch={dispatch} digit={0}></DigitButton>
      <Evaluate dispatch={dispatch} Operator={"="} />
    </div>
  );
}

export default App;
