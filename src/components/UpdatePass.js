import React, { Component } from 'react'
import { Input, Button, notification } from 'antd';
import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';

export default class UpdatePass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_pass_inp: '',
            current_pass: props.password,
            new_pass: '',
            new_pass_confirm: '',
            btnloding: false
        }
    }
    componentDidMount() {
        console.log(this.state.current_pass);
    }
    handleText = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    updatePassword = () => {
        this.setState({
            btnloding: true
        })
        if (this.state.new_pass !== '' && this.state.new_pass_confirm !== '' && this.state.current_pass !== '') {
            if (this.state.new_pass === this.state.new_pass_confirm) {
                if (this.state.current_pass === this.state.current_pass_inp) {
                    axios.post(ApiRoutes.api_route + '/auth/change-password', {
                        gymId: this.props.gymId,
                        password: this.state.new_pass
                    })
                        .then(res => {
                            console.log(res.data);
                            if (res.data.success) {
                                notification.success({
                                    message: 'Password Updated Successfully !'
                                })
                            } else {
                                notification.error({
                                    message: 'Some error occured, Try Again !'
                                })
                            }
                        })


                } else {
                    notification.warning({
                        message: 'Incorrect Password'
                    })
                }
            } else {
                notification.warning({
                    message: "New Password did not match !"
                })
            }
        } else {
            notification.warning({
                message: "Fields can't be empty !"
            })

        }
        this.setState({
            btnloding: false
        })
    }

    render() {
        return (
            <div>
                <div className="pl-20 pr-20 pb-20">
                    <div style={{ width: '50%' }}>
                        <label className="label-title">Current Password</label>
                        <Input placeholder="Current Password" value={this.state.current_pass_inp} id="current_pass_inp" onChange={this.handleText} />
                    </div>
                    <div className="flex mt-4">
                        <div className="flex-1">
                            <label className="label-title">New Password</label>
                            <Input placeholder="New Password" value={this.state.new_pass} id="new_pass" onChange={this.handleText} />
                        </div>
                        <div className="flex-1 uk-margin-left">
                            <label className="label-title">Confirm New Password</label>
                            <Input placeholder="Confirm New Password" value={this.state.new_pass_confirm} id="new_pass_confirm" onChange={this.handleText} />
                        </div>

                    </div>
                    <Button className="gen-btn uk-margin-top" style={{ background: '#e74c3c' }} loading={this.state.btnloding} onClick={this.updatePassword}>Change Password</Button>
                </div>

            </div>
        )
    }
}
