import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { notification, Button, Input, Form, message } from 'antd';
import axios from 'axios';
import tezzotext from '../asset/images/tezzo-text.png';
import tezzologo from '../asset/images/tezzo-whitebg.png'
import '../asset/vendor/bootstrap/css/bootstrap.min.css';
import '../asset/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import '../asset/css/main.css';
import '../asset/css/util.css';
import ApiRoutes from '../config/ApiRoutes';


export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            pass: '',
            loading: false,
            email_status: ''

        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    validateEmail = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    onSubmit = (e) => {
        this.setState({
            loading: true
        })
        if (this.state.email !== '' && this.state.pass !== '') {
            if (!this.validateEmail(this.state.email)) {
                notification.error({
                    message: "Invalid Email Address"
                })
                this.setState({
                    loading: false,
                    email_status: 'warning'
                })
                return;
            } else {
                this.setState({
                    email_status: ''
                })
            }
            axios.post(ApiRoutes.api_route + '/auth/login-gym', {
                email: this.state.email,
                password: this.state.pass
            })
                .then(res => {
                    if (res.data.success) {
                        localStorage.setItem('xdGcsHneGi3r@ywThjref', res.data.msg[0].gymId);
                        localStorage.setItem('gym_name', res.data.msg[0].gym_name);
                        localStorage.setItem('gym_email', res.data.msg[0].email);
                        message.success('Logged In Succesfully !');
                        this.setState({
                            loading: false
                        })
                        this.props.history.push('/');

                    } else {
                        if (res.data.msg === 'no match') {
                            notification.error({
                                message: 'Wrong Password !'
                            })

                        }
                        if (res.data.msg === 'no user') {
                            notification.error({
                                message: 'No User Found !'
                            })

                        }
                        this.setState({
                            loading: false
                        })
                    }


                })
                .catch(err => console.log(err))

        } else {
            notification.error({
                message: "Please Fill All Given Fields !"
            })
            this.setState({
                loading: false
            })
        }


    }
    render() {
        return (
            <div>
                <div className="cover-bg"></div>
                <div className="container-login100">
                    <div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
                        <form className="login100-form validate-form">
                            <img src={tezzologo}
                                style={{
                                    margin: "0 auto",
                                    height: "75px",
                                    marginBottom: "10px"
                                }} alt="tezzo-logo" />
                            <img src={tezzotext}
                                style={{
                                    margin: "0 auto",
                                    height: "55px",
                                    marginBottom: "10px"
                                }} alt="tezzo-logo" />
                            <span className="login100-form-title p-b-37"
                                style={{
                                    color: "#2c3e50",
                                    fontSize: "20px",
                                    marginTop: "20px"

                                }}
                            >
                                Login
				</span>
                            <Form.Item style={{ width: '100%' }} hasFeedback validateStatus={this.state.email_status}>
                                <Input className="ant-input-signup  " type="text" id="email" onChange={this.onChange} placeholder="Email" />
                            </Form.Item>
                            <Form.Item style={{ width: '100%' }}>
                                <Input className="ant-input-signup" type="password" id="pass" onChange={this.onChange} placeholder="Enter Password" />
                            </Form.Item>



                            <div className="container-login100-form-btn mt-4">
                                <Button loading={this.state.loading} style={{
                                    width: '100%',
                                    height: '40px',
                                    color: '#fff',
                                    letterSpacing: '1px',
                                    backgroundColor: '#38CB84',
                                    border: 'none',
                                    margin: '0 auto'
                                }} className="ant-btn-signup" onClick={this.onSubmit}>
                                    Login
					</Button>

                            </div>

                            <div className="text-center p-t-57 p-b-20">
                                <span className="txt1">
                                    Create a new account  <Link to="/signup" className="txt2 hov1">
                                        Sign Up
					</Link>
                                </span>
                            </div>


                        </form>


                    </div>
                </div>

            </div>
        )
    }
}

