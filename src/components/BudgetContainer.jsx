import React from 'react';
import NextPayCheck_Card from './NextPayCheck_Card';
import Month_Card from './Month_Card';
import Income_Card from './Income_Card';
import './BudgetContainer.css'

function BudgetContainer ({title}){
  const [planCreated, setPlanCreated] = React.useState(false);
    // Get current month and year
    const currentDate = new Date();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();


    return(
    <div className="Budget-Container">
          <div id="remaining-budget">
            <h2>{month}, {year}</h2>
            <linebreak/>
            <h1>$0.00</h1>
            <p>Left To Budget</p>
            <linebreak/>
          </div>
          {!planCreated &&(
            <Month_Card title={title} onCreatePlan={() => setPlanCreated(true)} />
          )}
          {planCreated &&(
          <Income_Card title={title}/>
          )}
    </div>
    );
}

export default BudgetContainer;