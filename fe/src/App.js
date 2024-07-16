import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Mailbox from "./Components/Mailbox";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/mailbox" element={<Mailbox />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
