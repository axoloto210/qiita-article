import { useState } from "react";

function App() {
  const [state, setState] = useState([1, 2, 3]);

  const clickHandler = () => {
    state.push(4);
    setState(state);
  };

  const [triger, setTriger] = useState(true);

  return (
    <div>
      <div>{`${state}`}</div>
      <button onClick={clickHandler}>add 4</button>
      <button
        onClick={() => {
          setTriger(!triger);
        }}
      >
        render
      </button>
    </div>
  );
}

export default App;
