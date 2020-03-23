import React, { Fragment } from "react";

export default class InputDateField extends React.Component {
  constructor() {
    super();

    var curr = new Date();
    curr.setDate(curr.getDate());
    var date = curr.toISOString().substr(0, 10);

    this.state = {
      date: date
    };

    //this.props.callbackFromParent(this.state.date);
    this.storeDate = this.storeDate.bind(this);
  }

  storeDate = e => {
    this.props.callbackFromParent(this.state.date);
  };

  componentDidMount() {
    this.storeDate();
  }
  onChange = e => {
   this.state.date= e.target.value
    this.props.callbackFromParent(e.target.value);
  };
  render() {
    return (
      <Fragment>
        <input
          type="date"
          data-date-format="YYYY-MM-DD"
          defaultValue={this.state.date}
          name="date"
          onChange={this.onChange}
          required
        />
      </Fragment>
    );
  }
}
