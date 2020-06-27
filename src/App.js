import React from "react";
import "./styles.css";
import Input from "./Input/Input";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Input type="text" validationRegex={/^[a-zA-Z]+$/} />
      <Input type="text" validationRegex={/^[1-9][0-9]*$/} />
    </div>
  );
}
