import React from "react";
import axios from "axios";
import InputPartyNameField from "../modular/InputPartyNameField";
import InputContactField from "../modular/InputContactField";
import InputPartyVillageField from "../modular/InputPartyVillageField";
import InputCommonName from "../modular/InputCommonName";

export default class MachinePartyRegistration extends React.Component {
  fetchProduct = async () => {
    try {
      const responseMachineList = await fetch(
        "http://127.0.0.1:8000/list-of-machineparty/"
      );
      const jsonMachineList = await responseMachineList.json();
      this.state.partyList = jsonMachineList;
    } catch {
      this.toggleLoadStatus();
    }
  };
  // Check existence of party name
  checkParty = () => {
    try {
      this.setState({
        partyExistMessage: "",
        responseMessage: "",
        buttonStatus: {
          visibility: "visible"
        }
      });
      const showList = (item, index) => {
        if (this.state.partyName.toLowerCase() === item.name.toLowerCase()) {
          this.setState({
            partyExistMessage: "* This party name is already exist!!!",
            buttonStatus: {
              visibility: "hidden"
            }
          });
        } else {
        }
      };

      this.state.partyList.forEach(showList);
    } catch (err) {}
  };

  //Form Handler
  onSubmit = e => {
    axios
      .post("http://127.0.0.1:8000/machine-party-registration/", {
        name: this.state.partyName,
        contact: this.state.partyContact,
        village: this.state.partyVillage,
        crasher: this.state.crasher
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
      partyName: "",
      partyContact: "",
      partyVillage: "",
      partyList: {},
      partyExistMessage: "",
      responseMessage: "",
      crasher: "",
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
      <form
        className="form-container form-group"
        onSubmit={e => this.onSubmit(e)}
      >
        <p className="headingViewPart">Machine Party Registration</p>
        <div className="pt-5">
          <InputPartyNameField
            callbackFromParent={dataFromChild => {
              this.state.partyName = dataFromChild;
              this.checkParty();
            }}
          />
          <p>{this.state.partyExistMessage}</p>

          <br />

          <InputContactField
            callbackFromParent={dataFromChild => {
              this.state.partyContact = dataFromChild;
            }}
          />

          <br />
          <br />

          <InputPartyVillageField
            callbackFromParent={dataFromChild => {
              this.state.partyVillage = dataFromChild;
            }}
          />

          <br />
          <br />

          <InputCommonName
            minLength={5}
            placeholderParent={"Crasher"}
            callbackFromParent={dataFromChild => {
              this.state.crasher = dataFromChild;
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
