import React from 'react';
import './account.css';

class DailyExpenseDebit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        const responseExpenseList = await fetch("http://127.0.0.1:8000/list-of-dailyexpense/" );
        const jsonExpenseDetail = await responseExpenseList.json();

        if(jsonExpenseDetail.length!=0)
        {
            this.setState({
                minDate: jsonExpenseDetail[0].date
            });
            this.setState({
                maxDate: jsonExpenseDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            expenseDetail: jsonExpenseDetail
        });
    };

    // Set final showing rows of table currentWork
    setDateFilter = (item, index) => {
        if(!this.state.minFilterDate){
            this.state.minFilterDate= this.state.minDate;
        }
        if(!this.state.maxFilterDate){
            this.state.maxFilterDate= this.state.maxDate;
        }
        if(this.state.minFilterDate <= item.date && item.date <= this.state.maxFilterDate){
            this.state.currentExpense.push(item);
        }
    }

    constructor(props){
        super(props);
        this.state= {
            expenseDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentExpense: []
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);

        this.fetchProduct();
    }

    render(){
        // Clear currentExpense list
        this.state.currentExpense= [];

        //Apply date filter
        this.state.expenseDetail.forEach(this.setDateFilter);

        return(
            <div id="mainDiv">
                <div class="dateFilter">
                    <div className="fromDate">
                        <input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
                            this.setState({
                                minFilterDate: e.target.value
                            });
                        }}/>
                    </div>
                    <div className="toDate">
                        <input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
                            this.setState({
                                maxFilterDate: e.target.value
                            });
                        }}/>
                    </div>
                </div>
                <table className="table table-borderd">
                    <thead className="thead-dark">
                        <tr>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Debit Amount</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currentExpense.map((expense) => (
                            <tr>
                                <td>{expense.category}</td>
                                <td>{expense.date}</td>
                                <td>{expense.debit_amount}</td>
                                <td>{expense.remark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>    
        );
    }
}

export default DailyExpenseDebit;