import React from 'react';
import './Income_Form.css'

function Income_Form ({title}){
    return(
    <div className="form-container">
        <div className="income_form card">
            <div className="form-header">
                <div className="form-header-content">
                    <h2>Add income</h2>
                    <p>Enter your income details to add it to your plan.</p>
                </div>
                <button className="close-form-button"><FontAwesomeIcon icon="fa-solid fa-xmark" /></button>
            </div>
            <div className="form-container">
            </div>   
        </div>
    </div>
    );
}

export default Income_Form;