import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LogReg from './components/LogReg';
import Dashboard from './components/Dashboard';
import { UserContext } from './UserContext';
import '../node_modules/font-awesome/css/font-awesome.min.css';


function App() {
  return (
    <UserContext.Provider value={localStorage.getItem('JWT_messageME')}>
      <Switch>
        <Route path='/login' component={LogReg} />
        <Route path='/dashboard' component={Dashboard} />
        <Redirect from='/' to='/login' />
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
