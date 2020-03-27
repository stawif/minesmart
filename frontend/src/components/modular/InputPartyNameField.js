import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export default class InputPartyNameField extends Component {
  

  onChange = e => {
    this.props.callbackFromParent(e.target.value);
  };
  onBlur = e => {
    this.props.callbackFromParent(e.target.value.trim());
  };

  render() {
    return (
      <Fragment>
        <input
          type="text"
          className="mb-2"
          placeholder="Enter Party Name"
          autoComplete="off"
          maxLength="30"
          minLength="5"
          onChange={this.onChange}
          onBlur={this.onBlur}
          required
        />
      </Fragment>
    );
  }
}
