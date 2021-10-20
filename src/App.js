import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import NewLogin from './components/NewLogin';
import NewSignup from './components/NewSignup';

function App() {
  return (
    <>
    <Switch>
      <Route path="/login" component={NewLogin} />
      <Route path="/signup" component={NewSignup} />
      <Route path="/dashboard" component={Dashboard} />
      <Redirect from="/" to="/login" />
    </Switch>
    </>
  );
}

export default App;
