import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export default class InputRateField extends Component {
  onChange = e => {
    this.props.callbackFromParent(e.target.value);
  };

  render() {
    return (
      <Fragment>
        <input
          type="number"
          step="0.1"
          className="mb-2"
          placeholder={this.props.placeholderParent}
          autoComplete="off"
          onChange={this.onChange}
          required
        />
      </Fragment>
    );
  }
}
