import React, { Component } from 'react';
import { Upload, Icon, message, Input, Button, Progress, Modal, notification, Form, Alert } from 'antd';
import axios from 'axios';
import UpdatePass from '../components/UpdatePass';
import DelAcc from '../components/DelAcc';
import { storage } from "../firebase/index";
import ApiRoutes from '../config/ApiRoutes';
import correct from '../asset/images/correct.png'



export default class Profile extends Component {
    state = {
        loading: false,
        gymInfo: {},
        email: '',
        password: '',
        gym_name: '',
        address: '',
        phone_no: '',
        progress: 0,
        dispStat: 'none',
        visible: false,
        verify_pass: '',
        btnloding: false,
        email_stat: '',
        phone_no_stat: '',
        alert_phone: '',
        alert_email: '',
        modal_number: 0,
        otp_stat: '',
        otp: '',
        otp_togg: 'none',
        email_code: '',
        email_togg: 'none',
        vcode: '',
        updatePass: null,
        deleteAcc: null
    };
    componentDidMount() {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        // if (lc === null) {
        //     this.props.history.push('/login');
        //     message.error('You are not logged in !');
        //     return;
        // }
        axios.post(ApiRoutes.api_route + '/gprofile/get-gym-byid', {
            gymId: lc
        })
            .then(res => {
                console.log(res.data)
                if (!res.data.msg.is_email_verified) {
                    this.setState({
                        email_stat: 'warning',
                        alert_email: <Alert message="Email is not verified" type="warning" showIcon />
                    })
                }
                if (!res.data.msg.is_phone_verified) {
                    this.setState({
                        phone_no_stat: 'warning',
                        alert_phone: <Alert message="Mobile number is not verified" type="warning" showIcon />
                    })
                }
                this.setState({
                    gymInfo: res.data.msg,
                    email: res.data.msg.email,
                    password: res.data.msg.password,
                    gym_name: res.data.msg.gym_name,
                    address: res.data.msg.address,
                    phone_no: res.data.msg.phone_no,
                    imageUrl: res.data.msg.logo,
                    updatePass: <UpdatePass password={res.data.msg.password} gymId={res.data.msg.gymId} />,
                    deleteAcc: <DelAcc password={res.data.msg.password} gymId={res.data.msg.gymId} />
                })
            })
            .catch(err => console.log(err))
    }
    handleChange = info => {

        console.log(info)

        // Get this url from response in real world.
        if (info.file.status === 'error') {
            this.uploadProfilePic(info);


        } else if (info.file.status === 'done') {
            this.uploadProfilePic(info);
        }
    };


