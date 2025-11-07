import React, { useState } from 'react';
import NextPayCheck_Card from './NextPayCheck_Card';
import Month_Card from './Month_Card';
import Income_Card from './Income_Card';
import Income_Form from './Income_Form';
import './BudgetContainer.css'

function BudgetContainer ({title}){
  const [planCreated, setPlanCreated] = React.useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [incomeData, setIncomeData] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleSaveIncome = (data) => {
    setIncomeData(prevData => [...prevData, data]);
    setShowIncomeForm(false);
  };

  // Get current month and year
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Calculate total income
  const totalIncome = incomeData.reduce((sum, income) => 
    sum + parseFloat(income.amount || 0), 0
  );

  return(
    <div className="Budget-Container">
      {!planCreated && (
        <Month_Card title={title} onCreatePlan={() => setPlanCreated(true)} />
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
                onSave={handleSaveIncome}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BudgetContainer;