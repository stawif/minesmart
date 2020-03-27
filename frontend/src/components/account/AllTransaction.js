import React from "react";
import "./account.css";

class AllTransactions extends React.Component {
  // Fetch machine list from server
  fetchProduct = async () => {
    const responseTransactionList = await fetch(
      "http://127.0.0.1:8000/account-detail/"
    );
    const jsonTransactionDetail = await responseTransactionList.json();

    if (jsonTransactionDetail.length !== 0) {
      this.setState({
        minDate: jsonTransactionDetail[0].date,
        minFilterDate: jsonTransactionDetail[0].date
      });
      this.setState({
        maxDate: jsonTransactionDetail.slice(-1)[0].date,
        maxFilterDate:  jsonTransactionDetail.slice(-1)[0].date
      });
    }
    this.setState({
      transactionDetail: jsonTransactionDetail
    });
  };

  // Set final showing rows of table currentWork
  setDateFilter = (item, index) => {
    if (!this.state.minFilterDate) {
      this.state.minFilterDate = this.state.minDate;
    }
    if (!this.state.maxFilterDate) {
      this.state.maxFilterDate = this.state.maxDate;
    }
    if (this.state.minFilterDate <= item.date && item.date <= this.state.maxFilterDate) 
    {
        this.state.currentTransaction.push(item);
        if(item.credit_amount){
          this.state.totalCredit= this.state.totalCredit+ item.credit_amount;
        }
        else if(item.debit_amount){
          this.state.totalDebit= this.state.totalDebit+ item.debit_amount;
        }
    }
  };

  // Return color for row
  returnRowColor = category => {
    if (
      category === "part_debit" ||
      category === "owner_debit" ||
      category === "daily_expense_debit" ||
      category === "worker_debit"
    ) {
      return "text-danger";
    } else if (category === "daily_work") {
      return "text-success";
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      transactionDetail: [],
      minDate: null,
      maxDate: null,
      minFilterDate: null,
      maxFilterDate: null,
      currentTransaction: [],
      totalCredit: 0,
      totalDebit: 0
    };

    this.fetchProduct = this.fetchProduct.bind(this);
    this.setDateFilter = this.setDateFilter.bind(this);
    this.returnRowColor = this.returnRowColor.bind(this);

    this.fetchProduct();
  }

  render() {
    //Clear currentTransaction list
    this.state.currentTransaction = [];
    this.state.totalDebit= 0;
    this.state.totalCredit= 0;

    //Apply date filter
    this.state.transactionDetail.forEach(this.setDateFilter);

    return (
      <div id="mainDiv">
        <div className="dateFilter">
          <div className="fromDate">
            <input
              type="date"
              min={this.state.minDate}
              max={this.state.maxDate}
              value={this.state.minFilterDate}
              onChange={e => {
                this.setState({
                  minFilterDate: e.target.value
                });
              }}
            />
          </div>
          <div className="toDate">
            <input
              type="date"
              min={this.state.minDate}
              max={this.state.maxDate}
              value={this.state.maxFilterDate}
              onChange={e => {
                this.setState({
                  maxFilterDate: e.target.value
                });
              }}
            />
          </div>
        </div>
        <div className="containTable scrollingSection">
          <table className="table table-borderd">
            <thead className="thead-dark">
              <tr>
                <th>Category</th>
                <th>Date</th>
                <th>Transaction Amount</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {this.state.currentTransaction.map(transaction => (
                <tr>
                  <td>{transaction.category}</td>
                  <td>{transaction.date}</td>
                  <td className={this.returnRowColor(transaction.category)}>
                    {transaction.credit_amount ? "+" : "-"}
                    {transaction.credit_amount}
                    {transaction.debit_amount}
                  </td>
                  <td>{transaction.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lowerStrip row">
          <div className="col-sm-3 d-flex justify-content-center align-items-center p-0 m-0">
            <p>Total Credit: {this.state.totalCredit}</p>
          </div>
          <div className="col-sm-3 d-flex justify-content-center align-items-center p-0 m-0">
            <p>Total Debit: {this.state.totalDebit}</p>
          </div>
          <div className="col-sm-3 d-flex justify-content-center align-items-center p-0 m-0">
              <p>Balance: {this.state.totalCredit-this.state.totalDebit}</p>
          </div>
          <div className="col-sm-3 d-flex justify-content-center align-items-center p-0 m-0">
            <button onClick={e => {
                            this.setState({
                                  minFilterDate: this.state.minDate,
                                  maxFilterDate: this.state.maxDate
                            });
                          }}>
                          Reset date
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AllTransactions;