import React from 'react';
import '../../tableDisplayCss.css';

class MachinePartyDisplay extends React.Component {
	state = {
		todos: []
	}
	componentDidMount() {
		fetch('http://127.0.0.1:8000/list-of-machineparty/')
		.then(res => res.json())
		.then((data) => {
		this.setState({ todos: data })
		})
	}
	render() {
		return (
			<div id="mainComponent">
				<p className="headingViewPart">Machine Parties</p>
				<div>
					<table className="table table-borderd">
						<thead className="thead-dark">
							<tr>
								<th>Contact</th>
								<th>Name</th>
								<th>Village</th>
							</tr>
						</thead>
						<tbody>
							{this.state.todos.map((todo) => (
								<tr>
									<td>{todo.contact}</td>
									<td>{todo.name}</td>
									<td>{todo.village}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}
export default MachinePartyDisplay;