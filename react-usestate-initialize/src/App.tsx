import "./App.css";
import { NonOptimizedList } from "../src/components/NonOptimized";
import { useState } from "react";
import { OptimizedList } from "./components/Optimized";

function App() {
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  return (
    <>
      <button onClick={() => setIsOptimized(!isOptimized)}>
        {isOptimized ? "Optimized" : "NonOptimized"}
      </button>
      {isOptimized ? <OptimizedList /> : <NonOptimizedList />}
    </>
  );
}

export default App;
