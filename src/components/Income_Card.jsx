import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import './Income_Card.css'

function Income_Card ({title, onAddIncome, onEditIncome = () => {}, incomeData, totalIncome, formatCurrency, onDeleteIncome}){ // added onEditIncome prop
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [removingIndices, setRemovingIndices] = useState([]); // track rows currently animating out
    const hideTimerRef = useRef(null);
    const AUTO_HIDE_MS = 2000; // 2 seconds
    const REMOVE_ANIM_MS = 250; // match CSS animation duration

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
    }, [incomeData?.length]);

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
            if (typeof onDeleteIncome === 'function') {
                onDeleteIncome(index);
            }
            // cleanup removing state (in case indices shift, we remove by value)
            setRemovingIndices(prev => prev.filter(i => i !== index));
        }, REMOVE_ANIM_MS);
    };

    return(
    <div className="card-container">
        <div className="income_card card">
            <div className="card-header">
                <h3>INCOME</h3>
                <button className="add-income-button" onClick={onAddIncome}>+</button>
            </div>
            <div className="income-container">
                    {incomeData && incomeData.length > 0 ? (
                        incomeData.map((income, index) => (
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
                                  // pause auto-hide while hovered; resume on leave
                                  onMouseEnter={() => {
                                      // stop the timer so drawer remains visible while hovered
                                      clearHideTimer();
                                  }}
                                  onMouseLeave={() => {
                                      // resume the auto-hide timer when cursor leaves the drawer
                                      if (expandedIndex === index) startHideTimer();
                                  }}
                                  role="button"
                                  aria-label={`Delete income ${income.source || index}`}
                                  aria-hidden={expandedIndex !== index}
                                  tabIndex={expandedIndex === index ? 0 : -1}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </div>
                                <div className='income-info-container'>
                                    <div className="income-section-icon section-container" onClick={() => handleIconClick(index)}>
                                        <h1>{income.icon}</h1>
                                    </div>
                                    
                                    <div className="income-section-source section-container">
                                        <h2 onClick={() => onEditIncome(index)} style={{ cursor: 'pointer' }}>{income.source}</h2>
                                        <p>{income.frequency}</p>
                                    </div>

                                    <div className="income-section-amount section-container">
                                        <h2>${formatCurrency(income.amount)}</h2>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="income-section empty-source">
                            <h2>INCOME SOURCE</h2>
                        </div>
                    )}
            </div>
        </div>
        <div className="source-amount">
            <h2>${totalIncome}</h2>
        </div>
    </div>
    );
}

export default Income_Card;