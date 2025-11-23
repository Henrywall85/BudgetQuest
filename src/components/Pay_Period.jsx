import React from 'react';
import './Pay_Period.css'

function startOfDay(d){
  const dt = new Date(d);
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

function addDays(d, days){
  const dt = new Date(d);
  dt.setDate(dt.getDate() + days);
  return dt;
}

function nextOccurrence(income, today){
  if(!income || !income.nextDeposit) return null;
  let dt = startOfDay(new Date(income.nextDeposit));
  const freq = (income.frequency || '').toLowerCase();

  if(!freq) return dt;

  // advance until we reach today or later
  while(dt.getTime() < today.getTime()){
    if(freq.includes('bi') && freq.includes('week')) {
      dt = addDays(dt, 14);
    } else if(freq.includes('week')) {
      dt = addDays(dt, 7);
    } else if(freq.includes('month')) {
      dt = new Date(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
    } else {
      // unknown frequency — stop advancing
      break;
    }
  }
  return dt;
}

function findNextPayPeriodEntries(incomeData = []){
  if(!incomeData || incomeData.length === 0) return null;

  const today = startOfDay(new Date());
  const entriesWithDates = incomeData
    .map(i => ({ ...i, _date: nextOccurrence(i, today) }))
    .filter(i => i._date);

  if(entriesWithDates.length === 0) return null;

  const futureDates = entriesWithDates
    .filter(i => i._date.getTime() >= today.getTime())
    .map(i => i._date.getTime());

  let targetTime;
  if(futureDates.length > 0){
    targetTime = Math.min(...futureDates);
  } else {
    const allTimes = entriesWithDates.map(i => i._date.getTime());
    targetTime = Math.min(...allTimes);
  }

  const targetDate = new Date(targetTime);
  const entries = entriesWithDates.filter(i => i._date.getTime() === targetTime);
  return { date: targetDate, entries };
}

function Pay_Period ({title, incomeData = [], totalIncome, formatCurrency = (n)=>n}){
    const next = findNextPayPeriodEntries(incomeData);

    return(
    <div className="card-container">
        <div className="payperiod_card card">
            <div className="card-header">
                <h3>NEXT PAYCHECK</h3>
            </div>

            <div className="income-container">
                {next ? (
                  <>
                    {next.entries.map((income, index) => {
                      // prefer normalized _date (set by findNextPayPeriodEntries)
                      const dt = income._date ? new Date(income._date) : (income.nextDeposit ? new Date(income.nextDeposit) : null);
                      const month = dt ? dt.toLocaleString('default', { month: 'short' }).toUpperCase() : '';
                      const day = dt ? dt.getDate() : '';

                      return (
                      <div className="income-section" key={index}>
                          <div className="payperiod-section-icon section-container">
                              <h2>{month}</h2>
                              <h1>{day}</h1>
                          </div>
                          
                          <div className="income-section-source section-container">
                              <h2>{income.source}</h2>
                              <p>{income.frequency}</p>
                          </div>

                          <div className="income-section-amount section-container">
                              <h2>${formatCurrency(income.amount)}</h2>
                          </div>
                      </div>
                      )
                    })}
                  </>
                ) : (
                  <div className="income-section empty-source">
                      <h2>INCOME SOURCE</h2>
                  </div>
                )}
            </div>   
        </div>
    </div>
    );
}

export default Pay_Period;