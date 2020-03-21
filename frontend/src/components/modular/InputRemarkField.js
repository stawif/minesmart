import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export default class InputRemarkField extends Component {
  onChange = e => {
    this.props.callbackFromParent(e.target.value);
  };

  render() {
    return (
      <Fragment>
        
        <input
            type="text"
            className="mb-2"
            name="remark"
            placeholder="Remark"
            autoComplete="off"
            maxLength="30"
            onChange={this.onChange}
          />
      </Fragment>
    );
  }
}
