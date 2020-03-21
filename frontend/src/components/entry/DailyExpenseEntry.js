import React from 'react';
import axios from "axios";
import InputDateField from '../modular/InputDateField';
import InputRateField from '../modular/InputRateField';
import InputRemarkField from '../modular/InputRemarkField';

class DailyExpenseEntry extends React.Component{
  //form Handler Submitting
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/enter-daily-expense/", {
          expense: this.state.expense,
          date: this.state.date,
          remark: this.state.remark,
          category: this.state.category
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
            expense: 0,
            date: null,
            remark: "",
            category: "",
            responseMessage: ""
        }

        this.onSubmit= this.onSubmit.bind(this);
    }    

    render(){
        return(
            <form
            className="form-container form-group"
            onSubmit={e => this.onSubmit(e)} >
                <p className="headingViewPart">Daily Expense Entry</p>

                <br />    
                <InputRateField 
                        placeholderParent="Expense"
                        callbackFromParent= {
                        dataFromPrent =>{
                            this.state.expense= dataFromPrent
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

                <br/>
                <br/>          
                
                <select onChange={e => this.state.category=e.target.value}>
                    <option value="staff">Staff</option>
                    <option value="petrol">Petrol</option>
                    <option value="food">Food</option>
                    <option value="office_accesories">Office Accesories</option>
                    <option value="other">Others</option>
                </select>                
                
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

export default DailyExpenseEntry;

