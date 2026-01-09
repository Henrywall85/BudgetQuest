import React, { useState, useEffect } from 'react';
import NextPayCheck_Card from './NextPayCheck_Card';
import Month_Card from './Month_Card';
import Income_Card from './Income_Card';
import Expense_Card from './Expense_Card';
import Income_Form from './Income_Form';
import Category_Form from './Category_Form';
import Add_Category from './Add_Category';
import './BudgetContainer.css'

function BudgetContainer ({title, incomeData = [], onSaveIncome = () => {}, onUpdateIncome = () => {}, onDeleteIncome = () => {}, formatCurrency = (n)=>n}){
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Track editing state
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);

  // Expense cards management - array of cards, each with its own data
  const EXPENSE_CARDS_KEY = 'budgetquest:expenseCards';
  const [expenseCards, setExpenseCards] = useState(() => {
    try {
      const raw = localStorage.getItem(EXPENSE_CARDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });

  // Persist expense cards to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(EXPENSE_CARDS_KEY, JSON.stringify(expenseCards));
    } catch (err) {
      // ignore storage errors
    }
  }, [expenseCards]);

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

  const totalExpenses = expenseCards.reduce((sum, card) => {
    const cardTotal = card.expenses.reduce((cardSum, expense) => 
      cardSum + parseFloat(expense.amount || 0), 0
    );
    return sum + cardTotal;
  }, 0);

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
    const newCardId = Date.now();
    setExpenseCards(prev => [...prev, { id: newCardId, expenses: [] }]);
    setEditingIndex(null);
    setEditingData(null);
    setEditingCardId(newCardId);
    setShowExpenseForm(true);
  };

  const handleEditExpense = (cardId, index) => {
    setEditingCardId(cardId);
    const card = expenseCards.find(c => c.id === cardId);
    if (card) {
      setEditingIndex(index);
      setEditingData(card.expenses[index] ? { ...card.expenses[index] } : null);
      setShowExpenseForm(true);
    }
  };

  const handleSaveExpense = (data) => {
    if (editingCardId) {
      setExpenseCards(prev => prev.map(card => 
        card.id === editingCardId 
          ? { ...card, expenses: [...card.expenses, data] }
          : card
      ));
    }
  };

  const handleUpdateExpense = (cardId, index, data) => {
    setExpenseCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, expenses: card.expenses.map((item, i) => (i === index ? { ...item, ...data } : item)) }
        : card
    ));
  };

  const handleDeleteExpense = (cardId, index) => {
    setExpenseCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, expenses: card.expenses.filter((_, i) => i !== index) }
        : card
    ));
  };

  const handleAddExpenseToCard = (cardId) => {
    setEditingCardId(cardId);
    setEditingIndex(null);
    setEditingData(null);
    setShowExpenseForm(true);
  };

  const handleAddExpenseCategory = () => {
    setEditingIndex(null);
    setEditingData(null);
    setEditingCardId(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (cardId) => {
    setEditingCardId(cardId);
    const card = expenseCards.find(c => c.id === cardId);
    if (card) {
      setEditingData({ source: card.categoryName || '' });
      setShowCategoryForm(true);
    }
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
          
          {expenseCards.map(card => (
            <Expense_Card 
              key={card.id}
              cardId={card.id}
              title={card.categoryName || 'EXPENSES'}
              onEditCategory={() => handleEditCategory(card.id)}
              onAddExpense={() => handleAddExpenseToCard(card.id)}
              onEditExpense={(index) => handleEditExpense(card.id, index)}
              expenseData={card.expenses}
              totalExpenses={formatCurrency(card.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0))}
              formatCurrency={formatCurrency}
              onDeleteExpense={(index) => handleDeleteExpense(card.id, index)}
            />
          ))}

          <Add_Category
            title={title} 
            onAddExpense={handleAddExpenseCategory}
          />

          {/* Income Form */}
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
                  setEditingCardId(null);
                }}
                onSave={(data) => {
                  if (editingIndex !== null && editingCardId) {
                    handleUpdateExpense(editingCardId, editingIndex, data);
                  } else {
                    handleSaveExpense(data);
                  }
                  setShowExpenseForm(false);
                  setEditingIndex(null);
                  setEditingData(null);
                  setEditingCardId(null);
                }}
              />
            </div>
          )}

          {/* Category Form */}
          {showCategoryForm && (
            <div className="modal-overlay">
              <Category_Form 
                title={editingCardId ? "Edit Category" : "Add Expense Category"}
                onClose={() => {
                  setShowCategoryForm(false);
                  setEditingIndex(null);
                  setEditingData(null);
                  setEditingCardId(null);
                }}
                onSave={(data) => {
                  if (editingCardId) {
                    // Update existing category
                    setExpenseCards(prev => prev.map(card => 
                      card.id === editingCardId 
                        ? { ...card, categoryName: data.source }
                        : card
                    ));
                  } else {
                    // Create new category
                    const newCardId = Date.now();
                    setExpenseCards(prev => [...prev, { id: newCardId, categoryName: data.source, expenses: [] }]);
                  }
                  setShowCategoryForm(false);
                  setEditingIndex(null);
                  setEditingData(null);
                  setEditingCardId(null);
                }}
                initialData={editingData}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BudgetContainer;