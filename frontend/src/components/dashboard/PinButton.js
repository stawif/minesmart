import React from "react";
import './PinButtonCss.css';

class PinButton extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <button 
                type="submit" 
                className={this.props.class}
                onClick={e => this.props.updateCurrentPage(this.props.partyType,this.props.partyName)}
                >
                    {this.props.partyName}
            </button>
        );
    }
}

export default PinButton;