import React from "react";
import axios from "axios";
import InputContactField from "../modular/InputContactField";
import InputDateField from "../modular/InputDateField";
import InputCommonName from "../modular/InputCommonName";
import InputPartyVillageField from "../modular/InputPartyVillageField";
import InputRateField from "../modular/InputRateField";
export default class WorkerRegistration extends React.Component {
  // Fetch vehicle list from server
  fetchProduct = async () => {
    try {
      const responseWorkerList = await fetch(
        "http://127.0.0.1:8000/list-of-worker/"
      );
      const jsonWorkerList = await responseWorkerList.json();
      this.state.workerList = jsonWorkerList;
    } catch {
      this.toggleLoadStatus();
    }
  };

  // Check existence of vehicle name
  checkWorker = () => {
    try {
      this.setState({
        workerExistMessage: "",
        responseMessage: "",
        buttonStatus: {
          visibility: "visible"
        }
      });
      const showList = (item, index) => {
        if (this.state.workerName.toLowerCase() === item.name.toLowerCase()) {
          this.setState({
            workerExistMessage: "* This worker name is already exist!!!",
            buttonStatus: {
              visibility: "hidden"
            }
          });
        } else {
        }
      };
      this.state.workerList.forEach(showList);
    } catch (err) {}
  };

  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/worker-registration/", {
        name: this.state.workerName,
        contact: this.state.workerContact,
        village: this.state.workerVillage,
        salary: this.state.workerSalary,
        advance: this.state.advance
      })
      .then(res => {
        this.fetchProduct();
        this.setState({
          responseMessage: res.data
        });
      })
      .catch(error => {
        //console.log(error.response.request._response);
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
      workerName: "",
      workerContact: "",
      workerVillage: "",
      workerSalary: 0,
      advance: 0,
      workerList: {},
      workerExistMessage: "",
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
    this.checkWorker = this.checkWorker.bind(this);
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
        <p className="headingViewPart">Worker Registration</p>
        <div className="pt-5">
          <InputCommonName
            minLengthh={3}
            placeholderParent={"Worker Name"}
            callbackFromParent={dataFromChild => {
              this.state.workerName = dataFromChild;
              this.checkWorker();
            }}
          />

          <p>{this.state.workerExistMessage}</p>
          <br />
          
          <InputContactField
            callbackFromParent={dataFromChild => {
              this.state.workerContact = dataFromChild;
            }}
          />

          <br />
          <br />

          <InputPartyVillageField
            callbackFromParent={dataFromChild => {
              this.state.workerVillage = dataFromChild;
            }}
          />

          <br />
          <br />

          <InputRateField
            placeholderParent={"Worker Salary"}
            callbackFromParent={dataFromChild => {
              this.state.workerSalary = dataFromChild;
            }}
          />
          <br />
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
