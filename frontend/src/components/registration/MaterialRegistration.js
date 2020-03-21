import React from "react";
import axios from "axios";
import InputQuantityField from "../modular/InputQuantityField";
import InputCommonName from "../modular/InputCommonName";
import InputRateField from "../modular/InputRateField";

export default class MaterialRegistration extends React.Component {
  // Fetch material list from server
  fetchProduct = async () => {
    try {
      const responseItemList = await fetch(
        "http://127.0.0.1:8000/list-of-material/"
      );
      const jsonItemList = await responseItemList.json();
      this.state.materialList = jsonItemList;
    } catch {
      this.toggleLoadStatus();
    }
  };

  // Check existence of material name
  checkMaterial = () => {
    try {
      this.setState({
        materialExistMessage: "",
        responseMessage: "",
        buttonStatus: {
          visibility: "visible"
        }
      });
      const showList = (item, index) => {
        if (this.state.materialName.toLowerCase() === item.name.toLowerCase()) {
          this.setState({
            materialExistMessage: "* This material name is already exist!!!",
            buttonStatus: {
              visibility: "hidden"
            }
          });
        } else {
        }
      };
      this.state.materialList.forEach(showList);
    } catch (err) {}
  };

  //Form Handler
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/material-registration/", {
        name: this.state.materialName,
        measurement: this.state.materialMeasurement,
        quantity: this.state.materialQuantity
      })
      .then(res => {
        this.fetchProduct();
        this.setState({
          responseMessage: res.data
        });
      })
      .catch(error => {
        // alert(error.response.request._response);
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
      materialName: "",
      materialMeasurement: "",
      materialQuantity: 0,
      materialList: {},
      materialExistMessage: "",
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
          <p className="headingViewPart">Material Registration</p>
          <div className="pt-5">
            <InputCommonName
              minLengthh={"2"}
              placeholderParent={"Material Name"}
              callbackFromParent={dataFromChild => {
                this.state.materialName = dataFromChild;
                this.checkMaterial();
              }}
            />

            <p>{this.state.materialExistMessage}</p>
            <br />
            <InputCommonName
              minLengthh={"2"}
              callbackFromParent={dataFromChild => {
                this.state.materialMeasurement = dataFromChild;
              }}
              placeholderParent={"Measurement"}
            />

            <br />
            <br />

            <InputQuantityField
              placeholder={"Quantity"}
              callbackFromParent={dataFromChild => {
                this.state.materialQuantity = dataFromChild;
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
