import React from 'react';
import NextPayCheck_Card from './NextPayCheck_Card';
import './BudgetContainer.css'

function BudgetContainer ({title}){
    return(
    <div className="Budget-Container">
          <NextPayCheck_Card title={title}/>
    </div>
    );
}

export default BudgetContainer;