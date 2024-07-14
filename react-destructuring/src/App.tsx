import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");

  return (
    <>
      <input
        type="text"
        value={name}
        onChange={({ target: { value } }) => setName(value)}
      />
      <p>Name: {name}</p>
    </>
  );
}

export default App;
