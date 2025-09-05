import React from 'react';
import './Sidebar.css'

function Sidebar(){
    return(
        <div className='sidebar'>
            <div className='sidebar-header'>
                <ul className="sidebar-nav">
                    <li className="nav-item"><a href="dashboard" className="nav-link">Dashboard</a></li>
                    <li className="nav-item"><a href="planner" className="nav-link">Planner</a></li>
                    <li className="nav-item"><a href="transactions" className="nav-link">Transactions</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;