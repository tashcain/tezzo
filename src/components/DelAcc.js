import React, { Component } from 'react';
import { Popconfirm, Button, Modal, Input, notification, message } from 'antd';
import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';

export default class DelAcc extends Component {
    constructor() {
        super();
        this.state = {
            btnloding: false,
            visible: false,
            verify_pass: ''
        }
    }

    confirm = () => {
        this.setState({
            visible: true
        })
    }
    handleOk = () => {
        this.setState({
            btnloding: true
        })
        if (this.state.verify_pass === this.props.password) {
            axios.post(ApiRoutes.api_route + '/auth/delete-account', {
                gymId: this.props.gymId
            })
                .then(res => {
                    console.log(res.data);
                    if (res.data.success) {
                        localStorage.removeItem('xdGcsHneGi3r@ywThjref');
                        this.props.history.push('/login');
                        message.success('Account Deleted !')

                    } else {
                        notification.error({
                            message: 'Some error occured, Try Again !'
                        })
                    }
                    this.setState({
                        btnloding: false
                    })
                })
        } else {
            notification.warning({
                message: 'Incorrect Password !'
            })
            this.setState({
                btnloding: false
            })
        }
    }
    cancel = () => {
        console.log('Cancel')

    }
    handleCancel = () => {
        console.log('Cancel')
    }
    render() {
        return (
            <div>
                <Modal
                    title="Confirm Password"
                    visible={this.state.visible}
                    okText="Confirm"
                    cancelText="Exit"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Input.Password type="password" placeholder="Enter Password" id="verify_pass" onChange={(e) => { this.setState({ verify_pass: e.target.value }) }} value={this.state.verify_pass} />
                </Modal>
                <div className="pl-20 pr-20 pb-20">
                    <p>You won't be able to reterive your data once you delete your account</p>
                    <Popconfirm
                        title="Are you sure delete this task?"
                        onConfirm={this.confirm}
                        onCancel={this.cancel}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button className="gen-btn uk-margin-top" style={{ background: '#e74c3c' }} loading={this.state.btnloding} >Delete Account</Button>


                    </Popconfirm>
                </div>

            </div>
        )
    }
}
