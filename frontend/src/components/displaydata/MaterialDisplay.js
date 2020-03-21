import React from "react";
import '../../tableDisplayCss.css';

export default class MaterialDisplay extends React.Component {
  state = {
    todos: []
  };
  componentDidMount() {
    fetch("http://127.0.0.1:8000/list-of-material/")
      .then(res => res.json())
      .then(data => {
        this.setState({ todos: data });
      });
  }
  render() {
    return (
      <div id="mainComponent">
        <p className="headingViewPart">Materials</p>
        <div>
          <table className="table table-borderd">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Measurement</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {this.state.todos.map(todo => (
                <tr>
                  <td>{todo.name}</td>
                  <td>{todo.measurement}</td>
                  <td>{todo.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
