function App() {
  let message = "Bye there"

  if (Math.random() > 0.5 ) {
    message = "Hello there"
  }
  return (
    <div className="App">
      <div>{message}</div>
    </div>
  );
}

export default App;
