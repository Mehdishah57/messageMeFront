import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LogReg from "./components/LogReg";
import Dashboard from "./components/Dashboard";
import "../node_modules/font-awesome/css/font-awesome.min.css";

function App() {
  return (
    <>
    <Switch>
      <Route path="/login" component={LogReg} />
      <Route path="/dashboard" component={Dashboard} />
      <Redirect from="/" to="/login" />
    </Switch>
    </>
  );
}

export default App;
