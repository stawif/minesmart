import React from 'react';
import './account.css';

class Credit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        const responseCreditList = await fetch("http://127.0.0.1:8000/list-of-credit/" );
        const jsonCreditDetail = await responseCreditList.json();

        if(jsonCreditDetail.length!=0)
        {
            this.setState({
                minDate: jsonCreditDetail[0].date,
                minFilterDate: jsonCreditDetail[0].date
            });
            this.setState({
                maxDate: jsonCreditDetail.slice(-1)[0].date,
                maxFilterDate: jsonCreditDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            creditDetail: jsonCreditDetail
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
            this.state.currentCredit.push(item);
            this.state.totalCredit= this.state.totalCredit+ item.credit_amount;
        }
    }

    // Return color for row
    returnRowColor = (category) =>{
        if(category === "machine_party"){
            return "bg-primary"
        }
        else if(category === "vehicle_party"){
            return "bg-success"
        }
        else if(category === "daily_work"){
            return "bg-info"
        }
    }
    constructor(props){
        super(props);
        this.state= {
            creditDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentCredit: [],
            totalCredit: 0
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);
        this.returnRowColor= this.returnRowColor.bind(this);

        this.fetchProduct();
    }

    render(){
        //Clear currentCredit list
        this.state.currentCredit= [];
        this.state.totalCredit= 0;
        
        //Apply date filter
        this.state.creditDetail.forEach(this.setDateFilter);
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
                                <th>Credit Amount</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.currentCredit.map((credit) => (
                                <tr className={this.returnRowColor(credit.category)}>
                                    <td>{credit.category}</td>
                                    <td>{credit.date}</td>
                                    <td>{credit.credit_amount}</td>
                                    <td>{credit.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="lowerStrip row">
                    <div className="col-sm-6 d-flex justify-content-center align-items-center p-0 m-0"><p>Total Credit: {this.state.totalCredit}</p></div>
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

export default Credit;