import React, { useState, useEffect } from 'react';
import NextPayCheck_Card from './NextPayCheck_Card';
import Month_Card from './Month_Card';
import Income_Card from './Income_Card';
import Expense_Card from './Expense_Card';
import Income_Form from './Income_Form';
import Add_Expense from './Add_Expense';
import './BudgetContainer.css'

function BudgetContainer ({title, incomeData = [], onSaveIncome = () => {}, onUpdateIncome = () => {}, onDeleteIncome = () => {}, formatCurrency = (n)=>n}){
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Track editing state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);

  // Expense data management
  const EXPENSE_KEY = 'budgetquest:expenseData';
  const [expenseData, setExpenseData] = useState(() => {
    try {
      const raw = localStorage.getItem(EXPENSE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });

  // Persist expenses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenseData));
    } catch (err) {
      // ignore storage errors
    }
  }, [expenseData]);

  // Get current month and year
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const PLAN_KEY = 'budgetquest:planMonth';
  const currentMonthKey = `${month}-${year}`;

  const [planCreated, setPlanCreated] = useState(() => {
    try {
      const stored = localStorage.getItem(PLAN_KEY);
      return stored === currentMonthKey;
    } catch (err) {
      return false;
    }
  });

  useEffect(() => {
    if (incomeData && incomeData.length > 0) {
      try {
        localStorage.setItem(PLAN_KEY, currentMonthKey);
      } catch (err) {}
      setPlanCreated(true);
    }
  }, [incomeData, currentMonthKey]);

  const totalIncome = incomeData.reduce((sum, income) => 
    sum + parseFloat(income.amount || 0), 0
  );

  const totalExpenses = expenseData.reduce((sum, expense) => 
    sum + parseFloat(expense.amount || 0), 0
  );

  const handleCreatePlan = () => {
    try {
      localStorage.setItem(PLAN_KEY, currentMonthKey);
    } catch (err) {}
    setPlanCreated(true);
  }

  const handleAddIncome = () => {
    setEditingIndex(null);
    setEditingData(null);
    setShowIncomeForm(true);
  };

  const handleEditIncome = (index) => {
    setEditingIndex(index);
    setEditingData(incomeData[index] ? { ...incomeData[index] } : null);
    setShowIncomeForm(true);
  };

  const handleAddExpense = () => {
    setEditingIndex(null);
    setEditingData(null);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (index) => {
    setEditingIndex(index);
    setEditingData(expenseData[index] ? { ...expenseData[index] } : null);
    setShowExpenseForm(true);
  };

  const handleSaveExpense = (data) => {
    setExpenseData(prev => [...prev, data]);
  };

  const handleUpdateExpense = (index, data) => {
    setExpenseData(prev => prev.map((item, i) => (i === index ? { ...item, ...data } : item)));
  };

  const handleDeleteExpense = (index) => {
    setExpenseData(prev => prev.filter((_, i) => i !== index));
  };

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
            <h1>${formatCurrency(totalIncome - totalExpenses)}</h1>
            <p>Left To Budget</p>
            <linebreak/>
          </div>
          <Income_Card 
            title={title} 
            onAddIncome={handleAddIncome}
            onEditIncome={handleEditIncome}
            incomeData={incomeData}
            totalIncome={formatCurrency(totalIncome)}
            formatCurrency={formatCurrency}
            onDeleteIncome={onDeleteIncome}
          />
          <Expense_Card 
            title={title} 
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            expenseData={expenseData}
            totalExpenses={formatCurrency(totalExpenses)}
            formatCurrency={formatCurrency}
            onDeleteExpense={handleDeleteExpense}
          />

          <Add_Expense
            title={title} 
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            expenseData={expenseData}
            totalExpenses={formatCurrency(totalExpenses)}
            formatCurrency={formatCurrency}
            onDeleteExpense={handleDeleteExpense} 
            />

          {/* Expense Form */}
          {showIncomeForm && (
            <div className="modal-overlay">
              <Income_Form 
                title={title} 
                initialData={editingData}
                onClose={() => {
                  setShowIncomeForm(false);
                  setEditingIndex(null);
                  setEditingData(null);
                }}
                onSave={(data) => {
                  if (editingIndex !== null && typeof onUpdateIncome === 'function') {
                    onUpdateIncome(editingIndex, data);
                  } else {
                    onSaveIncome(data);
                  }
                  setShowIncomeForm(false);
                  setEditingIndex(null);
                  setEditingData(null);
                  setPlanCreated(true);
                }}
              />
            </div>
          )}

          {/* Expense Form */}
          {showExpenseForm && (
            <div className="modal-overlay">
              <Income_Form 
                title="Add Expense"
                initialData={editingData}
                onClose={() => {
                  setShowExpenseForm(false);
                  setEditingIndex(null);
                  setEditingData(null);
                }}
                onSave={(data) => {
                  if (editingIndex !== null) {
                    handleUpdateExpense(editingIndex, data);
                  } else {
                    handleSaveExpense(data);
                  }
                  setShowExpenseForm(false);
                  setEditingIndex(null);
                  setEditingData(null);
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