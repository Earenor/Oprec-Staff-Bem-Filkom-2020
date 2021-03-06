import React, { Component } from "react";
import { Button, Form, Header, Message } from "semantic-ui-react";
import { GlobalConsumer } from '../../../Config/Context';

class LoginPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nim: "",
			password: "",
			nama: "",
			prodi: "",
			loading: false,
			message: false
		};
	}
	render() {
		return (
			<React.Fragment>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

					<Header as="h2" textAlign="center" style={{ marginTop: 30 }}>
						Login
					</Header>
					<div style={{ width: '50vw' }}>
						<Form size="large">
							<Form.Input fluid type="number" icon="user" iconPosition="left" placeholder="NIM" onChange={input => this.setState({ nim: input.target.value })} />
							<Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" type="password" onChange={input => this.setState({ password: input.target.value })} />
							{this.state.loading && (
								<Button fluid size="large" loading primary>
									Loading
								</Button>
							)}
							{this.state.loading === false && (
								<Button
									color="blue"
									fluid
									size="large"
									onClick={async () => {
										this.setState({ loading: true });
										//cek nim
										var nm = this.state.nim;
										var cek1 = nm.substring(0, 2) === "19";
										var cek2 = nm.substring(0, 2) === "18";
										var cek3 = nm.substring(3, 6) === "150";
										//&& (cek1 || cek2) && cek3
										if (this.state.nim.length === 15 && cek3 && (cek1 || cek2 || '175150400111045')) {
											await this.props.login(this.state.nim, this.state.password).then(ress => {
												let a = ress;
												// console.log(ress);
												if (!a.status) {
													this.setState({ message: true });
													this.setState({ loading: false });
												} else {
													// const URL = 'http://localhost:5000/api/web/protected/checkOprecStaffBemFilkom2020';
													const URL = 'https://backend-bem.herokuapp.com/api/web/protected/checkOprecStaffBemFilkom2020';
													const body = {
														nim: this.state.nim
													}
													const res = fetch(URL, {
														method: "POST",
														headers: {
															"content-type": "application/json",
															"authorization": "bearer " + ress.token
														},
														body: JSON.stringify(body)
													}).then(ress => {
														return ress.json()
													}).then(resss => {
														this.props.setStatus(resss.value);
														if (resss.status === true) {
															// this.setState({ loading: false });
															// if (resss.value) {
															// 	this.props.setLoading(false);
															// 	this.props.history.replace("/notif");
															// } else {
															// 	this.props.setLoading(false);
															// 	this.props.history.replace("/notif");
															// }
															this.props.setLoading(false);
															this.props.history.replace("/notif");
														} else {
															this.props.setLoading(false);
														}
													}).catch(err => {
														alert('Request Time Out. Try Again!')
														// console.log(err)
													})
													// this.setState({ loading: false });
													// this.props.history.replace("/form");
												}
											});
										} else {
											this.setState({ loading: false });
											this.setState({ message: true });
										}
									}}>
									Login
								</Button>
							)}
						</Form>
					</div>
					<br></br>
					<br></br>
					<br></br>
					<br></br>
					{this.state.loading === true && (
						<div style={{ marginBottom: 50, marginTop: -10 }}>
							<div class="ui icon message">
								<i class="notched circle loading icon" />
								<div class="content">
									<div class="header">Just one second</div>
									<p>We're fetching that content for you.</p>
								</div>
							</div>
						</div>
					)}
					{this.state.message === true && (
						<Message
							style={{ marginBottom: 50, marginTop: -10 }}
							error
							header='Password atau Nim salah!'
							content='Silahkan Login Kembali!'
						/>
					)}
				</div>
			</React.Fragment>

		);
	}
}
export default GlobalConsumer(LoginPage);
