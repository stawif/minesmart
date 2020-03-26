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
        minDate: jsonTransactionDetail[0].date
      });
      this.setState({
        maxDate: jsonTransactionDetail.slice(-1)[0].date
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
    if (
      this.state.minFilterDate <= item.date &&
      item.date <= this.state.maxFilterDate
    ) {
      this.state.currentTransaction.push(item);
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
      currentTransaction: []
    };

    this.fetchProduct = this.fetchProduct.bind(this);
    this.setDateFilter = this.setDateFilter.bind(this);
    this.returnRowColor = this.returnRowColor.bind(this);

    this.fetchProduct();
  }

  render() {
    //Clear currentTransaction list
    this.state.currentTransaction = [];

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
              onChange={e => {
                this.setState({
                  maxFilterDate: e.target.value
                });
              }}
            />
          </div>
        </div>
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
    );
  }
}

export default AllTransactions;