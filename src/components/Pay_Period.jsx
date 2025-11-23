// ...existing code...
import React from 'react';
import './Pay_Period.css'

function Pay_Period ({title, onAddIncome, incomeData, totalIncome, formatCurrency}){
    return(
    <div className="card-container">
        <div className="payperiod_card card">
            <div className="card-header">
                <h3>NEXT PAYCHECK</h3>
                {/* <button className="add-income-button" onClick={onAddIncome}>+</button> */}
            </div>
            <div className="income-container">
                {incomeData && incomeData.length > 0 ? (
                    incomeData.map((income, index) => (
                        <div className="income-section" key={index}>
                            <div className="income-section-icon section-container">
                                <h1>{income.icon}</h1>
                            </div>
                            
                            <div className="income-section-source section-container">
                                <h2>{income.source}</h2>
                                <p>{income.frequency}</p>
                            </div>

                            <div className="income-section-amount section-container">
                                <h2>${formatCurrency(income.amount)}</h2>
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
        {/* <div className="source-amount">
            <h2>${totalIncome}</h2>
        </div> */}
    </div>
    );
}

export default Pay_Period;
// ...existing code...