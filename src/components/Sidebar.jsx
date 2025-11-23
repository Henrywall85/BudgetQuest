import React from 'react';
import './Sidebar.css'

function Sidebar({ onNavigate = () => {}, active = 'dashboard' }){
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
                <li className="nav-item">
                  <a href="#" className={`nav-link ${active === 'dashboard' ? 'active' : ''}`} onClick={(e)=>{ e.preventDefault(); onNavigate('dashboard'); }}>Dashboard</a>
                </li>
                <li className="nav-item">
                  <a href="#" className={`nav-link ${active === 'planner' ? 'active' : ''}`} onClick={(e)=>{ e.preventDefault(); onNavigate('planner'); }}>Planner</a>
                </li>
                <li className="nav-item">
                  <a href="#" className={`nav-link ${active === 'transactions' ? 'active' : ''}`} onClick={(e)=>{ e.preventDefault(); onNavigate('transactions'); }}>Transactions</a>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;