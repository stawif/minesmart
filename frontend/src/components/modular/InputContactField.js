import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export default class InputContactField extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onChange = e => {
    this.props.callbackFromParent(e.target.value);
  };

  render() {
    return (
      <Fragment>
        <input
          type="tel"
          className="mb-2"
          pattern="[0-9]{10}"
          placeholder="Enter 10 digit Phone no"
          autoComplete="off"
          onChange={this.onChange}
          required
        />
      </Fragment>
    );
  }
}
