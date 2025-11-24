import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BudgetContainer from './components/BudgetContainer';
import Pay_Period from './components/Pay_Period';
import './App.css'

function App(){
  const [activeSection, setActiveSection] = useState('planner'); // default to planner

  // Persisted income storage key
  const INCOME_KEY = 'budgetquest:incomeData';

  // Load persisted incomeData from localStorage, rehydrate nextDeposit -> Date
  const [incomeData, setIncomeData] = useState(() => {
    try {
      const raw = localStorage.getItem(INCOME_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.map(i => ({
        ...i,
        nextDeposit: i.nextDeposit ? new Date(i.nextDeposit) : null
      }));
    } catch (err) {
      return [];
    }
  });

  // Persist incomeData to localStorage (serialize Date -> ISO)
  useEffect(() => {
    try {
      const serializable = incomeData.map(i => ({
        ...i,
        nextDeposit: i.nextDeposit ? i.nextDeposit.toISOString() : null
      }));
      localStorage.setItem(INCOME_KEY, JSON.stringify(serializable));
    } catch (err) {
      // ignore storage errors
    }
  }, [incomeData]);

  const formatCurrency = (amount) => {
    const n = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n);
  };

  // Called when Income_Form saves a new income entry
  const handleSaveIncome = (data) => {
    // normalize nextDeposit (accept Date or string)
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