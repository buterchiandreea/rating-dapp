import React from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history';
import Home from './pages/Home';
import Rate from './pages/Rate';
import Ratings from './pages/Ratings';
import NavBar from "./components/NavBar";
import './style/index.css';

function App() {
  return (
    <Router history={history}>
      <Route path='/' component={NavBar}/>
      <Route path='/rate' component={Rate}/>
      <Route path='/' exact component={Home} />
      <Route path='/ratings' component={Ratings} />
    </Router>
  );
}

export default App;
