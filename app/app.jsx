import React, { Component } from "react";
import ReactDOM from "react-dom";
import MailCheck from "react-mailcheck";
import "./styles.scss";

class EmailForm extends Component {
	state = {
		email: ""
	};

	handleClickMailcheck = suggestion => {
		this.setState({
			email: suggestion.full
		});
	}

	handleChange = event => {
		this.setState({
			email: event.target.value
		});
	};

  	render() {
		const { email } = this.state;

		return (
			<div className="form-group">
				<MailCheck email={email}>
					{suggestion => (
						<>
						<div className="form-control">
							<label>Email</label>
							<input type="text" name="email" placeholder="Email" onChange={this.handleChange} value={email}/>
						</div>
						
						{suggestion && (
							<div className="mailcheck">
								Did you mean{" "}
								<button
									type="button"
									className="mailcheck-button"
									onClick={() => this.handleClickMailcheck(suggestion)}
								>
									{suggestion.full}
								</button>
								?
							</div>
						)}
						</>
					)}
				</MailCheck>
			</div>
		);
  	}
}

ReactDOM.render(<EmailForm />, document.getElementById("app"));
