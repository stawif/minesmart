import React from 'react';
import '../../tableDisplayCss.css';

class VehicleDisplay extends React.Component {
	state = {
		todos: []
	}
	componentDidMount() {
		fetch('http://127.0.0.1:8000/list-of-vehicles/')
		.then(res => res.json())
		.then((data) => {
		this.setState({ todos: data })
		})
	}
	render() {
		return (
			<div id="mainComponent">
				<p className="headingViewPart">Vehicles</p>
				<div>
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
			</div>
		);
	}
}
export default VehicleDisplay;

