import React from 'react';
import './Add_Category.css'

function Add_Category ({title, onAddExpense}){
    return(
    <div className="card-container">
        <button className="add_category_card card" onClick={onAddExpense}>
            <h2>Add Category</h2>
        </button>
    </div>
    );
}

export default Add_Category;