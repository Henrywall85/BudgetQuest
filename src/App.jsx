import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BudgetContainer from './components/BudgetContainer';
import Pay_Period from './components/Pay_Period';
import './App.css'

function App(){
  const [activeSection, setActiveSection] = useState('planner'); // default to planner

  // Lifted shared income state so Dashboard and Planner share same data
  const [incomeData, setIncomeData] = useState([]);

  const formatCurrency = (amount) => {
    const n = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  };

  const handleSaveIncome = (data) => {
    // ensure nextDeposit is a Date object
    const normalized = {
      ...data,
      nextDeposit: data.nextDeposit ? new Date(data.nextDeposit) : null,
    };
    setIncomeData(prev => [...prev, normalized]);
  };

  return(
    <div className="app-container">
      <Sidebar onNavigate={setActiveSection} active={activeSection} />
      
      <div className="main-content">
        <Header/>
        {/* render Planner (BudgetContainer) only when selected */}
        {activeSection === 'planner' ? (
          <BudgetContainer 
            incomeData={incomeData} 
            onSaveIncome={handleSaveIncome}
            formatCurrency={formatCurrency}
          />
        ) : activeSection === 'dashboard' ? (
          // Dashboard: show Pay_Period card inside the same Budget-Container background
          <div className="Budget-Container">
            <Pay_Period 
              incomeData={incomeData} 
              formatCurrency={formatCurrency}
            />
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