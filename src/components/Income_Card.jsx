import React from 'react';
import './Income_Card.css'

function Income_Card ({title, onAddIncome}){
    return(
    <div className="card-container">
        <div className="income_card card">
            <div className="card-header">
                <h3>INCOME</h3>
                <button className="add-income-button" onClick={onAddIncome}>+</button>
            </div>
            <div className="income-container">
                <div className="income-section">
                    <div className="income-section-icon section-container"><h1>H</h1></div>
                    
                    {/* INCOME NAME */}
                    <div className="income-section-source section-container">
                        <h2>Henry's Income</h2>
                        <p>Bi-Weekly</p>
                    </div>

                    {/* INCOME AMOUNT  */}
                    <div className="income-section-amount section-container">
                        <h2>$0.00</h2>
                    </div>

                </div>
                <h2>INCOME SOURCE</h2>
            </div>   
        </div>
        <div className="source-amount">
            <h2>$0.00</h2>
        </div>
    </div>
    );
}

export default Income_Card;