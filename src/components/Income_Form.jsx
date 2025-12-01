import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Income_Form.css'

function Income_Form ({title, onClose, onSave, initialData = null}) {
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
        <div className="income_form card">
            <div className="form-header">
                <div className="form-header-content">
                    <h2>{initialData ? 'Edit income' : 'Add income'}</h2>
                    <p>Enter your income details to add it to your plan.</p>
                </div>
                <button className="close-form-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
                <form className="income-form">
                    <div className="form-group">
                        {/* INCOME SOURCE */}
                        <div className={`input-wrapper ${source ? 'active' : ''}`}>
                            <input 
                                type="text" 
                                id="income-source" 
                                name="income-source"
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
                            <label htmlFor="income-source" className="float-label">Income Source</label>
                        </div>

                        {/* INCOME AMOUNT */}
                        <div className={`input-wrapper ${amount ? 'active' : ''}`}>
                            <input
                                type="text"
                                id="income-amount"
                                name="income-amount"
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
                            <label htmlFor="income-amount" className="float-label">Amount</label>
                        </div>

                        {/* FREQUENCY */}
                        <div className={`input-wrapper ${frequency ? 'active' : ''}`}>
                            <select
                                id="income-frequency"
                                name="income-frequency"
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
                            <label htmlFor="income-frequency" className="float-label">Frequency</label>
                        </div>

                        {/* NEXT DEPOSIT */}
                        <div className={`input-wrapper date-input-wrapper ${nextDeposit ? 'active' : ''}`}>
                            <DatePicker
                                id="next-deposit"
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
                            <label htmlFor="next-deposit" className="float-label">Next Deposit</label>
                        </div>
                        <button type="submit" className="save-button" onClick={handleSubmit}>Save</button>
                    </div>
                </form>
        </div>
    </div>
    );
}

export default Income_Form;