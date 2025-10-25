import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './Income_Form.css'

function Income_Form ({title}){
    const [source, setSource] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState(''); // State for select
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Trim and only save if something was entered
        if (source.trim() || amount.trim()) {
            setSaved(true);
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
        if (hasValue || document.activeElement === input) {
            wrapper.classList.add('active');
        } else {
            wrapper.classList.remove('active');
        }
    };

    return(
    <div className="form-container">
        <div className="income_form card">
            <div className="form-header">
                <div className="form-header-content">
                    <h2>Add income</h2>
                    <p>Enter your income details to add it to your plan.</p>
                </div>
                <button className="close-form-button"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
                <form className="income-form">
                    <div className="form-group">
                        {/* INCOME SOURCE */}
                        <div className="input-wrapper">
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
                        <div className="input-wrapper">
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
                        <div className="input-wrapper">
                            <select
                                id="income-frequency"
                                name="income-frequency"
                                className='underline-input'
                                value={frequency}
                                defaultValue=""
                                onChange={handleInputChange}
                                onFocus={handleInputChange}
                                onBlur={handleInputChange}
                                required
                            >
                                <option value="" disabled></option>
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-Weekly</option>
                            </select>
                            <label htmlFor="income-frequency" className="float-label">Frequency</label>
                        </div>
                    </div>
                </form>
        </div>
    </div>
    );
}

export default Income_Form;