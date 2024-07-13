import { useState } from "react";

const initializeState = () => {
  const expensivelyProcessedList: number[] = [];
  for (let i = 0; i < 10000; i++) {
    expensivelyProcessedList.push(i);
    expensivelyProcessedList.sort();
    expensivelyProcessedList.reverse();
  }
  console.log("非最適化コンポーネントでinitializeState が呼び出されました");
  return [1, 2, 3];
};

export const NonOptimizedList = () => {
  const [state] = useState(initializeState());
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
