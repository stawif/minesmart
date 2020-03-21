import React from 'react';

class InputField extends React.Component{
    constructor(props){
        super(props);
    }
  
    render(){
        return(
            <div>
                <input 
                    type= {this.props.type}
                    placeholder= {this.props.placeholder}
                    className= {this.props.className}
                    autoComplete= {this.props.autoComplete}
                    minLength= {this.props.minLength}
                    maxLength= {this.props.maxLength}
                    onChange= { e => {
                        this.props.callBackFunction(e.target.value)
                    }}
                />
            </div>
        );
    }
}

export default InputField;