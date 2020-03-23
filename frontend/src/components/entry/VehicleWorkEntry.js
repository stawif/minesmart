import React from "react";
import axios from "axios";
import Autocomplete from "./AutoComplete.jsx";
import InputDateField from "../modular/InputDateField";
import InputRemarkField from "../modular/InputRemarkField";
import InputRateField from "../modular/InputRateField.js";

export default class VehicleWorkEntry extends React.Component {
  //fetching VehicleParty and Vehicles from database
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

  // Check existence of party name
  checkParty = dataFromChild => {
    try {
      this.setState({
        responseMessage: "",
        buttonStatus: {
          visibility: "hidden"
        }
      });
      const showList = (item, index) => {
        if (dataFromChild.toLowerCase() === item.toLowerCase()) {
          this.setState({
            buttonStatus: {
              visibility: "visible"
            }
          });
        } else {
        }
      };
      this.state.partyNamesFromApi.forEach(showList);
    } catch (err) {}
  };

  //Form Handler Function
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/enter-vehicleparty-work/", {
        party: this.state.selectedParty,
        date: this.state.date,
        feet: (this.state.feet/12),
        five_feet: this.state.fiveFeet,
        two_half_feet: this.state.twoHalfFeet,
        remark: this.state.remark,
        payment: this.state.payment
      })
      .then(res => {
        this.fetchProduct();
        this.setState({
          responseMessage: res.data
        });
      })
      .catch(error => {
        alert(error.response.request._response);
      });

    e.target.reset();
    e.preventDefault();
  };

  // toggle load status
  toggleLoadStatus = async () => {
    if (this.state.loadingStatus.display === "block") {
      await this.setState({
        loadingStatus: {
          display: "none"
        },
        loadedStatus: {
          display: "block"
        }
      });
    } else {
      await this.setState({
        loadingStatus: {
          display: "block"
        },
        loadedStatus: {
          display: "none"
        }
      });
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      partyNamesFromApi: [],

      date: null,
      payment: 0,

      selectedParty: "",
      remark: "",
      feet: 0,
      fiveFeet: 0,
      twoHalfFeet: 0,
      responseMessage: "",
      buttonStatus: {
        visibility: "visible"
      },
      radioButtonStyle: {
        float: "left"
      },
      loadingStatus: {
        display: "block"
      },
      loadedStatus: {
        display: "none"
      }
    };

    this.fetchProduct = this.fetchProduct.bind(this);
    this.checkParty = this.checkParty.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
    this.toggleLoadStatus = this.toggleLoadStatus.bind(this);
    this.fetchProduct();
  }

  componentDidMount() {
    this.toggleLoadStatus();
  }
  render() {
    return (
      <div id="mainComponent">
        <div className="d-flex justify-content-center align-items-center scrollingSection">
          <form
            className="form-container form-group"
            onSubmit={e => this.onSubmit(e)}
          >
            <h3 style={this.state.loadingStatus}>There is no vehicle party</h3>
            <div style={this.state.loadedStatus}>
              <p className="headingViewPart">Vehicle Work Entry</p>
              <div className="pt-5">
                <Autocomplete
                  suggestions={this.state.partyNamesFromApi}
                  callbackFromParent={dataFromChild => {
                    this.state.selectedParty = dataFromChild;
                  }}
                  checkFromParent={this.checkParty}
                  placeholderfrom={"Party name"}
                />
                <p>{this.state.partyExistMessage}</p>

                <br />

                <InputDateField
                  callbackFromParent={dataFromChild => {
                    this.state.date = dataFromChild;
                  }}
                />

                <br />
                <br />

                <InputRemarkField
                  callbackFromParent={dataFromChild => {
                    this.state.remark = dataFromChild;
                  }}
                />

                <br />
                <br />

                <InputRateField
                  callbackFromParent={dataFromChild => {
                    this.state.feet = dataFromChild;
                  }}
                  placeholderParent={"Feet (inch)"}
                />

                <br />
                <br />

                <InputRateField
                  callbackFromParent={dataFromChild => {
                    this.state.fiveFeet = dataFromChild;
                  }}
                  placeholderParent={"5 Feet"}
                />

                <br />
                <br />
                <InputRateField
                  callbackFromParent={dataFromChild => {
                    this.state.twoHalfFeet = dataFromChild;
                  }}
                  placeholderParent={"2.5 Feet"}
                />
                <br />
                <br />
                <InputRateField
                  placeholderParent={"Payment Received"}
                  callbackFromParent={dataFromChild => {
                    this.state.payment = dataFromChild;
                  }}
                />
              </div>
              <p>{this.state.responseMessage}</p>
              <button
                type="submit"
                className="btn btn-outline-dark"
                style={this.state.buttonStatus}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>  
    );
  }
}
