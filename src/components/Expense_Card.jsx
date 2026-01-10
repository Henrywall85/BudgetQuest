import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import './Expense_Card.css'

function Expense_Card ({title, onAddExpense, onEditCategory = () => {}, onEditExpense = () => {}, expenseData, totalExpenses, formatCurrency, onDeleteExpense, isRemoving = false}){
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [removingIndices, setRemovingIndices] = useState([]);
    const hideTimerRef = useRef(null);
    const AUTO_HIDE_MS = 2000;
    const REMOVE_ANIM_MS = 250;

    // helper: clear any running hide timer
    const clearHideTimer = () => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };

    // helper: start hide timer (closes drawer after AUTO_HIDE_MS)
    const startHideTimer = () => {
        clearHideTimer();
        if (expandedIndex !== null) {
            hideTimerRef.current = setTimeout(() => {
                setExpandedIndex(null);
                hideTimerRef.current = null;
            }, AUTO_HIDE_MS);
        }
    };

    // Reset/hide any open delete drawer when the income list changes
    useEffect(() => {
        setExpandedIndex(null);
    }, [expenseData?.length]);

    // start/clear auto-hide timer whenever expandedIndex changes
    useEffect(() => {
        clearHideTimer();
        if (expandedIndex !== null) {
            startHideTimer();
        }
        return () => {
            clearHideTimer();
        };
    }, [expandedIndex]);

    const handleIconClick = (index) => {
        // toggle drawer for the clicked row
        setExpandedIndex(prev => (prev === index ? null : index));
    };

    const handleDeleteClicked = (index) => {
        // ignore if already removing
        if (removingIndices.includes(index)) return;

        // start removal animation
        setRemovingIndices(prev => [...prev, index]);

        // clear timers and close drawer UI immediately
        clearHideTimer();
        setExpandedIndex(null);

        // call actual delete after animation completes
        setTimeout(() => {
            if (typeof onDeleteExpense === 'function') {
                onDeleteExpense(index);
            }
            // cleanup removing state (in case indices shift, we remove by value)
            setRemovingIndices(prev => prev.filter(i => i !== index));
        }, REMOVE_ANIM_MS);
    };

    return(
    <div className={`card-container ${isRemoving ? 'removing' : ''}`}>
        <div className="income_card card">
            <div className="card-header">
                <h3 onClick={onEditCategory} style={{ cursor: 'pointer' }}>{title}</h3>
                <button className="add-income-button" onClick={onAddExpense}>+</button>
            </div>
            <div className="income-container">
                    {expenseData && expenseData.length > 0 ? (
                        expenseData.map((expense, index) => (
                            <div
                                className={`income-section ${removingIndices.includes(index) ? 'removing' : ''}`}
                                key={index}
                            >
                                <div 
                                  className={`delete-income-section-container ${expandedIndex === index ? 'visible' : ''}`}
                                  onClick={() => { handleDeleteClicked(index); }}
                                  onKeyDown={(e) => {
                                    if ((e.key === 'Enter' || e.key === ' ') && expandedIndex === index) {
                                      e.preventDefault();
                                      handleDeleteClicked(index);
                                    }
                                  }}
                                  onMouseEnter={() => {
                                      // stop the timer so drawer remains visible while hovered
                                      clearHideTimer();
                                  }}
                                  onMouseLeave={() => {
                                      // resume the auto-hide timer when cursor leaves the drawer
                                      if (expandedIndex === index) startHideTimer();
                                  }}
                                  role="button"
                                  aria-label={`Delete expense ${expense.source || index}`}
                                  aria-hidden={expandedIndex !== index}
                                  tabIndex={expandedIndex === index ? 0 : -1}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </div>
                                <div className='income-info-container'>
                                    <div className="income-section-icon section-container" onClick={() => handleIconClick(index)}>
                                        <h1>{expense.icon}</h1>
                                    </div>
                                    
                                    <div className="income-section-source section-container">
                                        <h2 onClick={() => onEditExpense(index)} style={{ cursor: 'pointer' }}>{expense.source}</h2>
                                        <p>{expense.frequency}</p>
                                    </div>

                                    <div className="income-section-amount section-container">
                                        <h2>${formatCurrency(expense.amount)}</h2>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="income-section empty-source">
                            <h2>EXPENSE CATEGORY</h2>
                        </div>
                    )}
            </div>
        </div>
        <div className="source-amount">
            <h2>${totalExpenses}</h2>
        </div>
    </div>
    );
}

export default Expense_Card;