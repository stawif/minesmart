import React from "react";
import axios from "axios";
import './entry.css';
import Autocomplete from "./AutoComplete.jsx";
import InputDateField from "../modular/InputDateField";
import InputQuantityField from "../modular/InputQuantityField";

export default class VehicleSupplyEntry extends React.Component {
  //Fetching Products from Database to use them in AutoSugestion and for Checking While Entered Value Exists in Database or Not
  fetchProduct = async () => {
    try {
      const responseItemList = await fetch(
        "http://127.0.0.1:8000/list-of-material/"
      );
      const jsonItemList = await responseItemList.json();

      jsonItemList.map(item => 
        this.setState({ 
          materialNamesFromApi: [...this.state.materialNamesFromApi, item.name] 
        })
      );
    } catch {
      this.toggleLoadStatus();
    }
    
  };


  //Check Existence of item list
  checkItem = dataFromChild => {
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

  // Form Submit Handling
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/enter-vehicle-supply/", {
        material: this.state.selectedItem,
        date: this.state.date,
        quantity: this.state.quantity
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

  constructor(props) {
    super(props);

    this.state = {
      materialNamesFromApi: [],

      date: null,
      selectedItem: "",
      quantity: 0,
      responseMessage: "",
      buttonStatus: {
        visibility: "visible"
      },
      loadingStatus: {
        visibility: "visible"
      },
      loadedStatus: {
        visibility: "hidden"
      }
    };

    this.fetchProduct = this.fetchProduct.bind(this);
    this.checkItem = this.checkItem.bind(this);
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
        <p className="headingViewPart">Vehicle Supply Entry</p>
        <div className="pt-5">
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
      </form>
    );
  }
}
