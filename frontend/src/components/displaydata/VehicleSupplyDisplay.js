import React from 'react';
import '../account/account.css';

class VehicleSupplyDisplay extends React.Component{
    // Fetch vehicle list from server
    fetchProduct = async () => {
        const responseVehicleSupplyList = await fetch("http://127.0.0.1:8000/list-of-vehiclesupply/" );
        const jsonVehicleSupplyDetail = await responseVehicleSupplyList.json();

        if(jsonVehicleSupplyDetail.length!=0)
        {
            this.setState({
                minDate: jsonVehicleSupplyDetail[0].date
            });
            this.setState({
                maxDate: jsonVehicleSupplyDetail.slice(-1)[0].date    
            });
        } 
        this.setState({
            vehicleSupplyDetail: jsonVehicleSupplyDetail
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
            this.state.currentVehicleSupply.push(item);
        }
    }

    constructor(props){
        super(props);
        this.state= {
            vehicleSupplyDetail: [],
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentVehicleSupply: []
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);

        this.fetchProduct();
    }

    render(){
        //Clear currentVehicleSupply list
        this.state.currentVehicleSupply= [];
        
        //Apply date filter
        this.state.vehicleSupplyDetail.forEach(this.setDateFilter);
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
                            <th>Material</th>
                            <th>Date</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.currentVehicleSupply.map((vehicleSupply) => (
                            <tr>
                                <td>{vehicleSupply.material}</td>
                                <td>{vehicleSupply.date}</td>
                                <td>{vehicleSupply.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>    
        );
    }
}

export default VehicleSupplyDisplay;