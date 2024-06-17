function App() {
  const random = Math.random();
  return (
    <div>
      {0 && (<div>No Display</div>)}
      {random >= 0.5 && <div>{random} is greater than or equal to 1/2</div>}
      {(() => {
        if (random >= 0.5) {
          return <div> {random} is greater than or equal to 1/2</div>;
        } else {
          return <div> {random} is less than 1/2 </div>;
        }
      })()}
      {random >= 0.5 ? (
        <div> {random} is greater than or equal to 1/2</div>
      ) : (
        <div> {random} is less than 1/2 </div>
      )}

      {(() => {
        const value = Math.floor(random * 4)
        switch (value) {
          case 0:
            return <div>{`0 <= ${random} < 0.25`}</div>;
          case  1:
            return <div>{`0.25 <= ${random} < 0.5`}</div>;
          case 2:
            return <div>{`0.5 <= ${random} < 0.75`}</div>;
          case 3:
            return <div>{`0.75 <= ${random} < 1`}</div>;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default App;
