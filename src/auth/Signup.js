import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { notification, Button, Input, Form } from 'antd';
import axios from 'axios';
import tezzotext from '../asset/images/tezzo-text.png';
import tezzologo from '../asset/images/tezzo-whitebg.png'
import '../asset/vendor/bootstrap/css/bootstrap.min.css';
import '../asset/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import '../asset/css/main.css';
import '../asset/css/util.css';
import ApiRoutes from '../config/ApiRoutes';


export default class Signup extends Component {
    constructor() {
        super();
        this.state = {
            gym_name: '',
            email: '',
            mobile_no: '',
            pass: '',
            pass1: '',
            loading: false,
            mobile_no_status: '',

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
        // axios.post('http://localhost:5000/auth/delete-all-gym', {})
        //     .then(res => {
        //         console.log(res.data)
        //     })
        this.setState({
            loading: true,
            mobile_no_status: '',
            email_status: ''
        })
        e.preventDefault();
        if (this.state.email !== '' && this.state.gym_name !== '' && this.state.mobile_no !== '' && this.state.pass !== '' && this.state.pass1 !== '') {
            if (this.state.mobile_no.length !== 10) {
                notification.error({
                    message: 'Enter Correct Mobile Number'
                })
                this.setState({
                    loading: false,
                    mobile_no_status: 'warning'
                })
                return;

            } else {
                this.setState({
                    mobile_no_status: ''
                })
            }
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

            if (this.state.pass === this.state.pass1) {

                axios.post(ApiRoutes.api_route + '/auth/register-gym', {
                    gym_name: this.state.gym_name,
                    email: this.state.email,
                    password: this.state.pass,
                    phone_no: this.state.mobile_no
                })
                    .then(res => {
                        if (res.data.success) {
                            this.setState({
                                loading: false
                            })
                            localStorage.setItem('otp', res.data.otp.otp_id);
                            localStorage.setItem('otp-mobile-no', res.data.otp.mobile_no);
                            localStorage.setItem('xdGcsHneGi3r@ywThjref', res.data.gym_details.gymId)
                            this.props.history.push('/verify-otp');

                        } else {
                            if (res.data.msg === 'already exists') {
                                this.setState({
                                    email_status: 'warning'
                                })
                                notification.error({
                                    message: "This email already exists, Login to continue !"
                                })
                            } else if (res.data.msg === 'mobile exists') {
                                this.setState({
                                    mobile_no_status: 'warning'
                                })
                                notification.error({
                                    message: "Mobile No Already Linked with account"
                                })
                            } else {
                                notification.error({
                                    message: "Some Error Occured Please Try Again"
                                })
                            }

                            this.setState({
                                loading: false
                            })
                        }

                    })
                    .catch(err => console.log(err))
                console.log(this.state);
            } else {
                notification.error({
                    message: "Password Doesn't Match"
                })
                this.setState({
                    loading: false
                })
            }
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
                    <div className="wrap-login100 p-l-55 p-r-55 p-b-30"
                        style={{ paddingTop: "45px" }}
                    >
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
                            <span className="login100-form-title"
                                style={{
                                    color: "#2c3e50",
                                    fontSize: "20px",
                                    marginTop: "20px"

                                }}
                            >
                                Create Account
				</span>
                            <div className="flex mt-4">
                                <Form.Item style={{ width: '100%' }}>
                                    <Input className="ant-input-signup " type="text" id="gym_name" onChange={this.onChange} placeholder="Gym Name" />
                                </Form.Item>
                                <Form.Item style={{ width: '100%' }} className="uk-margin-left" hasFeedback validateStatus={this.state.email_status}>
                                    <Input className="ant-input-signup  " type="text" id="email" onChange={this.onChange} placeholder="Email" />
                                </Form.Item>
                            </div>
                            <div className="flex">
                                <Form.Item style={{ width: '100%' }} hasFeedback validateStatus={this.state.mobile_no_status}>
                                    <Input className="ant-input-signup" type="text" id="mobile_no" onChange={this.onChange} placeholder="Mobile Number +91" />
                                </Form.Item>
                            </div>
                            <div className="flex">
                                <Form.Item style={{ width: '100%' }}>
                                    <Input className="ant-input-signup" type="password" id="pass" onChange={this.onChange} placeholder="Enter Password" />
                                </Form.Item>
                                <Form.Item style={{ width: '100%' }} className="uk-margin-left">
                                    <Input className="ant-input-signup " type="password" id="pass1" onChange={this.onChange} placeholder="Confirm Password" />
                                </Form.Item>
                            </div>


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
                                    Sign Up
					</Button>

                            </div>

                            <div className="text-center mt-8 p-b-20">
                                <span className="txt1">
                                    Already have an account ? <Link to="/login" className="txt2 hov1">
                                        Login
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

