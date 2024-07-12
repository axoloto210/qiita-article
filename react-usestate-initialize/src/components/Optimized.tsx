import { useState } from "react";

const initializeState = () => {
  const initialState: number[] = [];
  for (let i = 0; i < 10000; i++) {
    initialState.push(i);
    initialState.sort();
    initialState.reverse();
  }
  console.log("最適化コンポーネントでinitializeState が呼び出されました");
  return [3, 2, 1];
};

export const OptimizedList = () => {
  const [state] = useState(initializeState);
  const [lang, setLang] = useState<"en" | "ja">("ja");

  return (
    <>
      <button
        onClick={() => {
          setLang((prevLang) => {
            return prevLang === "ja" ? "en" : "ja";
          });
        }}
      >
        {lang}
      </button>
      <ul>
        {state.map((element) => {
          return <li key={element}>{element}</li>;
        })}
      </ul>
    </>
  );
};
