import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from './Loader';
import Error from './Error';
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  questions: [],
  // loading, ready, error, active, finished
  status: 'loading',
  index: 0,
  answer: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' }
    case 'dataFailed':
      return { ...state, status: "error" };
    case 'start':
      return { ...state, status: 'active' };
    case 'newAnswer':
      const question = state.questions.at(state.index);

      return { 
        ...state, 
        answer: action.payload,
        points: action.payload === question.correctoption ? state.points + question.points : state.points
      };
    default: return new Error("Error");
  }
}

export default function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;

  useEffect(function () {
    fetch("http://localhost:3002/questions")
      .then(res => res.json())
      .then(data => dispatch({
        type: "dataReceived",
        payload: data
      }))
      .catch(err => console.log(err));
  }, [])
  return (
    <div className="app" >
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && <Question answer={answer} dispatch={dispatch} question={questions[index]} />}
      </Main>
    </div>
  )
}