    uploadProfilePic = (info) => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        const uploadTask = storage.ref(`gym-icon/${this.state.email}-${info.file.originFileObj.name}`).put(info.file.originFileObj);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                this.setState({
                    dispStat: 'block',
                    progress
                });
            },
            error => {
                console.log(error);
            },
            () => {
                storage
                    .ref("gym-icon")
                    .child(`${this.state.email}-${info.file.originFileObj.name}`)
                    .getDownloadURL()
                    .then(url => {
                        console.log('url start');
                        console.log(url);
                        this.setState({
                            imageUrl: url
                        })
                        axios.post(ApiRoutes.api_route + '/gprofile/update-img-url', {
                            gymId: lc,
                            image_url: url
                        })
                            .then(res => {
                                console.log(res.data)
                                notification.success({
                                    message: 'Profile pic updated successfully !'
                                })
                                this.setState({
                                    dispStat: 'none'
                                })
                            })
                            .catch(err => console.log(err))


                    });
            }
        );

    }
    handleText = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    showModal = (e) => {
        console.log(e);
        this.setState({
            visible: true,
            modal_number: e
        });
    };

    handleOk = (e) => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')


        if (this.state.verify_pass === '') {
            notification.error({
                message: 'Password is empty !'
            })
        } else {


            if (this.state.password === this.state.verify_pass) {
                this.setState({
                    verify_pass: ''
                })
                if (this.state.modal_number === 3) {
                    this.setState({
                        btnloding: true,
                        visible: false
                    })
                    console.log(this.state);
                    axios.post(ApiRoutes.api_route + '/gprofile/update-gym', {
                        gym_name: this.state.gym_name,
                        gymId: lc,
                        address: this.state.address,

                    })
                        .then(res => {
                            console.log(res.data);
                            if (res.data.success) {

                                notification.success({
                                    message: 'Profile Updated Succesfully'
                                })
                                this.setState({
                                    btnloding: false
                                })
                            } else {
                                notification.error({
                                    message: 'Some error occured !'
                                })
                                this.setState({
                                    btnloding: false
                                })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            this.setState({
                                btnloding: false
                            })
                        })
                } else if (this.state.modal_number === 2) {
                    this.setState({
                        btnloding: true,
                        visible: false
                    })
                    if (this.state.phone_no === this.state.gymInfo.phone_no) {
                        if (this.state.gymInfo.is_phone_verified) {
                            notification.error({
                                message: 'You are already using this number and it is verified'
                            })
                        } else {
                            notification.error({
                                message: 'You are already using this number and it is not verified'
                            })
                        }

                        this.setState({
                            btnloding: false
                        })
                    } else {
                        axios.post(ApiRoutes.api_route + '/auth/change-number', {
                            gymid: this.state.gymInfo.gymId,
                            number: this.state.phone_no
                        })
                            .then(res => {
                                if (res.data.success) {
                                    this.setState({
                                        otp_togg: 'block'
                                    })
                                    notification.success({
                                        message: 'OTP sent, Verify your number !'
                                    })
                                    localStorage.setItem('otp-mobile-no', this.state.phone_no);
                                    localStorage.setItem('otp', res.data.otp.otp_id);
                                    this.setState({
                                        btnloding: false
                                    })
                                } else {
                                    if (res.data.msg === 'already exists') {
                                        notification.error({
                                            message: 'This number is already linked with other account !'
                                        })

                                    }
                                    this.setState({
                                        btnloding: false
                                    })
                                }
                                console.log(res.data);
                            })
                            .catch(err => { console.log(err) })
                    }
                } else if (this.state.modal_number === 4) {
                    this.setState({
                        visible: false
                    })
                    this.generateOTP();
                } else if (this.state.modal_number === 5) {
                    this.setState({
                        visible: false
                    })
                    this.emailUpdate();
                } else if (this.state.modal_number === 6) {
                    this.setState({
                        visible: false
                    })
                    this.generateEmail();
                }

            } else {
                notification.error({
                    message: 'Incorrect Password'
                })
                this.setState({
                    verify_pass: ''
                })
            }
        }
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    generateOTP = () => {
        axios.post(ApiRoutes.api_route + '/auth/generate-otp', {
            gymId: this.state.gymInfo.gymId,
            number: this.state.gymInfo.phone_no
        })
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        otp_togg: 'block'
                    })
                    notification.success({
                        message: `OTP sent to  ${this.state.gymInfo.phone_no}`
                    })
                    localStorage.setItem('otp-mobile-no', this.state.phone_no);
                    localStorage.setItem('otp', res.data.otp.otp_id);
                    this.setState({
                        btnloding: false,
                        otp_togg: 'block'
                    })
                } else {
                    if (res.data.msg === 'Error Occured') {
                        notification.error({
                            message: 'Unable to send OTP !'
                        })

                    } else if (res.data.msg === 'User not find') {
                        notification.error({
                            message: 'User Auth Error !'
                        })
                    }
                    this.setState({
                        btnloding: false
                    })
                }
            })
            .catch(err => console.log(err))
    }
    verifyOtp = (e) => {
        this.setState({
            btnloding: true
        })

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
                        btnloding: false,
                        otp_togg: 'none',
                        phone_no_stat: '',
                        alert_phone: ''
                    })
                    if (res.data.success) {
                        message.success('OTP verified');
                        this.componentDidMount();
                    } else {
                        notification.error({
                            message: 'Incorrect OTP'
                        })
                        this.setState({
                            btnloding: false
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
                btnloding: false
            })
        }



    }
    emailUpdate = () => {
        this.setState({
            btnloding: true
        })

        if (this.state.email === '') {
            notification.warning({
                message: "Email can't be empty !"
            })
            this.setState({
                btnloding: false
            })
        } else {
            if (this.state.email === this.state.gymInfo.email) {
                notification.warning({
                    message: 'You are currently using the same email !'
                })
                this.setState({
                    btnloding: false
                })
            } else {
                axios.post(ApiRoutes.api_route + '/gprofile/update-email', {
                    gymId: this.state.gymInfo.gymId,
                    email: this.state.email
                })
                    .then(res => {
                        console.log(res.data)
                        if (res.data.success) {
                            notification.success({
                                message: 'Email updated successfully !'
                            })
                            this.componentDidMount();
                        } else {
                            if (res.data.msg === 'already exist') {
                                notification.warning({
                                    message: 'Email Already Exixts !'
                                })
                            } else {

                                notification.error({
                                    message: 'Some error occured, Try Again !'
                                })
                            }
                        }
                    })
                this.setState({
                    btnloding: false
                })
            }
        }
    }
    generateEmail = () => {
        this.setState({
            btnloding: true
        })
        axios.post(ApiRoutes.api_route + '/mail/send-mail', {
            gymId: this.state.gymInfo.gymId,
            email: this.state.gymInfo.email
        })
            .then(res => {
                if (res.data.success) {

                    notification.success({
                        message: `Email sent to  ${this.state.gymInfo.email}`
                    })
                    this.setState({
                        btnloding: false,
                        email_togg: 'block',
                        email_code: res.data.data.code
                    })
                } else {
                    if (res.data.msg === 'Error Occured') {
                        notification.error({
                            message: 'Unable to send Email !'
                        })

                    } else if (res.data.msg === 'User not find') {
                        notification.error({
                            message: 'User Auth Error !'
                        })
                    }
                    this.setState({
                        btnloding: false
                    })
                }
            })
            .catch(err => console.log(err))
    }

    verifyEmail = () => {
        this.setState({
            btnloding: true
        })

        if (this.state.vcode !== '') {
            if (this.state.email_code === this.state.vcode) {

                axios.post(ApiRoutes.api_route + '/gprofile/verify-email', {
                    gymId: this.state.gymId,
                    email: this.state.gymInfo.email
                })
                    .then(res => {
                        if (res.data.success) {
                            this.setState({
                                btnloding: false,
                                email_togg: 'none',
                                email_stat: '',
                                alert_email: ''
                            })
                            message.success('Email verified');
                            this.componentDidMount();
                        } else {
                            message.error('Auth Error');
                        }
                    })
                this.componentDidMount();
            } else {
                notification.error({
                    message: 'Incorrect Code'
                })
                this.setState({
                    btnloding: false
                })

            }

        } else {
            notification.error({
                message: 'Please enter OTP'
            })
            this.setState({
                btnloding: false
            })
        }

    }
    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
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
                    <Input.Password type="password" placeholder="Enter Password" id="verify_pass" onChange={this.handleText} value={this.state.verify_pass} />
                </Modal>
                <h1 className="page-head-sub">Account Details</h1>

                <div className="pl-20 pr-20 pb-20">
                    {
                        this.state.alert_email
                    }
                    <br />
                    {
                        this.state.alert_phone
                    }
                    <label className="label-title mt-4">Profile Pic</label>
                    <div>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}

                            onChange={this.handleChange}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                        <div style={{ display: `${this.state.dispStat}` }}>

                            <Progress percent={this.state.progress} />
                        </div>
                    </div>



                    <div style={{ width: '50%' }}>
                        <div className="flex">
                            <div className="flex-1">
                                <label className="label-title flex">
                                    Email
                                    {
                                        (this.state.gymInfo.is_email_verified) ? <img src={correct} style={{ height: '15px', marginLeft: '10px', marginTop: '5px' }} alt="verified" /> : <div></div>
                                    }
                                </label>
                                <Form.Item style={{ width: '100%' }} hasFeedback validateStatus={this.state.email_stat}>
                                    <Input placeholder="Email" value={this.state.email} id="email" onChange={this.handleText} />
                                </Form.Item>
                            </div>
                            <div className="flex-2">
                                <Button className="gen-btn uk-margin-left mt-8" loading={this.state.btnloding} onClick={() => this.showModal(5)}>Update</Button>
                                {

                                    (this.state.gymInfo.is_email_verified) ? <div></div> : <Button className="gen-btn uk-margin-left mt-8" loading={this.state.btnloding} style={{ background: 'rgba(255, 185, 51, 1)' }} onClick={() => this.showModal(6)}>Verify</Button>
                                }

                            </div>

                        </div>
                        <div className="flex" style={{ display: `${this.state.email_togg}` }}>
                            <div>
                                <label className="label-title">Enter Email Verification Code</label>
                                <Form.Item style={{ width: '100%' }}>
                                    <Input placeholder="Enter Verification Code" value={this.state.vcode} id="vcode" onChange={this.handleText} />
                                </Form.Item>
                                <Button type="dashed" className="mb-4" style={{ marginTop: '-7px' }} loading={this.state.btnloding} onClick={this.verifyEmail}>Verify</Button>
                            </div>

                        </div>
                        <div className="flex">
                            <div className="flex-1">
                                <label className="label-title flex">Mobile No
                                {
                                        (this.state.gymInfo.is_phone_verified) ? <img src={correct} style={{ height: '15px', marginLeft: '10px', marginTop: '5px' }} alt="verified" /> : <div></div>
                                    }
                                </label>
                                <Form.Item style={{ width: '100%' }} hasFeedback validateStatus={this.state.phone_no_stat}>
                                    <Input placeholder="Mobile No" value={this.state.phone_no} id="phone_no" onChange={this.handleText} />
                                </Form.Item>
                            </div>
                            <div className="flex-2">
                                <Button className="gen-btn uk-margin-left mt-8" loading={this.state.btnloding} onClick={() => this.showModal(2)}>Update</Button>
                                {

                                    (this.state.gymInfo.is_phone_verified) ? <div></div> : <Button className="gen-btn uk-margin-left mt-8" loading={this.state.btnloding} style={{ background: 'rgba(255, 185, 51, 1)' }} onClick={() => this.showModal(4)}>Verify</Button>
                                }

                            </div>

                        </div>
                        <div className="flex" style={{ display: `${this.state.otp_togg}` }}>
                            <div>
                                <label className="label-title">Enter OTP</label>
                                <Form.Item style={{ width: '100%' }} hasFeedback validateStatus={this.state.otp_stat}>
                                    <Input placeholder="Enter OTP" value={this.state.otp} id="otp" onChange={this.handleText} />
                                </Form.Item>
                                <Button type="dashed" className="mb-4" style={{ marginTop: '-7px' }} loading={this.state.btnloding} onClick={this.verifyOtp}>Verify</Button>
                            </div>

                        </div>




                    </div>
                    <div style={{ border: '1px solid #29435D', borderStyle: 'dashed', padding: '20px' }}>
                        <div className="flex mt-4">
                            <div className="flex-1">
                                <label className="label-title">Address</label>
                                <Input placeholder="Address" value={this.state.address} id="address" onChange={this.handleText} />
                            </div>
                            <div className="flex-1 uk-margin-left">
                                <label className="label-title">Gym Name</label>
                                <Input placeholder="Gym Name" value={this.state.gym_name} id="gym_name" onChange={this.handleText} />
                            </div>

                        </div>
                        <Button className="gen-btn uk-margin-top" loading={this.state.btnloding} onClick={() => this.showModal(3)}>Update Address & Gym Name</Button>
                    </div>


                </div>
                <h1 className="page-head-sub">Change Password</h1>

                <div className="mt-4">
                    {
                        this.state.updatePass
                    }
                </div>
                <h1 className="page-head-sub">Delete Account</h1>

                <div className="mt-4">
                    {
                        this.state.deleteAcc
                    }
                </div>
            </div>
        )
    }
}
