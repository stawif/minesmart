import React from 'react';
import './account.css';

class PartDebit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        const responsePartList = await fetch("http://127.0.0.1:8000/list-of-part/" );
        const jsonPartDetail = await responsePartList.json();

        if(jsonPartDetail.length!=0)
        {
            this.setState({
                minDate: jsonPartDetail[0].date
            });
            this.setState({
                maxDate: jsonPartDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            partDetail: jsonPartDetail
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
            this.state.currentPart.push(item);
        }
    }

    constructor(props){
        super(props);
        this.state= {
            partDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentPart: []
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);

        this.fetchProduct();
    }

    render(){
        //Clear currentPart list
        this.state.currentPart= [];
        
        //Apply date filter
        this.state.partDetail.forEach(this.setDateFilter);
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
                            <th>Date</th>
                            <th>Debit Amount</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currentPart.map((part) => (
                            <tr>
                                <td>{part.name}</td>
                                <td>{part.date}</td>
                                <td>{part.debit_amount}</td>
                                <td>{part.remark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>    
        );
    }
}

export default PartDebit;