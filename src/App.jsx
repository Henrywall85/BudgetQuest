import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BudgetContainer from './components/BudgetContainer';
import './App.css';

function App(){
  return(
  <div className="app-container">
    <Sidebar />
    
    <div className="main-content">
      <BudgetContainer/>
    </div>
  </div>
  );
}

export default App;