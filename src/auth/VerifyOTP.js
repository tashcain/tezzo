import React, { Component } from 'react';
import { notification, Button, Input } from 'antd';
import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';
import '../asset/vendor/bootstrap/css/bootstrap.min.css';
import '../asset/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import '../asset/css/main.css';
import '../asset/css/util.css';


export default class VerifyOTP extends Component {
    constructor() {
        super();
        this.state = {
            otp: '',
            loading: false,
            togg: 'none',
            new_number: '',
            disable: false
        }
    }
    componentDidMount() {
        console.log('Mounted');
    }
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    onReSend = () => {
        console.log(this.state.new_number.length, this.state.new_number);
        // if (this.state.new_number.lenght !== 10) {
        //     notification.error({
        //         message: 'Invalid Number !'
        //     })
        // } else {
        this.setState({
            disable: true
        })
        axios.post(ApiRoutes.api_route + '/auth/change-number', {
            gymid: localStorage.getItem('xdGcsHneGi3r@ywThjref'),
            number: this.state.new_number
        })
            .then(res => {
                setTimeout(() => {
                    this.setState({
                        disable: false
                    })
                }, 30000)
                localStorage.setItem('otp-mobile-no', this.state.new_number);
                localStorage.setItem('otp', res.data.otp.otp_id);
                console.log(res.data);
                if (res.data.success) {
                    notification.success({
                        message: `OTP is sent to ${this.state.new_number}`
                    })
                    setTimeout(() => {
                        window.location.href = '/verify-otp'
                    }, 2000)
                }

            })
            .catch(err => console.log(err));
        // }
    }
    onSubmit = (e) => {
        this.setState({
            loading: true
        })
        e.preventDefault();
        if (this.state.otp !== '') {
            var otp_id = localStorage.getItem('otp');
            var mobile_no = localStorage.getItem('otp-mobile-no');
            axios.post(ApiRoutes.api_route + '/auth/verify-otp', {
                otp_id,
                mobile_no,
                otp: this.state.otp
            })
                .then(res => {
                    this.setState({
                        loading: false
                    })
                    if (res.data.success) {
                        this.props.history.push('/');
                    } else {
                        notification.error({
                            message: 'Incorrect OTP'
                        })
                    }

                    console.log(res.data);
                })
                .catch(err => console.log(err))

        } else {
            notification.error({
                message: 'Please enter OTP'
            })
            this.setState({
                loading: false
            })
        }



    }
    handleTogg = () => {
        if (this.state.togg === 'none') {
            this.setState({
                togg: ''
            })
        } else {
            this.setState({
                togg: 'none'
            })
        }
    }
    render() {
        return (
            <div>
                <div class="container-login100">
                    <div class="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
                        <form class="login100-form validate-form">
                            <span class="login100-form-title p-b-37">
                                Mobile Number Verification
				</span>
                            <p className="uk-text-center">OTP is sent to {localStorage.getItem('otp-mobile-no')}. <Button type="link" onClick={this.handleTogg}>Change Number</Button> </p>

                            <div className="flex" style={{ display: `${this.state.togg}`, marginBottom: '10px', padding: '20px' }}>
                                <Input className="ant-input-signup" type="text" value={this.state.new_number} id="new_number" onChange={this.onChange} placeholder="Enter Number" />
                                <Button
                                    style={{
                                        width: '100px',
                                        height: '40px',
                                        color: '#fff',
                                        letterSpacing: '1px',
                                        backgroundColor: '#38CB84',
                                        border: 'none',
                                        margin: '0 auto',
                                        marginLeft: '10px'
                                    }}
                                    disabled={this.state.disable}
                                    class="login100-form-btn" onClick={this.onReSend}>
                                    Send
					</Button>
                            </div>

                            <Input className="ant-input-signup" type="text" value={this.state.otp} id="otp" onChange={this.onChange} placeholder="Enter OTP" />


                            <div class="wrap-input100 validate-input m-b-20" data-validate="Enter username or email">

                                <span class="focus-input100"></span>
                            </div>


                            <div class="container-login100-form-btn">
                                <Button
                                    style={{
                                        width: '100px',
                                        height: '40px',
                                        color: '#fff',
                                        letterSpacing: '1px',
                                        backgroundColor: '#38CB84',
                                        border: 'none',
                                        margin: '0 auto'
                                    }}
                                    loading={this.state.loading}
                                    class="login100-form-btn" onClick={this.onSubmit}>
                                    Submit
					</Button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        )
    }
}

