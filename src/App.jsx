import React from 'react';
import Sidebar from './components/Sidebar';
import './App.css';

function App(){
  return(
  <div className="app-container">
    <Sidebar />
    <div className="main-content">
      <h1>Welcome to BudgetQuest</h1>
      <p>Your zero-based budgeting app.</p>
    </div>
  </div>
  );
}

export default App;