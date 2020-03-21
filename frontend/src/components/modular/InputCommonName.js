import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

export default class InputCommonName extends Component {
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
          type="text"
          className="mb-2"
          placeholder={this.props.placeholderParent}
          autoComplete="off"
          minLength={this.props.minLengthh}
          maxLength="30"
          onChange={this.onChange}
          required
        />
      </Fragment>
    );
  }
}
