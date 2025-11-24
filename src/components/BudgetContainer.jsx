import React, { useState, useEffect } from 'react';
import NextPayCheck_Card from './NextPayCheck_Card';
import Month_Card from './Month_Card';
import Income_Card from './Income_Card';
import Income_Form from './Income_Form';
import './BudgetContainer.css'

function BudgetContainer ({title, incomeData = [], onSaveIncome = () => {}, formatCurrency = (n)=>n}){
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  // Get current month and year
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const PLAN_KEY = 'budgetquest:planMonth';
  const currentMonthKey = `${month}-${year}`;

  // planCreated is determined from localStorage (persist across reloads)
  const [planCreated, setPlanCreated] = useState(() => {
    try {
      const stored = localStorage.getItem(PLAN_KEY);
      return stored === currentMonthKey;
    } catch (err) {
      return false;
    }
  });

  // If incomeData exists for this session and plan not marked yet, mark plan started
  useEffect(() => {
    if (incomeData && incomeData.length > 0) {
      try {
        localStorage.setItem(PLAN_KEY, currentMonthKey);
      } catch (err) {}
      setPlanCreated(true);
    }
  }, [incomeData, currentMonthKey]);

  // Calculate total income from shared incomeData prop
  const totalIncome = incomeData.reduce((sum, income) => 
    sum + parseFloat(income.amount || 0), 0
  );

  const handleCreatePlan = () => {
    try {
      localStorage.setItem(PLAN_KEY, currentMonthKey);
    } catch (err) {}
    setPlanCreated(true);
  }

  return(
    <div className="Budget-Container">
      {!planCreated && (
        <Month_Card title={title} onCreatePlan={handleCreatePlan} />
      )}
      {planCreated && (
        <>
          <div id="remaining-budget">
            <h2>{month}, {year}</h2>
            <linebreak/>
            <h1>${formatCurrency(totalIncome)}</h1>
            <p>Left To Budget</p>
            <linebreak/>
          </div>
          <Income_Card 
            title={title} 
            onAddIncome={() => setShowIncomeForm(true)}
            incomeData={incomeData}
            totalIncome={formatCurrency(totalIncome)}
            formatCurrency={formatCurrency}
          />
          {showIncomeForm && (
            <div className="modal-overlay">
              <Income_Form 
                title={title} 
                onClose={() => setShowIncomeForm(false)}
                onSave={(data) => {
                  // normalize and forward save
                  onSaveIncome(data);
                  try {
                    localStorage.setItem(PLAN_KEY, currentMonthKey);
                  } catch (err) {}
                  setShowIncomeForm(false);
                  setPlanCreated(true);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BudgetContainer;