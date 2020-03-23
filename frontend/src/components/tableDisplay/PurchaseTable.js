import React from 'react';
import '../../tableDisplayCss.css';
import Popup from "reactjs-popup";
import axios from "axios";

class PurchaseTabel extends React.Component{
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
        const responsPurchaseDetail = await fetch('http://127.0.0.1:8000/purchase-detail/', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                "party": partyName
                })
            });        
        const jsonPurchaseDetail = await responsPurchaseDetail.json();
        this.setState({
            purchaseDetail: jsonPurchaseDetail
        });    
    if(jsonPurchaseDetail.purchase.length!=0)
        {
            this.setState({
                minFilterDate: jsonPurchaseDetail.purchase[0].date
            });
            this.setState({
                maxFilterDate: jsonPurchaseDetail.purchase.slice(-1)[0].date    
            });
            //Set paymentData minToDate
            jsonPurchaseDetail.purchase.every(this.setDateRestriction);

            //Set paymentData maxToDate
            this.setState({
                minToDate: this.state.minToDate,  
                maxToDate: jsonPurchaseDetail.purchase.slice(-1)[0].date
            });
            //this.state.paymentData.maxToDate = jsonPurchaseDetail.work.slice(-1)[0].date;
        }    
    }

    //Push paid and unpaid work objects in different arrays 
    paidFilter = (item, index) =>{
        if(item.paid == true){
            this.state.paidPurchase.push(item);
        }
        else{
            this.state.unpaidPurchase.push(item);
        }
    }

    // Set final showing rows of table currentPurchase
    setDateFilter = (item, index) => {
        if(!this.state.minFilterDate){
            this.state.minFilterDate= this.state.minToDate;
        }
        if(!this.state.maxFilterDate){
            this.state.maxFilterDate= this.state.maxToDate;
        }
        if(this.state.minFilterDate <= item.date && item.date <= this.state.maxFilterDate){
            this.state.currentPurchase.push(item);
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

    //Prepare data for netAmount
    preparePaymentData = (item, index) =>{
        this.state.totalNetAmount= this.state.totalNetAmount + item.net_amount;
        this.state.totalPaid= this.state.totalPaid + item.payment;
        this.state.totalPayment= this.state.totalNetAmount - this.state.totalPaid;
    }
	

    //Form Handler
    onSubmit = e => {
        axios
        .post("http://127.0.0.1:8000/purchase-payment/", {
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
        //e.preventDefault();
    };

    constructor(props){
        super(props);
        this.state = {
            purchaseDetail: {
                name: "",
                contact: "",
                village: "",
                purchase: []
            },
            paidPurchase: [],
            unpaidPurchase: [],
            paidStatus: null,
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            currentPurchase: [],
            material: "",
            quantity: 0,
            netAmount: 0,
            rate: 0,
            totalPayment: 0,
            totalNetAmount: 0,
            totalPaid: 0,
            remark: "",
            buttonStatus: {
                visibility: "hidden"
            },
            paymentData:{
                minToDate: null,
                maxToDate: null,
            }
		
        }
        this.state.currentPurchase= null;
        this.fetchProduct = this.fetchProduct.bind(this);
        this.paidFilter = this.paidFilter.bind(this);
        this.setPaidStatus = this.setPaidStatus.bind(this);
        this.setDateFilter = this.setDateFilter.bind(this);
        this.setPaidStatusNull = this.setPaidStatusNull.bind(this);
        this.preparePaymentData = this.preparePaymentData.bind(this);
        this.setDateRestriction = this.setDateRestriction.bind(this);
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
        this.state.paidPurchase=[];
        this.state.unpaidPurchase=[];
        this.state.currentPurchase=[];

        //Reset total values of lower strip
        this.state.totalNetAmount= 0;
        this.state.totalPaid= 0;
        this.state.totalPayment= 0;

        //Fill different lists
        this.state.purchaseDetail.purchase.forEach(this.paidFilter);

        //Set current work according to radio button choices
        if(this.state.paidStatus==="paid"){
            this.currentPurchaseFromRadio= this.state.paidPurchase;
            this.state.minDate = Object(this.state.paidPurchase[0]).date;
            this.state.maxDate = Object(this.state.paidPurchase.slice(-1)[0]).date;
        }
        else if(this.state.paidStatus==="unpaid"){
            this.currentPurchaseFromRadio= this.state.unpaidPurchase;
            this.state.minDate = Object(this.state.unpaidPurchase[0]).date;
            this.state.maxDate = Object(this.state.unpaidPurchase.slice(-1)[0]).date;
        }
        else{
            this.currentPurchaseFromRadio= this.state.purchaseDetail.purchase;
            this.state.minDate = Object(this.state.purchaseDetail.purchase[0]).date;
            this.state.maxDate = Object(this.state.purchaseDetail.purchase.slice(-1)[0]).date;
        }

        //Fill final list for show(Applying date filter)
        this.currentPurchaseFromRadio.forEach(this.setDateFilter);

        //Prepare netAmount data
        this.state.currentPurchase.forEach(this.preparePaymentData);
		
	

        return(
            <div id="tableComponent">
			
                <div className="row upperTable bg-warning justify-content-center align-items-center">
                  
						<div className="col-sm-2">
							<blockquote className="commonFont blockquote text-center">
								<p className="mb-0" onClick={e => this.setPaidStatusNull()}> <b>{this.props.partyName}</b></p>
							</blockquote>                        
						</div>

						<div className="col-sm-2">
							<blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.purchaseDetail.contact}</p>
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
                            <button className="bg-warning">Party</button>
							
                        } 
						>
							<h4 onClick={e => this.setPaidStatusNull()}>{this.props.partyName}</h4>
                            <h5>{this.state.purchaseDetail.contact}</h5>
						
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
                        {/*netAmount popup*/}
                        <Popup modal trigger={
                            <button className="bg-warning">Remaining</button>
                        }
						>

                        <p>Total Payment= {this.state.totalNetAmount}</p>
                        <p>Total Paid {this.state.totalPaid}</p>
                        <p>Remaining {this.state.totalPayment}</p>
                            <Popup modal trigger={
                                    <button
                                        className="btn btn-outline-dark style"
                                        style={this.state.buttonStatus}>
                                    Payment
                                    </button>
                                    } >
									
                                    <div className="d-flex justify-content-center align-items-center">
									
                                        <form
                                            className="form-container form-group"
                                            onSubmit={e => this.onSubmit(e)}
                                        >
											{this.state.minDate} to {this.state.maxFilterDate}
                                            <p>Need to pay: {this.state.totalPayment}</p>
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

                        </Popup>
                    </div>    

				</div>
				
				<div className="midTable">
                    <table className=" table table-borderd">
                        <thead className="thead-dark">
                            <tr>
                                <th>Paid</th>
                                <th>Date</th>
                                <th>Material</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                                <th>Net Amount</th>
                                <th>Paid</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.currentPurchase.map((purchase) => (
                                <tr>
                                    <td>{<input type="checkbox" checked={purchase.paid}></input>}</td>
                                    <td>{purchase.date}</td>
                                    <td>{purchase.material}</td>
                                    <td>{purchase.quantity}</td>
                                    <td>{purchase.rate}</td>
                                    <td>{purchase.net_amount}</td>
                                    <td>{purchase.payment}</td>
                                    <td>{purchase.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="row lowerTable text-center bg-warning commonFont justify-content-center align-items-center">
                    <div className="col-sm-2">
						<p>Total payment</p>
                    </div>
					
					<div className="col-sm-1">
						<p>{this.state.totalNetAmount}</p>
					</div>

					<div className="col-sm-2">
                        <p>Paid</p>
					</div>
					
					<div className="col-sm-1">
                        <p>{this.state.totalPaid}</p>
					</div>


					<div className="col-sm-2">
                        <p>Remaining</p>
					</div>
					
					<div className="col-sm-1">
                        <p>{this.state.totalPayment}</p>
					</div>

                        <div className="col-sm-3">
                            <Popup modal trigger={
                                <button
                                    className="btn btn-outline-dark"
                                    style={this.state.buttonStatus}>
                                payment
                                </button>   
                            }>
                                <div className="d-flex justify-content-center align-items-center">
                                    <form
                                        className="form-container form-group"
                                        onSubmit={e => this.onSubmit(e)}
                                    >
                                        <h3>Payment</h3>
                                        <br/>
                                        {this.state.minDate} to {this.state.maxFilterDate}
                                        <p>Need to pay : {this.state.totalPayment}</p>
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

export default PurchaseTabel;