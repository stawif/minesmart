import React from "react";
import axios from "axios";
import './entry.css';
import Autocomplete from "./AutoComplete.jsx";
import InputDateField from "../modular/InputDateField";
import InputQuantityField from "../modular/InputQuantityField";
export default class MachineSupplyEntry extends React.Component {
  //Fetching Products from database
  fetchProduct = async () => {
    try {
      const responseMachineList = await fetch(
        "http://127.0.0.1:8000/list-of-machineparty/"
      );
      const jsonMachineList = await responseMachineList.json();

      const responseMaterialList = await fetch(
        "http://127.0.0.1:8000/list-of-material/"
      );
      const jsonMaterialList = await responseMaterialList.json();
      
      if(jsonMachineList.length > 0 && jsonMaterialList.length > 0){
        this.state.partyNamesFromApi= [];
        jsonMachineList.map(item =>
          this.setState({
            partyNamesFromApi: [...this.state.partyNamesFromApi, item.name]
          }) 
        );
        
        this.state.materialNamesFromApi= [];
        jsonMaterialList.map(item =>
          this.setState({ 
            materialNamesFromApi: [...this.state.materialNamesFromApi, item.name] 
          })
        );

        this.setState({
          selectedMaterial: this.state.materialNamesFromApi[0]
        });
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

  //Check Existance of Material Names
  checkMaterial = dataFromChild => {
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
      this.state.materialNamesFromApi.forEach(showList);
    } catch (err) {}
  };

  //Form Handler
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/enter-machine-supply/", {
        party: this.state.selectedParty,
        material: this.state.selectedMaterial,
        date: this.state.date,
        quantity: this.state.quantity,
        drilling_feet: this.state.drillingfeet
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
      materialNamesFromApi: [],
      drillingfeet: 0,
      date: null,
      selectedParty: "",
      selectedMaterial: "",
      quantity: 0,
      responseMessage: "",
      buttonStatus: {
        visibility: "visible"
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
    this.checkMaterial = this.checkMaterial.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleLoadStatus = this.toggleLoadStatus.bind(this);
    this.fetchProduct();
  }

  componentDidMount() {
    this.toggleLoadStatus();
  }

  render() {
    return (
      <form
        className="form-container form-group"
        onSubmit={e => this.onSubmit(e)}
      >
        <h3 style={this.state.loadingStatus}>There is no machine party or material</h3>
        <div style={this.state.loadedStatus}>
          <p className="headingViewPart">Machine Supply Entry</p>
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

            <select onChange={e => this.state.selectedMaterial=e.target.value}>
                  {this.state.materialNamesFromApi.map((item) => (
                      <option value={item}>{item}</option>
                  ))}
            </select> 

            <br />
            <br />

            <InputDateField
              callbackFromParent={dataFromChild => {
                this.state.date = dataFromChild;
              }}
            />
            <br />
            <br />

            <InputQuantityField
              placeholder="Drilling Feet"
              callbackFromParent={dataFromChild => {
                this.state.drillingfeet = dataFromChild;
              }}
            />
            <br />
            <br />
            <InputQuantityField
              placeholder={"Quantity"}
              callbackFromParent={dataFromChild => {
                this.state.quantity = dataFromChild;
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
    );
  }
}
