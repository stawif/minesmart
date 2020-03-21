import React, { Component, Fragment } from "react";

export default class InputPartyVillageField extends Component {
  

  onChange = e => {
    this.props.callbackFromParent(e.target.value);
    
  };

  render() {
    return (
      <Fragment>
        <input
            type="text"
            className="mb-2"
            placeholder={this.props.placeholder}
            autoComplete="off"
            onChange={this.onChange}
            required
          />
          
      </Fragment>
    );
  }
}
