import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

import './Add_Expense.css'

function Add_Expense ({title, onAddExpense, onEditExpense = () => {}, expenseData, totalExpenses, formatCurrency, onDeleteExpense}){
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
    <div className="card-container">
        <button className="add_expense_card card">
            <h2>Add Expense</h2>
        </button>
    </div>
    );
}

export default Add_Expense;