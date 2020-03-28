import React from 'react';
import './account.css';

class OwnerDebit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        const responseOwnerList = await fetch("http://127.0.0.1:8000/list-of-ownerdebit/" );
        const jsonOwnerDetail = await responseOwnerList.json();

        if(jsonOwnerDetail.length!=0)
        {
            this.setState({
                minDate: jsonOwnerDetail[0].date,
                minFilterDate: jsonOwnerDetail[0].date
            });
            this.setState({
                maxDate: jsonOwnerDetail.slice(-1)[0].date,
                maxFilterDate: jsonOwnerDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            ownerDetail: jsonOwnerDetail
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
            this.state.currentOwner.push(item);
            this.state.totalDebit= this.state.totalDebit+ item.debit_amount;
        }
    }

    constructor(props){
        super(props);
        this.state= {
            ownerDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentOwner: [],
            totalDebit: 0
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);

        this.fetchProduct();
    }

    render(){
        //Clear currentOwner list
        this.state.currentOwner= [];
        this.state.totalDebit= 0;
        
        //Apply date filter
        this.state.ownerDetail.forEach(this.setDateFilter);
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
                <div className="containTable">
                    <table className="table table-borderd">
                        <thead className="thead-dark">
                            <tr>
                                <th>Date</th>
                                <th>Debit Amount</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.currentOwner.map((owner) => (
                                <tr>
                                    <td>{owner.date}</td>
                                    <td>{owner.debit_amount}</td>
                                    <td>{owner.remark}</td>
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

export default OwnerDebit;