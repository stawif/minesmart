import React from 'react';
import Autocomplete from "../entry/AutoComplete";
import './account.css';
import Popup from "reactjs-popup";


class PurchaseDebit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        try {
            const responsePartyList = await fetch(
                "http://127.0.0.1:8000/list-of-purchaseparty/" 
            );
            const jsonPartyList = await responsePartyList.json();
            
            if(jsonPartyList.length > 0){
                this.state.partyNamesFromApi= [];
                jsonPartyList.map(item =>
                    this.setState({
                        partyNamesFromApi: [...this.state.partyNamesFromApi, item.name]
                    }) 
                );
            }
            else{
                this.toggleLoadStatus();
            }
        }
        catch {
        }
    };

  // toggle load status
  toggleLoadStatus = async () => {
    if (this.state.loadingStatus.visibility === "visible") {
      await this.setState({
        loadingStatus: {
          visibility: "hidden"
        },
        loadedStatus: {
          visibility: "visible"
        }
      });
    } else {
      await this.setState({
        loadingStatus: {
          visibility: "visible"
        },
        loadedStatus: {
          visibility: "hidden"
        }
      });
    }
  };
    

  //form Handler Submitting
  onSubmit = async () => {
    const responsDebitDetail = await fetch('http://127.0.0.1:8000/purchase-party-debit/', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "party": this.state.selectedParty
        })
    });        
    const jsonDebitDetail = await responsDebitDetail.json();

    if(jsonDebitDetail.debits.length!=0)
    {
        this.setState({
            minDate: jsonDebitDetail.debits[0].date,
            minFilterDate: jsonDebitDetail.debits[0].date
        });
        this.setState({
            maxDate: jsonDebitDetail.debits.slice(-1)[0].date,
            maxFilterDate: jsonDebitDetail.debits.slice(-1)[0].date    
        });
    } 
    this.setState({
        debitDetail: jsonDebitDetail,
        input:{
            display: "none"
        },
        table:{
            display: "block"
        }
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


    constructor(props){
        super(props);
        this.state= {
            debitDetail: {
                party: "",
                contact: "",
                village: "",
                crasher: "",
                debits: []
            },
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            startDate: null,
            endDate: null,
            currentDebit: [],
            totalDebit: 0,
            selectedParty: "",
            partyNamesFromApi: [],
            input:{
                display: "block"
            },
            table:{
                display: "none"
            },
            loadingStatus: {
                visibility: "visible"
            },
            loadedStatus: {
                visibility: "hidden"
            }
        }
        
        this.fetchProduct= this.fetchProduct.bind(this);
        this.onSubmit= this.onSubmit.bind(this);
        this.setDateFilter= this.setDateFilter.bind(this);
        this.toggleLoadStatus= this.toggleLoadStatus.bind(this);
        this.fetchProduct();
    }

    componentDidMount(){
        this.toggleLoadStatus();
    }

    render(){
        //Clean old data
        this.state.currentDebit=[];
        this.state.totalDebit=0;
        
        //  fill current debit
        this.state.debitDetail.debits.forEach(this.setDateFilter);

        return(
            <div id="mainDiv" className="d-flex justify-content-center align-items-center">
                <div className="tableShow" style={this.state.table}>
                    <div className="upperHeader row">
                        <div className="col-sm-2" onClick={e => {
                            this.setState({
                                minFilterDate: this.state.minDate,
                                maxFilterDate: this.state.maxDate
                            });
                        }}>
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0"><b>{this.state.debitDetail.party}</b></p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-2">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.debitDetail.contact}</p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-2">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.debitDetail.village}</p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-3">
                            <input type="date" min={this.state.minDate} max={this.state.maxDate} value={this.state.minFilterDate} onChange={e => {
                                this.setState({
                                    minFilterDate: e.target.value
                                });
                            }}/>
                        </div>
                        <div className="col-sm-3">
                            <input type="date" min={this.state.minDate} max={this.state.maxDate} value={this.state.maxFilterDate} onChange={e => {
                                this.setState({
                                    maxFilterDate: e.target.value
                                });
                            }}/>
                        </div>
                    </div>
					<div className="highTable">

						<div>
							{/*Party and filter popup*/}
							<Popup modal trigger={
								<button className="bg-primary">Party</button>
	                        } 
							>
							
								<h4 onClick={e => {
                                    this.setState({
                                        minFilterDate: this.state.minDate,
                                        maxFilterDate: this.state.maxDate
                                    });
                                }}>{this.state.debitDetail.party}</h4>
								<h4>{this.state.debitDetail.contact}</h4>
								<h4>{this.state.debitDetail.village}</h4>
								<input type="date" min={this.state.minDate} max={this.state.maxDate} value={this.state.minFilterDate} onChange={e => {
									this.setState({
										minFilterDate: e.target.value
									});
								}}/>

								<input type="date" min={this.state.minDate} max={this.state.maxDate} value={this.state.maxFilterDate} onChange={e => {
									this.setState({
										maxFilterDate: e.target.value
									});
								}}/>
						
							</Popup>
						</div>
					</div>
					<div className="lowerHeader scrollingSection">
						<table className="table table-borderd tablePart">
							<thead className="thead-dark">
								<tr>
									<th>Date</th>
									<th>Debit Amount</th>
									<th>Remark</th>
								</tr>
							</thead>
							<tbody>
								{this.state.currentDebit.map((debit) => (
									<tr>
										<td>{debit.date}</td>
										<td>{debit.debit_amount}</td>
										<td>{debit.remark}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
                    <div className="lowerStrip">
                    <div className="d-flex justify-content-center align-items-center p-0 m-0">
                            <p>Total Debit: {this.state.totalDebit}</p>
                        </div>
                    </div>
				</div>
                <form
                    className="form-container form-group"
                    style={this.state.input}
                >
                    <h3 style={this.state.loadingStatus}>There is no purchase party</h3>
                    <div style={this.state.loadedStatus}>
                        <p className="headingViewPart">Purchase Party Debit</p>
                        <br />

                        <Autocomplete
                            suggestions={this.state.partyNamesFromApi}
                            callbackFromParent={dataFromChild => {
                            this.state.selectedParty = dataFromChild;
                            }}
                            placeholderfrom={"Party name"}
                        />
                        <br />
                        <br />
                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            style={this.state.buttonStatus}
                            onClick={e => this.onSubmit()}>
                        Show
                        </button>
                    </div>    
                </form>
            </div>    
        );
    }
}

export default PurchaseDebit;