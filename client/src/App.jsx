import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';
import UserProvider from './contexts/UserProvider';
import Home from './pages/Home';
import Rate from './pages/Rate';
import NavBar from "./components/NavBar";
import './style/index.css';

function App() {
  return (
     <Router history={history}>
       <UserProvider>
         <Route path='/' component={NavBar}/>
         <Route path='/rate' component={Rate}/>
       </UserProvider>
       <Route path='/' exact component={Home} />
     </Router>
  );
}

export default App;
