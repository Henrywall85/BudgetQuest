import React from 'react';
import './Month_Card.css'

function Month_Card ({title, onCreatePlan}){
    return(
    <div className="month_card">
        <div className="card_message">
            <h2>Hey there, looks like you need a budget for this month</h2>
            <p>Click the button below to start your new budget plan.</p>
        </div>

        <button className="create_plan_button" onClick={onCreatePlan}>Start Planning For This Month</button>
    </div>
    );
}

export default Month_Card;