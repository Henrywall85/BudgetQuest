import React from 'react';
import './Income_Card.css'

function Income_Card ({title}){
    return(
    <div className="card-container">
        <div className="income_card card">
            <div className="card-header">
                <h3>INCOME</h3>
                <button className="add-income-button">+</button>
            </div>
            <div className="income-container">
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