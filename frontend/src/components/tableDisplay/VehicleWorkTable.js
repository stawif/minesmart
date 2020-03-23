import React from 'react';
import '../../tableDisplayCss.css';
import Popup from "reactjs-popup";
import axios from "axios";


class VehicleWorkTable extends React.Component{
    //setDateRestriction 
    setDateRestriction = (item, index) =>{
        if(item.paid == false){
            this.setState({
                paymentData: {
                    minToDate: item.date,  
                    maxToDate: this.state.maxDate
                    }
            });
            return false;
        }
        else{
            return true;
        }
    }
    // Fetch data of machine work from party name came with props
    fetchProduct = async (partyName) =>{
        const responsWorkDetail = await fetch('http://127.0.0.1:8000/vehicle-work-detail/', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                "party": partyName
                })
            });        
        const jsonWorkDetail = await responsWorkDetail.json();
        this.setState({
            workDetail: jsonWorkDetail
        });    
    if(jsonWorkDetail.work.length!=0)
        {
            this.setState({
                minFilterDate: jsonWorkDetail.work[0].date
            });
            this.setState({
                maxFilterDate: jsonWorkDetail.work.slice(-1)[0].date    
            });
            //Set paymentData minToDate
            jsonWorkDetail.work.every(this.setDateRestriction);

            //Set paymentData maxToDate
            this.setState({
                minToDate: this.state.minToDate,  
                maxToDate: jsonWorkDetail.work.slice(-1)[0].date
            });
            //this.state.paymentData.maxToDate = jsonWorkDetail.work.slice(-1)[0].date;
        }    
    }

    //Push paid and unpaid work objects in different arrays 
    paidFilter = (item, index) =>{
        if(item.paid == true){
            this.state.paidWork.push(item);
        }
        else{
            this.state.unPaidWork.push(item);
        }
    }

    // Set final showing rows of table currentWork
    setDateFilter = (item, index) => {
        if(!this.state.minFilterDate){
            this.state.minFilterDate= this.state.minToDate;
        }
        if(!this.state.maxFilterDate){
            this.state.maxFilterDate= this.state.maxToDate;
        }
        if(this.state.minFilterDate <= item.date && item.date <= this.state.maxFilterDate){
            this.state.currentWork.push(item);
        }
    }

    //Handle selection of radio buttons and set paidStatus
    setPaidStatus = (status) =>{
        if(status==="paid"){
            this.setState({
                paidStatus: "paid",
                buttonStatus: {
                    visibility: "hidden"
                }
            });
        }
        else if(status==="unpaid"){
            this.setState({
                paidStatus: "unpaid",
                buttonStatus: {
                    visibility: "visible"
                }
            });
        }
        else{
            this.setState({
                paidStatus: null
            }); 
        }
    }

    //Set paidStatus to null so that tables show both paid and unpaid
    setPaidStatusNull = () =>{
        this.setState({
            paidStatus: null,
            buttonStatus: {
                visibility: "hidden"
            }
    }); 
        document.getElementsByName('paidStatus')[0].checked=false;
        document.getElementsByName('paidStatus')[1].checked=false;
    }

    //Set Feet rate
    setFeetRate = (rate) =>{
        this.setState({
            feetRate: rate
        });
        this.setState({
            totalPayment: (this.state.feet*rate) + (this.state.twoHalfFeetQuantity*this.state.twoHalfFeetRate) + (this.state.fiveFeetQuantity*this.state.fiveFeetRate) - (this.state.payment)
        });
    }

    //Set two half feet rate
    setTwoHalfFeetRate = (rate) =>{
        this.setState({
            twoHalfFeetRate: rate
        });
        this.setState({
            totalPayment: (this.state.feet*this.state.feetRate) + (this.state.twoHalfFeetQuantity*rate) + (this.state.fiveFeetQuantity*this.state.fiveFeetRate) - (this.state.payment)
        });
    }

    //Set Five Feet rate
    setFiveFeetRate = (rate) =>{
        this.setState({
            fiveFeetRate: rate
        });
        this.setState({
            totalPayment: (this.state.feet*this.state.feetRate) + (this.state.twoHalfFeetQuantity*this.state.twoHalfFeetRate) + (this.state.fiveFeetQuantity*rate) - (this.state.payment)
        });
    }

    //Prepare data for payment
    preparePaymentData = (item, index) =>{
        this.state.feet= this.state.feet + item.feet;
        this.state.twoHalfFeetQuantity= this.state.twoHalfFeetQuantity + item.two_half_feet;
        this.state.fiveFeetQuantity= this.state.fiveFeetQuantity + item.five_feet;
        this.state.payment= this.state.payment + item.payment;
    }
	

    //Form Handler
    onSubmit = e => {
        axios
        .post("http://127.0.0.1:8000/vehicle-payment/", {
            party: this.props.partyName,
            start_date: this.state.minDate,
            end_date: this.state.maxFilterDate,
            payment: this.state.totalPayment,
            remark: this.state.remark
        })
        .then(res => {
            //this.fetchProduct();
            this.setState({
                responseMessage: res.data
            });
            console.log("Response message : ",res.data);
        })
        .catch(error => {
            console.log("Error : ",error);
        });
        e.target.reset();
        e.preventDefault();
    };

    constructor(props){
        super(props);
        this.state = {
            workDetail: {
                name: "",
                contact: "",
                village: "",
                crasher: "",
                work: []
            },
            paidWork: [],
            unPaidWork: [],
            paidStatus: null,
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentWork: [],
            feet: 0,
            fiveFeetQuantity: 0,
            twoHalfFeetQuantity: 0,
            payment: 0,
            feetRate: 0,
            fiveFeetRate: 0,
            twoHalfFeetRate: 0,
            totalPayment: 0,
            remark: "",
            buttonStatus: {
                visibility: "hidden"
            },
            paymentData:{
                minToDate: null,
                maxToDate: null,
            }
			
        }
        this.state.currentWork= null;
        this.fetchProduct = this.fetchProduct.bind(this);
        this.paidFilter = this.paidFilter.bind(this);
        this.setPaidStatus = this.setPaidStatus.bind(this);
        this.setDateFilter = this.setDateFilter.bind(this);
        this.setPaidStatusNull = this.setPaidStatusNull.bind(this);
        this.preparePaymentData = this.preparePaymentData.bind(this);
        this.setDateRestriction = this.setDateRestriction.bind(this);
        this.setFeetRate = this.setFeetRate.bind(this);
        this.setTwoHalfFeetRate= this.setTwoHalfFeetRate.bind(this);
        this.setFiveFeetRate = this.setFiveFeetRate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.fetchProduct(this.props.partyName);
    }
		

    componentWillReceiveProps(nextProps){
        if(this.props.partyName != nextProps.partyName){
            this.fetchProduct(nextProps.partyName);
        }
    }

    render(){
		
		
        // Reset all list so that next time it don't carry same values
        this.state.paidWork=[];
        this.state.unPaidWork=[];
        this.state.currentWork=[];

        //Reset total values of lower strip
        this.state.feet= 0;
        this.state.twoHalfFeetQuantity= 0;
        this.state.fiveFeetQuantity= 0;
        this.state.payment= 0;

        //Fill different lists
        this.state.workDetail.work.forEach(this.paidFilter);

        //Set current work according to radio button choices
        if(this.state.paidStatus==="paid"){
            this.currentWorkFromRadio= this.state.paidWork;
            this.state.minDate = Object(this.state.paidWork[0]).date;
            this.state.maxDate = Object(this.state.paidWork.slice(-1)[0]).date;
        }
        else if(this.state.paidStatus==="unpaid"){
            this.currentWorkFromRadio= this.state.unPaidWork;
            this.state.minDate = Object(this.state.unPaidWork[0]).date;
            this.state.maxDate = Object(this.state.unPaidWork.slice(-1)[0]).date;
        }
        else{
            this.currentWorkFromRadio= this.state.workDetail.work;
            this.state.minDate = Object(this.state.workDetail.work[0]).date;
            this.state.maxDate = Object(this.state.workDetail.work.slice(-1)[0]).date;
        }

        //Fill final list for show(Applying date filter)
        this.currentWorkFromRadio.forEach(this.setDateFilter);

        //Prepare payment data
        this.state.currentWork.forEach(this.preparePaymentData);

        return(
            <div id="tableComponent">
			
                <div className="row upperTable bg-success justify-content-center align-items-center">
                  
						<div className="col-sm-2">
							<blockquote className="commonFont blockquote text-center">
								<p className="mb-0" onClick={e => this.setPaidStatusNull()}><b>{this.props.partyName}</b></p>
							</blockquote>                        
						</div>

						<div className="col-sm-2">
							<blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.workDetail.contact}</p>
							</blockquote>                        
						</div>
                    
						<div className="col-sm-2">
							<blockquote className="commonFont blockquote text-center">
								<input type="radio" name="paidStatus" value="paid" onChange={ e => {this.setPaidStatus(e.target.value)}}/>paid
							</blockquote>                        
						</div>
                    
						<div className="col-sm-2">
							<blockquote className="commonFont blockquote text-center">
								<input type="radio" name="paidStatus" value="unpaid" onChange={ e => {this.setPaidStatus(e.target.value)}} />Unpaid
							</blockquote>                        
						</div>
                    
						<div className="col-sm-2">
							<input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
								this.setState({
									minFilterDate: e.target.value
								});
							}}/>
						</div>

						<div className="col-sm-2">
							<input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
								this.setState({
									maxFilterDate: e.target.value
								});
							}}/>
						</div>
					
				</div>
				
				<div className="row topTable">

                    <div className="col-6">
                        {/*Party and filter popup*/}
                        <Popup modal trigger={
                            <button className="bg-success">Party</button>
							
                        } 
						>
							
                            <h4 onClick={e => this.setPaidStatusNull()}>{this.props.partyName}</h4>
                            <h5>{this.state.workDetail.contact}</h5>
						
							<label className="radio-inline mr-2"><input type="radio" name="paidStatus" value="paid" onChange={ e => {this.setPaidStatus(e.target.value)}}/>Paid</label>
							<label className="radio-inline"><input type="radio" name="paidStatus" value="unpaid" onChange={ e => {this.setPaidStatus(e.target.value)}} />Unpaid</label>
						
							<input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
								this.setState({
									minFilterDate: e.target.value
								});
							}}/>

							<input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
								this.setState({
									maxFilterDate: e.target.value
								});
							}}/>
						
                        </Popup>
                    </div>
                    <div className="col-6">    
                        {/*Payment popup*/}
                        <Popup modal trigger={
                            <button className="bg-success">Payment</button>
                        }
						>

                        <p>Feet= {this.state.feet}</p>
                        <p>2.5 Feet= {this.state.twoHalfFeetQuantity}</p>
                        <p>5 Feet= {this.state.fiveFeetQuantity}</p>
                        <p>Paid= {this.state.payment}</p>
                            <Popup modal trigger={
                                    <button
                                        className="btn btn-outline-dark style"
                                        style={this.state.buttonStatus}>
                                    Payment
                                    </button>
                                    } >
									
                                    <div className="d-block scroll-class">
                                        <div className="d-flex justify-content-center align-items-center">
                                        
                                            <form
                                                className="form-container form-group"
                                                onSubmit={e => this.onSubmit(e)}
                                            >
                                            {this.state.minDate} to {this.state.maxFilterDate}
                                            <hr/>
                                            <p>Total Feet : {this.state.feet}</p>
                                            <input type="text" placeholder="Feet Rate" className="paymentInput" onChange={e => this.setFeetRate(e.target.value)}/>
                                            <p>Total 2.5 Feet: {this.state.twoHalfFeetQuantity}</p>
                                            <input type="text" placeholder="2.5 Feet Rate" className="paymentInput" onChange={e => this.setTwoHalfFeetRate(e.target.value)}/>
                                            <p>Total 5 Feet: {this.state.fiveFeetQuantity}</p>
                                            <input type="text" placeholder="5 Feet Rate" className="paymentInput" onChange={e => this.setFiveFeetRate(e.target.value)}/>
                                            <p>Total Recieved Payment : {this.state.payment}</p>
                                            <hr />
                                            <p>Total Payment : {this.state.totalPayment}</p>
                                            <hr />
                                            <input type="text" placeholder="Remark" className="remark" onChange={e => this.setState({ remark: e.target.value })} />
                                            <hr />
                                                <button
                                                    type="submit"
                                                    className="btn btn-outline-dark"
                                                    >
                                                        Pay
                                                </button>
                                            </form>    
                                    
                                        </div>
                                    </div>    
                            </Popup>                            

                        </Popup>
                    </div>    

				</div>
				
				<div className="midTable">
                    <table className=" table table-borderd">
                        <thead className="thead-dark">
                            <tr>
                                <th>Paid</th>
                                <th>Date</th>
                                <th>Feet</th>
                                <th>Two Half Feet</th>
                                <th>Five Feet</th>
                                <th>Paid</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.currentWork.map((work) => (
                                <tr>
                                    <td>{<input type="checkbox" checked={work.paid}></input>}</td>
                                    <td>{work.date}</td>
                                    <td>{work.feet}</td>
                                    <td>{work.two_half_feet}</td>
                                    <td>{work.five_feet}</td>
                                    <td>{work.payment}</td>
                                    <td>{work.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="row lowerTable text-center bg-success commonFont justify-content-center align-items-center">
                    <div className="col-sm-2">
						<p>Feet =</p>
                    </div>
					
					<div className="col-sm-1">
						<p>{this.state.feet}</p>
					</div>

					<div className="col-sm-2">
						<p>2.5 Feet =</p>
					</div>
					
					<div className="col-sm-1">
						<p>{this.state.twoHalfFeetQuantity}</p>
					</div>


					<div className="col-sm-2">
						<p>Paid =</p>
					</div>
					
					<div className="col-sm-1">
						<p>{this.state.payment}</p>
					</div>

                        <div className="col-sm-3">
                            <Popup modal trigger={
                                <button
                                    className="btn btn-outline-dark"
                                    style={this.state.buttonStatus}>
                                Payment
                                </button>   
                            }>
                                <div className="d-flex justify-content-center align-items-center">
                                    <form
                                        className="form-container form-group"
                                        onSubmit={e => this.onSubmit(e)}
                                    >
                                        {this.state.minDate} to {this.state.maxFilterDate}
                                        <p>Total Feet : {this.state.feet}</p>
                                        <input type="text" placeholder="Feet Rate" className="paymentInput" onChange={e => this.setFeetRate(e.target.value)}/>
                                        <hr/>
                                        <p>Total 2.5 Feet: {this.state.twoHalfFeetQuantity}</p>
                                        <input type="text" placeholder="2.5 Feet Rate" className="paymentInput" onChange={e => this.setTwoHalfFeetRate(e.target.value)}/>
                                        <hr/>
                                        <p>Total 5 Feet: {this.state.fiveFeetQuantity}</p>
                                        <input type="text" placeholder="5 Feet Rate" className="paymentInput" onChange={e => this.setFiveFeetRate(e.target.value)}/>
                                        <hr/>
                                        <p>Total Recieved Payment : {this.state.payment}</p>
                                        <hr />
                                        <p>Total Payment : {this.state.totalPayment}</p>
                                        <hr />
                                        <input type="text" placeholder="Remark" className="remark" onChange={e => this.setState({ remark: e.target.value })} />
                                        <hr />
                                        <button
                                            type="submit"
                                            className="btn btn-outline-dark"
                                            >
                                                Pay
                                        </button>
                                    </form>    
                                </div>
                            </Popup>                            
                        </div>
                </div>

            </div>
        );
    }

}

export default VehicleWorkTable;