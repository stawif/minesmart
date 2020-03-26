import React from 'react';
import './account.css';

class Debit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        const responseDebitList = await fetch("http://127.0.0.1:8000/list-of-debit/" );
        const jsonDebitDetail = await responseDebitList.json();

        if(jsonDebitDetail.length!=0)
        {
            this.setState({
                minDate: jsonDebitDetail[0].date,
                minFilterDate: jsonDebitDetail[0].date
            });
            this.setState({
                maxDate: jsonDebitDetail.slice(-1)[0].date,
                maxFilterDate: jsonDebitDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            debitDetail: jsonDebitDetail
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
            this.state.currentDebit.push(item);
            this.state.totalDebit= this.state.totalDebit+ item.debit_amount;
        }
    }

    // Return color for row
    returnRowColor = (category) =>{
        if(category === "part_debit"){
            return "bg-primary"
        }
        else if(category === "owner_debit"){
            return "bg-success"
        }
        else if(category === "purchase_debit"){
            return "bg-warning"
        }
        else if(category === "worker_debit"){
            return "bg-info"
        }
        else if(category === "daily_expense_debit"){
            return "bg-secondary"
        }
    }
    constructor(props){
        super(props);
        this.state= {
            debitDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentDebit: [],
            totalDebit: 0
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);
        this.returnRowColor= this.returnRowColor.bind(this);

        this.fetchProduct();
    }

    render(){
        //Clear currentDebit list
        this.state.currentDebit= [];
        this.state.totalDebit= 0;
        
        //Apply date filter
        this.state.debitDetail.forEach(this.setDateFilter);
        return(
            <div id="mainDiv">
                <div class="dateFilter">
                    <div className="fromDate">
                        <input type="date" min={this.state.minDate} max={this.state.maxDate} value={this.state.minFilterDate} onChange={e => {
                            this.setState({
                                minFilterDate: e.target.value
                            });
                        }}/>
                    </div>
                    <div className="toDate">
                        <input type="date" min={this.state.minDate} max={this.state.maxDate} value={this.state.maxFilterDate} onChange={e => {
                            this.setState({
                                maxFilterDate: e.target.value
                            });
                        }}/>
                    </div>
                </div>
                <div className="containTable scrollingSection">
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
                            {this.state.currentDebit.map((debit) => (
                                <tr className={this.returnRowColor(debit.category)}>
                                    <td>{debit.category}</td>
                                    <td>{debit.date}</td>
                                    <td>{debit.debit_amount}</td>
                                    <td>{debit.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="lowerStrip row">
                    <div className="col-sm-6 d-flex justify-content-center align-items-center p-0 m-0"><p>Total Debit: {this.state.totalDebit}</p></div>
                    <div className="col-sm-6 d-flex justify-content-center align-items-center p-0 m-0">
                        <button onClick={e => {
                            this.setState({
                                minFilterDate: this.state.minDate,
                                maxFilterDate: this.state.maxDate
                            });
                        }}>
                            Reset date
                        </button>
                    </div>
                </div>
            </div>    
        );
    }
}

export default Debit;