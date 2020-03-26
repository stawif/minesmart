import React from 'react';
import axios from "axios";
import Autocomplete from "../entry/AutoComplete";
import '../account/account.css';
import Popup from "reactjs-popup";
import '../../tableDisplayCss.css';
class WorkerDateDisplay extends React.Component{
    // Fetch machine list from server
    fetchProduct = async () => {
        try {
            const responsePartyList = await fetch(
                "http://127.0.0.1:8000/list-of-worker/" 
            );
            const jsonPartyList = await responsePartyList.json();
            if(jsonPartyList.length > 0){
                this.state.workerNamesFromApi= [];
                jsonPartyList.map(item => 
                    this.setState({
                        workerNamesFromApi: [...this.state.workerNamesFromApi, item.name]
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
    const responseDateDetail = await fetch('http://127.0.0.1:8000/worker-date-detail/', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "name": this.state.selectedWorker
        })
    });        
    const jsonDateDetail = await responseDateDetail.json();
    this.setState({
        dateDetail: jsonDateDetail,
        input:{
            display: "none"
        },
        table:{
            display: "block"
        }
    });
  };

  //Update end date
  updateEndDate = (worker_date_id) =>{
    axios
    .post("http://127.0.0.1:8000/enter-worker-end-date/", {
        worker_date_id: worker_date_id,
        end_date: this.state.end_date
    })
    .then(res => {
        this.onSubmit();
        this.setState({
        responseMessage: res.data
      });
    })
    .catch(error => {
    });
};


    constructor(props){
        super(props);
        this.state= {
            dateDetail: {
                name: "",
                contact: "",
                village: "",
                date: []
            },
            currentDate: [],
            end_date: null,
            selectedWorker: "",
            workerNamesFromApi: [],
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
        this.updateEndDate= this.updateEndDate.bind(this);
        this.toggleLoadStatus= this.toggleLoadStatus.bind(this);
        this.fetchProduct();
    }

    componentDidMount(){
        this.toggleLoadStatus();
    }

    render(){

        return(
            <div id="mainDiv" className="d-flex justify-content-center align-items-center scrollingSection">
                <div className="tableShow" style={this.state.table}>
                    <div className="upperHeader row">
                        <div className="col-sm-4">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0"><b>{this.state.dateDetail.name}</b></p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-4">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.dateDetail.contact}</p>
							</blockquote>                        
                        </div>
                        <div className="col-sm-4">
                            <blockquote className="commonFont blockquote text-center">
								<p className="mb-0">{this.state.dateDetail.village}</p>
							</blockquote>                        
                        </div>
                    </div>
					<div className="highTable">

						<div>
							{/*Party and filter popup*/}
							<Popup modal trigger={
								<button className="bg-primary">Party</button>
	                        } 
							>
							
								<h4>{this.state.dateDetail.name}</h4>
								<h4>{this.state.dateDetail.contact}</h4>
								<h4>{this.state.dateDetail.village}</h4>
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
									<th>Start Date</th>
									<th>End Date</th>
                                    <th>Update End Date</th>
								</tr>
							</thead>
							<tbody>
								{this.state.dateDetail.date.map((date) => (
									<tr>
										<td>{date.start_date}</td>
										<td onClick={e => this.updateEndDate(date.worker_date_id,date.end_date)}>{date.end_date}</td>
                                        <Popup modal trigger={
                                        <button
                                            className="btn btn-outline-dark"
                                            style={this.state.buttonStatus}>
                                                Update
                                            </button>   
                                        }>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <input type="date" onChange={e => {this.state.end_date = e.target.value}}/>
                                                <button onClick={e => {this.updateEndDate(date.worker_date_id)}}>
                                                    Update
                                                </button>
                                            </div>
                                        </Popup>    
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
                    <h3 style={this.state.loadingStatus}>There is no worker</h3>
                    <div style={this.state.loadedStatus}>
                        <p className="headingViewPart">Worker Dates</p>
                        <br />

                        <Autocomplete
                            suggestions={this.state.workerNamesFromApi}
                            callbackFromParent={dataFromChild => {
                            this.state.selectedWorker = dataFromChild;
                            }}
                            placeholderfrom={"Worker Name"}
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

export default WorkerDateDisplay;