import React, { useState } from 'react';
import NextPayCheck_Card from './NextPayCheck_Card';
import Month_Card from './Month_Card';
import Income_Card from './Income_Card';
import Income_Form from './Income_Form';
import './BudgetContainer.css'

function BudgetContainer ({title}){
  const [planCreated, setPlanCreated] = React.useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  // Get current month and year
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

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
            <h1>$0.00</h1>
            <p>Left To Budget</p>
            <linebreak/>
          </div>
          <Income_Card title={title} onAddIncome={() => setShowIncomeForm(true)}/>
          {showIncomeForm && (
            <div className="modal-overlay">
              <Income_Form title={title} onClose={() => setShowIncomeForm(false)}/>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BudgetContainer;