import React from "react";
import axios from "axios";
import InputCommonName from "../modular/InputCommonName";

export default class VehicleRegistration extends React.Component {
  // Fetch vehicle list from server
  fetchProduct = async () => {
    try {
      const responseVehicleList = await fetch(
        "http://127.0.0.1:8000/list-of-vehicles/"
      );
      const jsonVehicleList = await responseVehicleList.json();
      this.state.vehicleList = jsonVehicleList;
    } catch {
      this.toggleLoadStatus();
    }
  };

  // Check existence of vehicle name
  checkVehicle = () => {
    try {
      this.setState({
        vehicleExistStatus: "",
        responseMessage: "",
        buttonStatus: {
          visibility: "visible"
        }
      });
      const showList = (item, index) => {
        if (this.state.vehicleName.toLowerCase() === item.name.toLowerCase()) {
          this.setState({
            vehicleExistStatus: "* This vehicle name is already exist!!!",
            buttonStatus: {
              visibility: "hidden"
            }
          });
        } else {
        }
      };
      this.state.vehicleList.forEach(showList);
    } catch (err) {}
  };

  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/vehicle-registration/", {
        name: this.state.vehicleName
      })
      .then(res => {
        this.fetchProduct();
        this.setState({
          responseMessage: res.data
        });
      })
      .catch(error => {});
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
      vehicleName: "",
      vehicleExistStatus: "",
      vehicleList: {},
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
    this.checkVehicle = this.checkVehicle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleLoadStatus = this.toggleLoadStatus.bind(this);

    //Fetch data from server
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
        <p className="headingViewPart">Vehicle Registration</p>
        <div className="pt-5">
          <InputCommonName
            minLengthh={5}
            placeholderParent={"Vehicle Name"}
            callbackFromParent={dataFromChild => {
              this.state.vehicleName = dataFromChild;
              this.checkVehicle()
            }}
            
          />
        </div>
        <p>{this.state.vehicleExistStatus}</p>
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
