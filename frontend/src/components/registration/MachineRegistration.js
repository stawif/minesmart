import React from "react";
import axios from "axios";
import InputCommonName from "../modular/InputCommonName";

export default class MachineRegistration extends React.Component {
  // Fetch machine list from server
  fetchProduct = async () => {
    try {
      const responseMachineList = await fetch(
        "http://127.0.0.1:8000/list-of-machines/"
      );
      const jsonMachineList = await responseMachineList.json();
      this.state.machineList = jsonMachineList;
    } catch {
      this.toggleLoadStatus();
    }
  };

  // Check existence of machine name
  checkMachine = () => {
    try {
      this.setState({
        machineExistStatus: "",
        responseMessage: "",
        buttonStatus: {
          visibility: "visible"
        }
      });
      const showList = (item, index) => {
        if (this.state.machineName.toLowerCase() === item.name.toLowerCase()) {
          this.setState({
            machineExistStatus: "* This machine name is already exist!!!",
            buttonStatus: {
              visibility: "hidden"
            }
          });
        } else {
        }
      };
      this.state.machineList.forEach(showList);
    } catch (err) {}
  };

  //Form Handler
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/machine-registration/", {
        name: this.state.machineName
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
      machineName: "",
      machineExistStatus: "",
      machineList: {},
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
    this.checkMachine = this.checkMachine.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleLoadStatus = this.toggleLoadStatus.bind(this);

    // Fetch information from server
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
        <p className="headingViewPart">Machine Registration</p>
        <div className="pt-5">
          <InputCommonName
            minLengthh={"5"}
            placeholderParent={"Machine Name"}
            callbackFromParent={dataFromChild => {
              this.state.machineName = dataFromChild;
              this.checkMachine();
            }}
          />
        </div>
        <p>{this.state.machineExistStatus}</p>
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
