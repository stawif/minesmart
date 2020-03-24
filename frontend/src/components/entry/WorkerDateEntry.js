import React from 'react';
import axios from "axios";
import Autocomplete from './AutoComplete';
import InputCommonName from '../modular/InputCommonName';
import InputDateField from '../modular/InputDateField';
import InputRateField from '../modular/InputRateField';
import InputRemarkField from "../modular/InputRemarkField";
 class WorkerDate extends React.Component{
  //fetching VehicleParty and Vehicles from database
  fetchProduct = async () => {
    try {
      const responseWorkerList = await fetch(
        "http://127.0.0.1:8000/list-of-worker/"
      );
      const jsonWorkerList = await responseWorkerList.json();
      
      if(jsonWorkerList.length > 0){
        this.state.workerNamesFromApi= [];
        jsonWorkerList.map(item => 
          this.setState({
            workerNamesFromApi: [...this.state.workerNamesFromApi, item.name]
          })
        );
      }
      else{
        this.toggleLoadStatus();
      }
    } 
    catch {}
  };

  //form Handler Submitting
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/enter-worker-start-date/", {
          name: this.state.name,
          start_date: this.state.date
      })
      .then(res => {
        this.fetchProduct();
        this.setState({
          responseMessage: res.data
        });
      })
      .catch(error => {
        console.log(error.response.request._response);
      });

    e.target.reset();
    e.preventDefault();
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

  componentDidMount() {
    this.toggleLoadStatus();
  }
  constructor(props){
        super(props);
        this.state={
            name: "",
            date: null,
            workerNamesFromApi: [],
            responseMessage: "",
            loadingStatus: {
              visibility: "visible"
            },
            loadedStatus: {
              visibility: "hidden"
            }
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.onSubmit= this.onSubmit.bind(this);
        this.toggleLoadStatus= this.toggleLoadStatus.bind(this);
        
        this.fetchProduct();
    }    

    render(){
        return(
            <form
            className="form-container form-group"
            onSubmit={e => this.onSubmit(e)} >
              <h3 style={this.state.loadingStatus}>There is no worker currently</h3>
              <div style={this.state.loadedStatus}>
                <p className="headingViewPart">Worker Debit Entry</p>
                <br />
                <Autocomplete
                    suggestions={this.state.workerNamesFromApi}
                    placeholderfrom={"Worker Name"}
                    callbackFromParent= {
                        dataFromPrent =>{
                            this.state.name= dataFromPrent
                        } 
                    }
                />

                <br/>
                <br/>

                <InputDateField 
                    callbackFromParent= {
                        dataFromPrent=> {
                            this.state.date= dataFromPrent
                        }
                    }
                />

                <br/>        
                <p>{this.state.responseMessage}</p>
                <button
                type="submit"
                className="btn btn-outline-dark"
                >
                Save
                </button>
              </div>  
            </form>
            
        );
    };
}

export default WorkerDate;