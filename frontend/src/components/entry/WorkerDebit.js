import React from 'react';
import axios from "axios";
import Autocomplete from './AutoComplete';
import InputCommonName from '../modular/InputCommonName';
import InputDateField from '../modular/InputDateField';
import InputRateField from '../modular/InputRateField';
import InputRemarkField from "../modular/InputRemarkField";

class WorkerDebit extends React.Component{
  //fetching VehicleParty and Vehicles from database
  fetchProduct = async () => {
    try {
      const responseWorkerList = await fetch(
        "http://127.0.0.1:8000/list-of-worker/"
      );
      const jsonWorkerList = await responseWorkerList.json();

      jsonWorkerList.map(item => this.state.workerNamesFromApi.push(item.name));
    } catch {
      this.toggleLoadStatus();
    }
  };

  //form Handler Submitting
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/worker-payment/", {
          name: this.state.name,
          debit_amount: this.state.debitAmount,
          date: this.state.date,
          remark: this.state.remark
      })
      .then(res => {
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

  constructor(props){
        super(props);
        this.state={
            name: "",
            debitAmount: 0,
            date: null,
            remark: "",
            workerNamesFromApi: [],
            responseMessage: ""
        }

        this.fetchProduct= this.fetchProduct.bind(this);
        this.onSubmit= this.onSubmit.bind(this);
        
        this.fetchProduct();
    }    

    render(){
        return(
            <form
            className="form-container form-group"
            onSubmit={e => this.onSubmit(e)} >
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

                <InputRateField 
                        placeholderParent="Debit Amount"
                        callbackFromParent= {
                        dataFromPrent =>{
                            this.state.debitAmount= dataFromPrent
                        } 
                    }
                />

                <br/>
                <br/>

                <InputDateField
                    callbackFromParent= {
                        dataFromPrent =>{
                            this.state.date= dataFromPrent
                        } 
                    }
                />

                <br/>
                <br/>          

                <InputRemarkField 
                    callbackFromParent= {
                        dataFromPrent =>{
                            this.state.remark= dataFromPrent
                        } 
                    }
                />
                <p>{this.state.responseMessage}</p>
                <button
                type="submit"
                className="btn btn-outline-dark"
                >
                Save
                </button>
            </form>
        );
    };
}

export default WorkerDebit;