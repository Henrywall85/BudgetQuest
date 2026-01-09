import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './Category_Form.css'

function Category_Form ({title, onClose, onSave, initialData = null}) {
    const [source, setSource] = useState('');

    // initialize when editing existing entry
    useEffect(() => {
        if (initialData) {
            setSource(initialData.source || '');
        } else {
            setSource('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (source.trim()) {
            onSave({
                source: source.trim(),
                icon: source.charAt(0).toUpperCase()
            });
        }
    };

    // Function to toggle 'active' class based on focus or value
    const handleInputChange = (e) => {
        const input = e.target;
        const wrapper = input.closest('.input-wrapper');
        const hasValue = input.value;
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
        <div className="category_form card">
            <div className="category-form-header">
                <div className="category-form-header-content">
                    <h2>{initialData ? 'Edit Category Name' : 'Create A New Category'}</h2>
                    <p>Categories help you align your cash flow with financial goals and spending purposes.</p>
                </div>
                <button className="close-form-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
                <form className="category-form">
                    <div className="category-form-group">
                        {/* CATEGORY NAME */}
                        <div className={`input-wrapper ${source ? 'active' : ''}`}>
                            <input 
                                type="text" 
                                id="category-name" 
                                name="category-name"
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
                            <label htmlFor="category-name" className="float-label">Category Name</label>
                        </div>
                    </div>
                    <button type="submit" className="save-button" onClick={handleSubmit}>Save</button>
                </form>
        </div>
    </div>
    );
}

export default Category_Form;