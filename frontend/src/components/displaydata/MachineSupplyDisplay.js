import React from 'react';
import '../account/account.css';

class MachineSupplyDebit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        const responseMachineSupplyList = await fetch("http://127.0.0.1:8000/list-of-machinesupply/" );
        const jsonMachineSupplyDetail = await responseMachineSupplyList.json();

        if(jsonMachineSupplyDetail.length!=0)
        {
            this.setState({
                minDate: jsonMachineSupplyDetail[0].date
            });
            this.setState({
                maxDate: jsonMachineSupplyDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            machineSupplyDetail: jsonMachineSupplyDetail
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
            this.state.currentMachineSupply.push(item);
        }
    }

    constructor(props){
        super(props);
        this.state= {
            machineSupplyDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentMachineSupply: []
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);

        this.fetchProduct();
    }

    render(){
        //Clear currentMachineSupply list
        this.state.currentMachineSupply= [];
        
        //Apply date filter
        this.state.machineSupplyDetail.forEach(this.setDateFilter);
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
                            <th>Party</th>
                            <th>Material</th>
                            <th>Date</th>
                            <th>Quantity</th>
                            <th>Drilling Feet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currentMachineSupply.map((machineSupply) => (
                            <tr>
                                <td>{machineSupply.party}</td>
                                <td>{machineSupply.material}</td>
                                <td>{machineSupply.date}</td>
                                <td>{machineSupply.quantity}</td>
                                <td>{machineSupply.drilling_feet}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>    
        );
    }
}

export default MachineSupplyDebit;