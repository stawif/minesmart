import React, { useState, useEffect } from "react";
import "./homePage.css";
import MachineRegistration from "./components/registration/MachineRegistration";
import VehicleRegistration from "./components/registration/VehicleRegistration";
import MaterialRegistration from "./components/registration/MaterialRegistration";
import WorkerRegistration from "./components/registration/WorkerRegistration";
import MachinePartyRegistration from "./components/registration/MachinePartyRegistration";
import VehiclePartyRegistration from "./components/registration/VehiclePartyRegistration";
import PurchasePartyRegistration from "./components/registration/PurchasePartyRegistration";
import MachineWorkEntry from "./components/entry/MachineWorkEntry";
import VehicleWorkEntry from "./components/entry/VehicleWorkEntry";
import PurchaseEntry from "./components/entry/PurchaseEntry";
import MachineSupplyEntry from "./components/entry/MachineSupplyEntry";
import VehicleSupplyEntry from "./components/entry/VehicleSupplyEntry";
import DailyWorkEntry from "./components/entry/DailyWorkEntry";
import MachineDisplay from "./components/displaydata/MachineDisplay";
import VehicleDisplay from "./components/displaydata/VehicleDisplay";
import WorkerDisplay from "./components/displaydata/WorkerDisplay";
import MaterialDisplay from "./components/displaydata/MaterialDisplay";
import MachinePartyDisplay from "./components/displaydata/MachinePartyDisplay";
import VehiclePartyDisplay from "./components/displaydata/VehiclePartyDisplay";
import PurchasePartyDisplay from "./components/displaydata/PurchasePartyDisplay";
import PartEntry from './components/entry/PartEntry';
import OwnerDebitEntry from './components/entry/OwnerDebitEntry';
import DailyExpenseEntry from './components/entry/DailyExpenseEntry';
import WorkerDebitEntry from './components/entry/WorkerDebit';
import MachineSupplyDisplay from './components/displaydata/MachineSupplyDisplay';
import VehiclesupplyDisplay from './components/displaydata/VehicleSupplyDisplay';
import WorkerDateEntry from './components/entry/WorkerDateEntry';

//Display section
import WorkerDateDisplay from './components/displaydata/WorkerDateDisplay';

//Accounts
import MachineCredit from "./components/account/MachineCredit";
import VehicleCredit from './components/account/VehicleCredit';
import PurchaseDebit from './components/account/PurchaseDebit';
import DailyExpenseDebit from './components/account/DailyExpenseDebit';
import PartDebit from "./components/account/PartDebit";
import OwnerDebit from './components/account/OwnerDebit';
import WorkerDebit from './components/account/WorkerDebit';
import DailyWorkCredit from './components/account/DailyWorkCredit';
import Credit from './components/account/Credit';
import Debit from './components/account/Debit';
import AllTransaction from './components/account/AllTransaction';

//Tables Components
import MachineWorkTable from "./components/tableDisplay/MachineWorkTable";
import VehicleWorkTable from "./components/tableDisplay/VehicleWorkTable";
import PurchaseTable from "./components/tableDisplay/PurchaseTable";

