import React from 'react';
import './account.css';

class DailyWorkCredit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        const responseDailyWorkList = await fetch("http://127.0.0.1:8000/list-of-daily-work/" );
        const jsonDailyWorkDetail = await responseDailyWorkList.json();

        if(jsonDailyWorkDetail.length!=0)
        {
            this.setState({
                minDate: jsonDailyWorkDetail[0].date
            });
            this.setState({
                maxDate: jsonDailyWorkDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            dailyWorkDetail: jsonDailyWorkDetail
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
            this.state.currentDailyWork.push(item);
        }
    }

    constructor(props){
        super(props);
        this.state= {
            dailyWorkDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentDailyWork: []
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);

        this.fetchProduct();
    }

    render(){
        //Clear currentDailyWork list
        this.state.currentDailyWork= [];
        
        //Apply date filter
        this.state.dailyWorkDetail.forEach(this.setDateFilter);
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
                            <th>Name</th>
                            <th>Village</th>
                            <th>Date</th>
                            <th>Vehicle</th>
                            <th>5 Feet</th>
                            <th>5 Feet Rate</th>
                            <th>2.5 Feet</th>
                            <th>2.5 Feet Rate</th>
                            <th>Diesel(Rs)</th>
                            <th>Received</th>
                            <th>Net Amount</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currentDailyWork.map((dailyWork) => (
                            <tr>
                                <td>{dailyWork.name}</td>
                                <td>{dailyWork.village}</td>
                                <td>{dailyWork.date}</td>
                                <td>{dailyWork.vehicle}</td>
                                <td>{dailyWork.five_feet}</td>
                                <td>{dailyWork.five_feet_rate}</td>
                                <td>{dailyWork.two_half_feet}</td>
                                <td>{dailyWork.two_half_feet_rate}</td>
                                <td>{dailyWork.diesel_spend}</td>
                                <td>{dailyWork.received_amount}</td>
                                <td>{dailyWork.net_amount}</td>
                                <td>{dailyWork.remark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>    
        );
    }
}

export default DailyWorkCredit;