import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Expense_Form.css'

function Expense_Form ({title, onClose, onSave, initialData = null}) {
    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('');
    const [nextDeposit, setNextDeposit] = useState(null);
    const [saved, setSaved] = useState(false);

    // initialize when editing existing entry
    useEffect(() => {
        if (initialData) {
            setSource(initialData.source || '');
            setAmount(initialData.amount || '');
            setFrequency(initialData.frequency || '');
            setNextDeposit(initialData.nextDeposit ? new Date(initialData.nextDeposit) : null);
        } else {
            setSource('');
            setAmount('');
            setFrequency('');
            setNextDeposit(null);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (source.trim() && amount.trim() && frequency && nextDeposit) {
            onSave({
                source: source.trim(),
                amount: amount.trim(),
                frequency: frequency,
                nextDeposit: nextDeposit,
                icon: source.charAt(0).toUpperCase()
            });
        }
    };

    const handleEdit = () => {
        setSaved(false);
    };

    // Function to toggle 'active' class based on focus or value
    const handleInputChange = (e) => {
        const input = e.target;
        const wrapper = input.closest('.input-wrapper');
        const isSelect = input.tagName === 'SELECT';
        if (isSelect) {
            setFrequency(input.value); // Update frequency state
        }
        const hasValue = isSelect ? input.value && input.value !== '' : input.value;
        if (wrapper) {
            if (hasValue || document.activeElement === input) {
                wrapper.classList.add('active');
            } else {
                wrapper.classList.remove('active');
            }
        }
    };

    return(
    <div className="form-container">
        <div className="expense_form card">
            <div className="form-header">
                <div className="form-header-content">
                    <h2>{initialData ? 'Edit Item' : 'Add Item'}</h2>
                    <p>Enter your expense details to add it to your plan.</p>
                </div>
                <button className="close-form-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
                <form className="expense-form">
                    <div className="form-group">
                        {/* EXPENSE SOURCE */}
                        <div className={`input-wrapper ${source ? 'active' : ''}`}>
                            <input
                                type="text"
                                id="expense-source"
                                name="expense-source"
                                className='underline-input'
                                value={source}
                                onChange={(e) => {
                                    setSource(e.target.value);
                                    handleInputChange(e);
                                }}
                                onFocus={handleInputChange}
                                onBlur={handleInputChange}
                                required
                            />
                            <label htmlFor="expense-source" className="float-label">Expense Source</label>
                        </div>

                        {/* EXPENSE AMOUNT */}
                        <div className={`input-wrapper ${amount ? 'active' : ''}`}>
                            <input
                                type="text"
                                id="expense-amount"
                                name="expense-amount"
                                className='underline-input'
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    handleInputChange(e);
                                }}
                                onFocus={handleInputChange}
                                onBlur={handleInputChange}
                                required
                            />
                            <label htmlFor="expense-amount" className="float-label">Amount</label>
                        </div>

                        {/* FREQUENCY */}
                        <div className={`input-wrapper ${frequency ? 'active' : ''}`}>
                            <select
                                id="expense-frequency"
                                name="expense-frequency"
                                className='underline-input'
                                value={frequency}
                                onChange={handleInputChange}
                                onFocus={handleInputChange}
                                onBlur={handleInputChange}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="Monthly">Monthly</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-weekly">Bi-Weekly</option>
                            </select>
                            <label htmlFor="expense-frequency" className="float-label">Frequency</label>
                        </div>

                        {/* NEXT PAYMENT */}
                        <div className={`input-wrapper date-input-wrapper ${nextDeposit ? 'active' : ''}`}>
                            <DatePicker
                                id="next-payment"
                                selected={nextDeposit}
                                onChange={(date) => setNextDeposit(date)}
                                className="underline-input"
                                dateFormat="MM/dd/yyyy"
                                placeholderText=""
                                onFocus={() => {
                                    /* wrapper state is handled by className based on nextDeposit */
                                }}
                                onBlur={() => {
                                    /* wrapper state is handled by className based on nextDeposit */
                                }}
                            />
                            <label htmlFor="next-payment" className="float-label">Next Payment</label>
                        </div>
                        <button type="submit" className="save-button" onClick={handleSubmit}>Save</button>
                    </div>
                </form>
        </div>
    </div>
    );
}

export default Expense_Form;