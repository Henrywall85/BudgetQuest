import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BudgetContainer from './components/BudgetContainer';
import Pay_Period from './components/Pay_Period'; // replaced import
import './App.css'

function App(){
  const [activeSection, setActiveSection] = useState('planner'); // default to planner

  return(
    <div className="app-container">
      <Sidebar onNavigate={setActiveSection} active={activeSection} />
      
      <div className="main-content">
        <Header/>
        {/* render Planner (BudgetContainer) only when selected */}
        {activeSection === 'planner' ? (
          <BudgetContainer />
        ) : activeSection === 'dashboard' ? (
          // Dashboard: show Pay_Period card inside the same Budget-Container background
          <div className="Budget-Container">
            <Pay_Period />
          </div>
        ) : (
          <div className="content">
            {/* simple placeholders for other sections */}
            {activeSection === 'transactions' && <h2>Transactions</h2>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;