//Dashboard components
import PartyPins from "./components/dashboard/PartyPins";
import VehicleSupplyDisplay from "./components/displaydata/VehicleSupplyDisplay";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPages: {
        machineReg: "machineRegisration",
        vehicleReg: "vehicleRegistration",
        materialReg: "materialRegistration",
        machinePartyReg: "machinePartyRegistration",
        vehiclePartyReg: "vehiclePartyRegistration",
        purchasePartyReg: "purchasePartyRegistration",
        workerReg: "workerRegistration",
        addMachineWork: "addMachineWork",
        addVehicleWork: "addVehicleWork",
        addPurchaseDetail: "addPurchaseDetail",
        addMachineSupply: "addMachineSupply",
        addVehicleSupply: "addVehicleSupply",
        addDailyWork: "addDailyWork",
        machineDisplay: "machineDisplay",
        vehicleDisplay: "vehicleDisplay",
        workerDisplay: "workerDisplay",
        materialDisplay: "materialDisplay",
        machinePartyDisplay: "machinePartyDisplay",
        vehiclePartyDisplay: "vehiclePartyDisplay",
        purchasePartyDisplay: "purchasePartyDisplay",
        machineWorkTable: "machineWorkTable",
        vehicleWorkTable: "vehicleWorkTable",
        purchaseTable: "purchaseTable",
        partEntry: "partEntry",
        ownerDebitEntry: "ownerDebitEntry",
        dailyExpenseEntry: "dailyExpenseEntry",
        workerDebitEntry: "workerDebitEntry",
        machineCredit: "machineCredit",
        vehicleCredit: "vehicleCredit",
        purchaseDebit: "purchaseDebit",
        dailyExpenseDebit: "dailyExpenseDebit",
        partDebit: "partDebit",
        ownerDebit: "ownerDebit",
        workerDebit: "workerDebit",
        dailyWorkCredit: "dailyWorkCredit",
        credit: "credit",
        debit: "debit",
        machineSupplyDisplay: "machineSupplyDisplay",
        vehicleSupplyDisplay: "vehicleSupplyDisplay",
        workerDateEntry: "workerDateEntry",
        workerDateDisplay: "workerDateDisplay",
        allTransaction: "allTransaction" 
      },
      partyName: "",
      currentPage: "machineRegistration"
    };

    this.updateCurrentPage = this.updateCurrentPage.bind(this);
    this.UpdateCurrentPageDashboard = this.UpdateCurrentPageDashboard.bind(this);
  }

  // Change pages when user choose from navbar
  updateCurrentPage = async choosePage => {
    console.log("choosePage : " + choosePage);
    await this.setState({
      currentPage: choosePage
    });
  };

  UpdateCurrentPageDashboard = async (choosePage,partyName) => {
    console.log("choosePage : " + choosePage);
    await this.setState({
      currentPage: choosePage,
      partyName: partyName
    });
  }

  render() {
    let currentComponent;
    if (this.state.currentPage === this.state.allPages.machineReg) {
      currentComponent = <MachineRegistration />;
    } else if (this.state.currentPage === this.state.allPages.vehicleReg) {
      currentComponent = <VehicleRegistration />;
    } else if (this.state.currentPage === this.state.allPages.materialReg) {
      currentComponent = <MaterialRegistration />;
    } else if (this.state.currentPage === this.state.allPages.machinePartyReg) {
      currentComponent = <MachinePartyRegistration />;
    } else if (this.state.currentPage === this.state.allPages.vehiclePartyReg) {
      currentComponent = <VehiclePartyRegistration />;
    } else if (
      this.state.currentPage === this.state.allPages.purchasePartyReg
    ) {
      currentComponent = <PurchasePartyRegistration />;
    } else if (this.state.currentPage === this.state.allPages.addMachineWork) {
      currentComponent = <MachineWorkEntry />;
    } else if (this.state.currentPage === this.state.allPages.addVehicleWork) {
      currentComponent = <VehicleWorkEntry />;
    } else if (
      this.state.currentPage === this.state.allPages.addPurchaseDetail
    ) {
      currentComponent = <PurchaseEntry />;
    } else if (this.state.currentPage === this.state.allPages.workerReg) {
      currentComponent = <WorkerRegistration />;
    } else if (
      this.state.currentPage === this.state.allPages.addMachineSupply
    ) {
      currentComponent = <MachineSupplyEntry />;
    } else if (
      this.state.currentPage === this.state.allPages.addVehicleSupply
    ) {
      currentComponent = <VehicleSupplyEntry />;
    } else if (this.state.currentPage === this.state.allPages.addDailyWork) {
      currentComponent = <DailyWorkEntry />;
    } else if (this.state.currentPage === this.state.allPages.machineDisplay) {
      currentComponent = <MachineDisplay />;
    } else if (this.state.currentPage === this.state.allPages.vehicleDisplay) {
      currentComponent = <VehicleDisplay />;
    } else if (this.state.currentPage === this.state.allPages.workerDisplay) {
      currentComponent = <WorkerDisplay />;
    } else if (this.state.currentPage === this.state.allPages.materialDisplay) {
      currentComponent = <MaterialDisplay />;
    } else if (this.state.currentPage === this.state.allPages.machinePartyDisplay) {
      currentComponent = <MachinePartyDisplay />;
    } else if (this.state.currentPage === this.state.allPages.vehiclePartyDisplay) {
      currentComponent = <VehiclePartyDisplay />;
    } else if (this.state.currentPage === this.state.allPages.purchasePartyDisplay) {
      currentComponent = <PurchasePartyDisplay />;
    } else if (this.state.currentPage === this.state.allPages.machineWorkTable) {
      currentComponent = <MachineWorkTable partyName={this.state.partyName}/>;
    } else if (this.state.currentPage === this.state.allPages.vehicleWorkTable){
      currentComponent = <VehicleWorkTable partyName={this.state.partyName}/>
    } else if (this.state.currentPage === this.state.allPages.purchaseTable){
      currentComponent = <PurchaseTable  partyName={this.state.partyName}/>
    } else if(this.state.currentPage === this.state.allPages.partEntry){
      currentComponent = <PartEntry />;
    } else if(this.state.currentPage === this.state.allPages.ownerDebitEntry){
      currentComponent = <OwnerDebitEntry />;
    } else if(this.state.currentPage === this.state.allPages.dailyExpenseEntry){
      currentComponent = <DailyExpenseEntry />;
    }
    else if(this.state.currentPage === this.state.allPages.machineCredit){
      currentComponent = <MachineCredit />;
    }
    else if(this.state.currentPage === this.state.allPages.workerDebitEntry){
      currentComponent = <WorkerDebitEntry />;
    }
    else if(this.state.currentPage === this.state.allPages.vehicleCredit){
      currentComponent = <VehicleCredit />;
    }
    else if(this.state.currentPage === this.state.allPages.purchaseDebit){
      currentComponent = <PurchaseDebit />;
    }
    else if(this.state.currentPage === this.state.allPages.dailyExpenseDebit){
      currentComponent = <DailyExpenseDebit />;
    }
    else if(this.state.currentPage === this.state.allPages.partDebit){
      currentComponent = <PartDebit />;
    }
    else if(this.state.currentPage === this.state.allPages.ownerDebit){
      currentComponent = <OwnerDebit />;
    }
    else if(this.state.currentPage === this.state.allPages.workerDebit){
      currentComponent = <WorkerDebit />;
    }
    else if(this.state.currentPage === this.state.allPages.dailyWorkCredit){
      currentComponent = <DailyWorkCredit />;
    }
    else if(this.state.currentPage === this.state.allPages.credit){
      currentComponent = <Credit />;
    }
    else if(this.state.currentPage === this.state.allPages.debit){
      currentComponent = <Debit />;
    }
    else if(this.state.currentPage === this.state.allPages.machineSupplyDisplay){
      currentComponent = <MachineSupplyDisplay />;
    }
    else if(this.state.currentPage === this.state.allPages.vehicleSupplyDisplay){
      currentComponent = <VehicleSupplyDisplay />;
    }
    else if(this.state.currentPage === this.state.allPages.workerDateEntry){
      currentComponent = <WorkerDateEntry />;
    }
    else if(this.state.currentPage === this.state.allPages.workerDateDisplay){
      currentComponent = <WorkerDateDisplay />;
    }
    else if(this.state.currentPage === this.state.allPages.allTransaction){
      currentComponent = <AllTransaction />;
    }
    else {
      currentComponent = <MachineRegistration />;
    }
    
    return (
      <div>
        <div id="container" className="row">
          <div id="controller" className="col-sm-3">
            <center>
              {" "}
              <p className="headingDashboard">DASHBOARD</p>{" "}
            </center>
            <PartyPins updateCurrentPage={this.UpdateCurrentPageDashboard}/>
          </div>

          <div id="display" className="col-sm-9">
            <div id="navBar">
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                      <a className="nav-link" href="">
                        Logout<span className="sr-only">(current)</span>
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link dropdown-toggle"
                        href=""
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Registration
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.machineReg
                            )
                          }
                        >
                          Machine
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.vehicleReg
                            )
                          }
                        >
                          Vehicle
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(this.state.allPages.materialReg)
                          }
                        >
                          Material
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.workerReg
                            )
                          }
                        >
                          Worker
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.machinePartyReg
                            )
                          }
                        >
                          Machine Party
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.vehiclePartyReg
                            )
                          }
                        >
                          Vehicle Party
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.purchasePartyReg
                            )
                          }
                        >
                          Purchase Party
                        </a>
                      </div>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href=""
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Entry
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.addMachineWork
                            )
                          }
                        >
                          Machine Work
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.addVehicleWork
                            )
                          }
                        >
                          Vehicle Work
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.addDailyWork
                            )
                          }
                        >
                          Daily Work
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.addPurchaseDetail
                            )
                          }
                        >
                          Purchase Entry
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.addMachineSupply
                            )
                          }
                        >
                          Machine Supply
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.addVehicleSupply
                            )
                          }
                        >
                          Vehicle Supply
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.partEntry
                            )
                          }
                        >
                          Parts Entry
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.ownerDebitEntry
                            )
                          }
                        >
                          Owner Debit
                        </a>
                        <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.updateCurrentPage(this.state.allPages.dailyExpenseEntry)}>
                          Daily Expense 
                        </a>
                        <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.updateCurrentPage(this.state.allPages.workerDebitEntry)}>
                          Worker Debit 
                        </a>
                        <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() => this.updateCurrentPage(this.state.allPages.workerDateEntry)}>
                          Worker Date 
                        </a>
                      </div>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href=""
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Display
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.machineDisplay
                            )
                          }
                        >
                          Machine Display
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.vehicleDisplay
                            )
                          }
                        >
                          Vehicle Display
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.materialDisplay
                            )
                          }
                        >
                          Material Display
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.workerDisplay
                            )
                          }
                        >
                          Worker Display
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.machinePartyDisplay
                            )
                          }
                        >
                          Machine Party Display
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.vehiclePartyDisplay
                            )
                          }
                        >
                          Vehicle Party Display
                        </a>
                        <a
                          className="dropdown-item"
						  data-toggle="collapse" 
						  data-target=".navbar-collapse.show"
                          onClick={() =>
                            this.updateCurrentPage(
                              this.state.allPages.purchasePartyDisplay
                            )
                          }
                        >
                          Purchase Party Display
                        </a>
                        <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.machineSupplyDisplay)}>
                          Machine Supply Display
                        </a>
                        <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.vehicleSupplyDisplay)}>
                          Vehicle Supply Display
                        </a>
                        <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.workerDateDisplay)}>
                          Worker Dates
                        </a>
                      </div>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href=""
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Account
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.credit)}>
                          Credit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.debit)}>
                          Debit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.machineCredit)}>
                          Machine Credit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.vehicleCredit)}>
                          Vehicle Credit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.purchaseDebit)}>
                          Purchase Debit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.dailyExpenseDebit)}>
                          Daily Expense Debit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.partDebit)}>
                          Part Debit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.ownerDebit)}>
                          Owner Debit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.workerDebit)}>
                          Worker Debit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.dailyWorkCredit)}>
                          Daily Work Credit
                      </a>
                      <a className="dropdown-item" data-toggle="collapse" data-target=".navbar-collapse.show" onClick={() =>this.updateCurrentPage(this.state.allPages.allTransaction)}>
                          All Transaction
                      </a>
                      </div>    
                    </li>  
                  </ul>
                  
                  <form className="form-inline my-2 my-lg-0">
                    <input
                      className="form-control mr-sm-2"
                      type="search"
                      placeholder="Party"
                      aria-label="Search"
                    />
                    <button
                      className="btn btn-outline-dark my-2 my-sm-0"
                      type="submit"
                    >
                      Status
                    </button>
                  </form>
                </div>
              </nav>
            </div>

            <div id="displayPart">
              <div
                id="viewPart"
                className="d-flex justify-content-center align-items-center scrollingSection"
              >
                {currentComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
