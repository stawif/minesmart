import React from 'react';
import '../../tableDisplayCss.css';

class MachineDisplay extends React.Component {
	state = {
		todos: []
	}
	componentDidMount() {
		fetch('http://127.0.0.1:8000/list-of-machines/')
		.then(res => res.json())
		.then((data) => {
		this.setState({ todos: data })
		})
	}
	render() {
		return (
			<div id="mainComponent">
				<p className="headingViewPart">Machines</p>
				<table className="table table-borderd">
						<thead className="thead-dark">
							<tr>
								<th>Name</th>
							</tr>
						</thead>
						<tbody>
							{this.state.todos.map((todo) => (
								<tr>
									<td>{todo.name}</td>
								</tr>
							))}
						</tbody>
					</table>
			</div>
		);
	}
}
export default MachineDisplay;

