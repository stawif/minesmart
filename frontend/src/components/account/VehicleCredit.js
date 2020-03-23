import React from 'react';
import Autocomplete from "../entry/AutoComplete";
import './account.css';
import Popup from "reactjs-popup";

class VehicleCredit extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        try {
            const responsePartyList = await fetch(
                "http://127.0.0.1:8000/list-of-vehicleparty/" 
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
        catch {}
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
    const responsCreditDetail = await fetch('http://127.0.0.1:8000/vehicle-party-credit/', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "party": this.state.selectedParty
        })
    });        
    const jsonCreditDetail = await responsCreditDetail.json();

    if(jsonCreditDetail.credits.length!=0)
    {
        this.setState({
            minDate: jsonCreditDetail.credits[0].date
        });
        this.setState({
            maxDate: jsonCreditDetail.credits.slice(-1)[0].date    
        });
    } 
    this.setState({
        creditDetail: jsonCreditDetail,
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
            this.state.currentCredit.push(item);
        }
    }


    constructor(props){
        super(props);
        this.state= {
            creditDetail: {
                party: "",
                contact: "",
                village: "",
                crasher: "",
                credits: []
            },
            minDate: null,
            maxDate: null,
            minFilterDate: null,
            maxFilterDate: null,
            startDate: null,
            endDate: null,
            currentCredit: [],
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
        this.state.currentCredit=[];
        
        //  fill current credit
        this.state.creditDetail.credits.forEach(this.setDateFilter);

        return(
            <div id="mainDiv" className="d-flex justify-content-center align-items-center scrollingSection">
                <div className="tableShow" style={this.state.table}>
                    <div className="upperHeader row">
                        <div className="col-sm-2">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0"><b>{this.state.creditDetail.party}</b></p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-2">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.creditDetail.contact}</p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-2">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.creditDetail.village}</p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-3">
                            <input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
                                this.setState({
                                    minFilterDate: e.target.value
                                });
                            }}/>
                        </div>
                        <div className="col-sm-3">
                            <input type="date" min={this.state.minDate} max={this.state.maxDate} onChange={e => {
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
							
								<h4>{this.state.creditDetail.party}</h4>
								<h4>{this.state.creditDetail.contact}</h4>
								<h4>{this.state.creditDetail.village}</h4>
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
					</div>
					<div className="lowerHeader">
						<table className="table table-borderd tablePart">
							<thead className="thead-dark">
								<tr>
									<th>Date</th>
									<th>Credit Amount</th>
									<th>Remark</th>
								</tr>
							</thead>
							<tbody>
								{this.state.currentCredit.map((credit) => (
									<tr>
										<td>{credit.date}</td>
										<td>{credit.credit_amount}</td>
										<td>{credit.remark}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
                <form
                    className="form-container form-group"
                    style={this.state.input}
                >
                    <h3 style={this.state.loadingStatus}>There is no vehicle party</h3>
                    <div style={this.state.loadedStatus}>
                        <p className="headingViewPart">Vehicle Party Credit</p>
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

export default VehicleCredit;