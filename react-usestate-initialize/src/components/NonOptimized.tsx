import { useState } from "react";

const initializeState = () => {
  const initialState: number[] = [];
  for (let i = 0; i < 10000; i++) {
    initialState.push(i);
    initialState.sort();
    initialState.reverse();
  }
  console.log("非最適化コンポーネントでinitializeState が呼び出されました");
  return [];
};

export const NonOptimizedList = () => {
  const [state, ] = useState(initializeState());
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
      <li>
        {state.map((element) => {
          return <ul key={element}>{element}</ul>;
        })}
      </li>
    </>
  );
};
