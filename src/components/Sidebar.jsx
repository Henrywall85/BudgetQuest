import React from 'react';
import './Sidebar.css'

function Sidebar(){
    return(
        <div className='sidebar'>
            <div className='name-card'>
                <div className='name-card-badge'>
                    <p>HW</p>
                </div>
                <div className='name-card-userName'>
                    <p>Henry Wall</p>
                    <p className='name-card-logOut'>Sign Out</p>
                </div>
            </div>
            <span className='divider'></span>
            <ul className="sidebar-nav">
                <li className="nav-item"><a href="dashboard" className="nav-link">Dashboard</a></li>
                <li className="nav-item"><a href="planner" className="nav-link">Planner</a></li>
                <li className="nav-item"><a href="transactions" className="nav-link">Transactions</a></li>
            </ul>
        </div>
    );
}

export default Sidebar;