import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Divider, Button, Modal, Input, Radio, notification, Select, Form, Alert } from 'antd';
import { Drawer } from 'antd';
import Mem from '../icons/membership.png';
import { PageHeader } from 'antd';
import axios from 'axios';
import { DatePicker, Popconfirm } from 'antd';
import ApiRoutes from '../config/ApiRoutes';
import gym_boy from '../asset/images/gym_boy.png'
import gym_girl from '../asset/images/gym_girl.png'

const { Column } = Table;
const { Option } = Select;
const InputGroup = Input.Group;

export default class Members extends Component {
    constructor() {
        super();
        this.state = {
            arr: [],
            visible: false,
            visibleDrawer: false,
            membership_no: '',
            email: '',
            f_name: '',
            l_name: '',
            height: '',
            weight: '',
            disease: '',
            dob: '',
            doj: '',
            gender: '',
            age: 0,
            mobile_no: '',
            memberData: [],
            filterType: 'name',
            temp: [],
            id: null,
            loadingTable: false,
            memberinfo: {}

        }
    }

    componentDidMount() {
        document.title = "Tezzo - Members"
        this.fetchAllMem();
    }
    fetchAllMem = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        this.setState({
            loadingTable: true
        })
        axios.post(ApiRoutes.api_route + '/member/all-members', {
            gymId: lc
        })
            .then(res => {
                this.setState({
                    memberData: res.data.reverse(),
                    temp: res.data,
                    loadingTable: false
                })
                console.log(res.data)
            })
            .catch(err => console.log(err))
    }

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    showModal = () => {
        this.setState({
            visible: true,

        });
        if (this.state.memberData.length !== 0) {
            let memno = parseInt(this.state.memberData[0].membership_no) + 1;
            this.setState({
                membership_no: memno
            })
        } else {
            this.setState({
                membership_no: 1000
            })
        }

    };
    showDrawer = (e) => {
        axios.post(ApiRoutes.api_route + '/member/getmemberbyid', {
            id: e
        })
            .then(res => {
                const { membership_no, age, firstname, lastname, gender, height, weight, disease, dob, doj, email, address, mobile_no, _id } = res.data.msg;
                this.setState({
                    membership_no,
                    age,
                    height,
                    weight,
                    disease,
                    doj,
                    dob,
                    email,
                    address,
                    gender,
                    f_name: firstname,
                    l_name: lastname,
                    mobile_no,
                    id: _id,
                    memberinfo: res.data.msg
                })
                console.log(res.data)
            })
            .catch(err => console.log(err))
        this.setState({
            visibleDrawer: true,
        });
    };

    onClose = () => {
        this.setState({
            visibleDrawer: false,
        });
    };
    onChangeText = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    onChangeGender = (e) => {
        this.setState({
            gender: e.target.value
        })
        console.log(`radio checked:${e.target.value}`);
    }
    onChangeDOB = (date, dateString) => {
        this.setState({
            dob: dateString
        })
        console.log(date, dateString);
    }
    onChangeDOJ = (date, dateString) => {
        this.setState({
            doj: dateString
        })
        console.log(date, dateString);
    }
    addMember = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref');

        const { membership_no, age, f_name, l_name, gender, height, weight, disease, dob, doj, email, address, mobile_no } = this.state;
        if (f_name.length === 0) {
            return notification.warning({
                message: "First Name Can't Be Empty !"
            })
        }
        if (gender.length === 0) {
            return notification.warning({
                message: "Gender Can't Be Empty !"
            })
        }
        if (mobile_no.length === 0) {
            return notification.warning({
                message: "Mobile Number Can't Be Empty !"
            })
        }

        if (mobile_no.length !== 10) {
            return notification.warning({
                message: 'Invalid Mobile Number, Please Check'
            })
        }
        if (dob.length === 0) {
            return notification.warning({
                message: "Date Of Birth Can't Be Empty !"
            })
        }
        if (doj.length === 0) {
            return notification.warning({
                message: "Date Of Joining Can't Be Empty !"
            })
        }



        this.setState({
            loadingAddMember: true,
            loadingTable: true
        })
        axios.post(ApiRoutes.api_route + '/member/addmember', {
            membership_no,
            f_name,
            l_name,
            gender,
            height,
            weight,
            disease,
            dob,
            doj,
            email,
            address,
            age,
            mobile_no,
            gymId: lc

        })
            .then(res => {

                if (res.data.sucsess) {
                    this.setState({
                        visible: false,
                        membership_no: '',
                        email: '',
                        f_name: '',
                        l_name: '',
                        height: '',
                        weight: '',
                        disease: '',
                        dob: '',
                        doj: '',
                        gender: '',
                        age: 0,
                        mobile_no: '',
                        loadingTable: false
                    })
                    this.fetchAllMem();
                    notification.success({
                        message: `Member Added Succesfully !`,
                        description:
                            'Member Added Succesfully, Click on view profile to check',
                        placement: 'bottomRight'
                    })
                    this.setState({
                        loadingAddMember: false
                    })


                } else {
                    if (res.data.msg === 'Mobile No Already Exists') {
                        notification.warning({
                            message: "Member with this mobile number already exists !"
                        })
                    } else if (res.data.msg === 'Email Already Exists') {
                        notification.warning({
                            message: "Member with this Email already exists !"
                        })
                    }
                    this.setState({
                        loadingAddMember: false,
                        loadingTable: false
                    })
                }
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loadingAddMember: false,
                    loadingTable: false
                })
            })
    }
    delUser = (e) => {
        this.setState({
            loadingTable: true
        })

        console.log(e);
        axios.post(ApiRoutes.api_route + '/member/deletememberbyid', {
            id: e._id
        })
            .then(res => {
                this.setState({
                    visibleDrawer: false
                })
                console.log(res.data);
                notification.success({
                    message: `Member Deleted Succesfully !`,
                    placement: 'bottomRight'
                })
                this.fetchAllMem();

            })
    }
    handleFilter = value => {
        this.setState({
            filterType: value
        })

    }
    onChangeSelect = (value) => {
        axios.post(ApiRoutes.api_route + '/member/getmemberbyid', {
            id: value
        })
            .then(res => {
                console.log(res.data.msg);
                var tempArray = [];
                tempArray.push(res.data.msg)
                this.setState({
                    memberData: tempArray
                })
            })
        console.log(`selected ${value}`);
    }


    onSearchSelect = (val) => {
        console.log(val);
        // axios.post(ApiRoutes.api_route + '/member/getmemberbyid', {
        //     id: val
        // })
        //     .then(res => {
        //         this.setState({
        //             memberData: res.data.msg
        //         })
        //     })

    }
    onBlur = () => {
        this.setState({
            memberData: this.state.temp
        })
    }
    updateMember = () => {
        this.setState({
            loadingUpdateMember: true
        })
        const { membership_no, age, f_name, l_name, gender, height, weight, disease, dob, doj, email, address, mobile_no } = this.state;
        axios.post(ApiRoutes.api_route + '/member/update-member', {
            id: this.state.id,
            membership_no,
            firstname: f_name,
            lastname: l_name,
            gender,
            height,
            weight,
            disease,
            dob,
            doj,
            email,
            address,
            age,
            mobile_no
        })
            .then(res => {
                console.log(res.data);

                this.setState({
                    loadingUpdateMember: false
                });
                notification.success({
                    message: `Member Updated Succesfully !`,
                    placement: 'bottomRight'
                });
                this.fetchAllMem();
            })
            .catch(err => console.log(err))
    }
    cancel = () => {
        console.log('cancel');
    }
    addStatusDrop = (status, id) => {

        let stat = "";
        if (status === 1) {
            stat = "success"
        } else if (status === 2) {
            stat = "warning"
        } else if (status === 3) {
            stat = "error"
        }
        return <Form.Item style={{ marginBottom: '0px' }} hasFeedback validateStatus={stat}>
            <Select

                style={{ width: '100%' }}
                defaultValue={`${status}`}
                onChange={(e) => this.handleStatus(e, status, id)}
            >

                <Option value="1" >Active</Option>
                <Option value="2" >Expired</Option>
                <Option value="3" >Banned</Option>



            </Select>
        </Form.Item>
    }
    handleStatus(tg, value, id) {
        axios.post(ApiRoutes.api_route + '/member/update-status', {
            status: tg,
            id
        })
            .then(res => {
                if (res.data.success) {
                    this.fetchAllMem()
                } else {
                    notification.warning({
                        message: "Some error occured, try after sometime !"
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    onFilter = (st) => {
        if (st === 1) {
            let newArr = this.state.memberData.filter((dt) => {
                return dt.status === 1;
            })
            this.setState({
                memberData: newArr
            })
        } else if (st === 2) {
            let newArr = this.state.memberData.filter((dt) => {
                return dt.status === 2;
            })
            this.setState({
                memberData: newArr
            })
        } else if (st === 3) {
            let newArr = this.state.memberData.filter((dt) => {
                return dt.status === 3;
            })
            this.setState({
                memberData: newArr
            })
        }
    }
    setAlert = (st) => {
        if (st === 1) {
            return <Alert
                message="Active"
                description={`Due Date : ${this.state.memberinfo.next_due}`}
                type="success"
                showIcon
            />
        } else if (st === 2) {
            return <Alert
                message="Active"
                description={`Due Date : ${this.state.memberinfo.next_due}`}
                type="warning"
                showIcon
            />

        } else if (st === 3) {
            return <Alert
                message="Banned "
                type="error"
                showIcon
            />
        }
    }
    render() {
        return (
            <div>
                <Modal
                    title="Add Member"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width={700}
                >
                    <div className="pl-4 pr-4">
                        <div className="flex">
                            <div className="flex-1">
                                <label className="label-title">Membership No.</label>
                                <Input placeholder="Email" id="membership_no" disabled={true} onChange={this.onChangeText} value={this.state.membership_no} />
                            </div>
                            <div className="flex-1 uk-margin-left">
                                <label className="label-title">Email  </label>
                                <Input placeholder="First Name" id="email" onChange={this.onChangeText} value={this.state.email} />
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="flex-1">
                                <label className="label-title">First Name <span style={{ color: 'red' }}>*</span></label>
                                <Input placeholder="First Name" id="f_name" onChange={this.onChangeText} value={this.state.f_name} />
                            </div>
                            <div className="flex-1 uk-margin-left">
                                <label className="label-title">Last Name</label>
                                <Input placeholder="Last Name" id="l_name" onChange={this.onChangeText} value={this.state.l_name} />
                            </div>
                            <div className="flex-1 uk-margin-left">
                                <label className="label-title">Gender <span style={{ color: 'red' }}>*</span></label>
                                <Radio.Group onChange={this.onChangeGender} defaultValue="">
                                    <Radio.Button value="male">Male</Radio.Button>
                                    <Radio.Button value="female">Female</Radio.Button>

                                </Radio.Group>
                            </div>

                        </div>
                        <div className="flex mt-4">
                            <div className="flex-1">
                                <label className="label-title">Address</label>
                                <Input placeholder="Address" id="address" onChange={this.onChangeText} value={this.state.address} />
                            </div>
                            <div className="flex-2 uk-margin-left">
                                <label className="label-title">Mobile No <span style={{ color: 'red' }}>*</span></label>
                                <Input placeholder="Mobile No" id="mobile_no" onChange={this.onChangeText} value={this.state.mobile_no} />
                            </div>


                        </div>
                        <div className="flex mt-4">
                            <div className="flex-1">
                                <label className="label-title">Height</label>
                                <Input placeholder="Height" id="height" onChange={this.onChangeText} value={this.state.height} />
                            </div>
                            <div className="flex-1 uk-margin-left">
                                <label className="label-title">Weight</label>
                                <Input placeholder="Weight" id="weight" onChange={this.onChangeText} value={this.state.weight} />
                            </div>
                            <div className="flex-1 uk-margin-left">
                                <label className="label-title">Disease</label>
                                <Input placeholder="If Any" id="disease" onChange={this.onChangeText} value={this.state.disease} />
                            </div>

                        </div>
                        <div className="flex mt-4">
                            <div className="flex-1">
                                <label className="label-title">Date of Birth <span style={{ color: 'red' }}>*</span></label>
                                <br />

                                <DatePicker format="DD-MM-YYYY" onChange={this.onChangeDOB} />
                            </div>
                            <div className="flex-1 uk-margin-left">
                                <label className="label-title">Date of Joining <span style={{ color: 'red' }}>*</span></label>
                                <br />
                                <DatePicker format="DD-MM-YYYY" onChange={this.onChangeDOJ} />
                            </div>

                        </div>
                        <Button className="gen-btn mt-4" onClick={this.addMember}>Add Member</Button>

                    </div>
                </Modal>
                <Drawer
                    title="Member Info"
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visibleDrawer}
                    width={1000}

                >
                    <PageHeader
                        title={`${this.state.f_name} ${this.state.l_name}`}
                        style={{
                            border: '1px solid rgb(235, 237, 240)',
                        }}

                        extra={[
                            <Button key="3" onClick={this.updateMember} loading={this.state.loadingUpdateMember} >Save Changes</Button>,
                            <Popconfirm
                                title="Are you sure delete this member?"
                                onConfirm={() => this.delUser(this.state.memberinfo)}
                                onCancel={this.cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className="gen-btn-red" key="1" type="primary">
                                    Delete
      </Button>

                            </Popconfirm>
                            ,

                        ]}
                        avatar={{ src: `${(this.state.gender === 'male') ? gym_boy : gym_girl}` }}

                    >
                        <div className="pl-20 pr-20">
                            {
                                this.setAlert(this.state.memberinfo.status)
                            }
                            <br />

                            <div className="flex">
                                <div className="flex-1">
                                    <label className="label-title">Membership No.</label>
                                    <Input placeholder="Email" id="membership_no" onChange={this.onChangeText} disabled={true} value={this.state.membership_no} />
                                </div>
                                <div className="flex-1 uk-margin-left">
                                    <label className="label-title">Email</label>
                                    <Input placeholder="First Name" id="email" onChange={this.onChangeText} value={this.state.email} />
                                </div>
                            </div>
                            <div className="flex mt-4">
                                <div className="flex-1">
                                    <label className="label-title">First Name</label>
                                    <Input placeholder="First Name" id="f_name" onChange={this.onChangeText} value={this.state.f_name} />
                                </div>
                                <div className="flex-1 uk-margin-left">
                                    <label className="label-title">Last Name</label>
                                    <Input placeholder="Last Name" id="l_name" onChange={this.onChangeText} value={this.state.l_name} />
                                </div>
                                <div className="flex-1 uk-margin-left">
                                    <label className="label-title">Gender</label>
                                    <Radio.Group onChange={this.onChangeGender} defaultValue={this.state.gender}>
                                        <Radio.Button value="male">Male</Radio.Button>
                                        <Radio.Button value="female">Female</Radio.Button>

                                    </Radio.Group>
                                </div>

                            </div>
                            <div className="flex mt-4">
                                <div className="flex-1">
                                    <label className="label-title">Address</label>
                                    <Input placeholder="Address" id="address" onChange={this.onChangeText} value={this.state.address} />
                                </div>
                                <div className="flex-2 uk-margin-left">
                                    <label className="label-title">Mobile No</label>
                                    <Input placeholder="Mobile No" id="mobile_no" onChange={this.onChangeText} value={this.state.mobile_no} />
                                </div>


                            </div>
                            <div className="flex mt-4">
                                <div className="flex-1">
                                    <label className="label-title">Height</label>
                                    <Input placeholder="Height" id="height" onChange={this.onChangeText} value={this.state.height} />
                                </div>
                                <div className="flex-1 uk-margin-left">
                                    <label className="label-title">Weight</label>
                                    <Input placeholder="Weight" id="weight" onChange={this.onChangeText} value={this.state.weight} />
                                </div>
                                <div className="flex-1 uk-margin-left">
                                    <label className="label-title">Disease</label>
                                    <Input placeholder="If Any" id="disease" onChange={this.onChangeText} value={this.state.disease} />
                                </div>

                            </div>
                            <div className="flex mt-4">
                                <div className="flex-1">
                                    <label className="label-title">Date of Birth</label>
                                    <br />

                                    <DatePicker format="DD-MM-YYYY" placeholder={this.state.dob} onChange={this.onChangeDOB} />
                                </div>
                                <div className="flex-1 uk-margin-left">
                                    <label className="label-title">Date of Joining</label>
                                    <br />
                                    <label className="label-title">{this.state.doj}</label>

                                </div>

                            </div>
                        </div>

                    </PageHeader>
                </Drawer>
                <div className="flex">
                    <h1 className="page-head">Members</h1>
                    <img src={Mem} alt="diet-logo" className="ml-4 mt-6" style={{ height: '50px' }} />
                </div>

                <nav className="uk-navbar-container" uk-navbar="true" style={{ background: '#fff' }}>

                    <div className="uk-navbar-left">

                        <ul className="uk-navbar-nav mr-left">
                            <li className="uk-active"><Link to="#">
                                Members Table
                            </Link></li>
                            <li>
                                <Link to="#">
                                    <InputGroup compact>
                                        <Select defaultValue="name" onChange={this.handleFilter}>
                                            <Option value="name">Name</Option>
                                            <Option value="no">Membership No</Option>
                                        </Select>
                                        <Select
                                            showSearch
                                            style={{ width: 200 }}
                                            placeholder="Select a person"
                                            optionFilterProp="children"
                                            onChange={this.onChangeSelect}
                                            onSearch={this.onSearchSelect}
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {
                                                (this.state.filterType === 'name') ?
                                                    this.state.temp.map((data, index) => (
                                                        <Option value={data._id} key={index} >{`${data.firstname}${data.lastname}`}</Option>
                                                    ))
                                                    : this.state.temp.map((data, index) => (
                                                        <Option value={data._id} key={index} >{data.membership_no}</Option>
                                                    ))
                                            }


                                        </Select>
                                    </InputGroup>
                                </Link>
                            </li>
                            <li>
                                <Link to="#">


                                    <Button className="gen-btn" style={{ background: '#2ecc71' }} onClick={() => this.onFilter(1)}>Active</Button>

                                    <Button className="gen-btn uk-margin-left" style={{ background: '#f1c40f' }} onClick={() => this.onFilter(2)}>Expired</Button>

                                    <Button className="gen-btn uk-margin-left" style={{ background: '#e74c3c' }} onClick={() => this.onFilter(3)}>Banned</Button>

                                    <Button className="gen-btn  uk-margin-left" onClick={this.onBlur}>Reset</Button>

                                </Link>
                            </li>
                        </ul>

                    </div>

                    <div className="uk-navbar-right">

                        <ul className="uk-navbar-nav mr-right">

                            <li><Link to="#">
                                <Button className="gen-btn" loading={this.state.loadingAddMember} onClick={this.showModal}>Add Member</Button>
                            </Link></li>
                        </ul>

                    </div>

                </nav>
                <Table dataSource={this.state.memberData} loading={this.state.loadingTable} >

                    <Column title="Membership No." dataIndex="membership_no" key="membership_no" />
                    <Column title="Name" dataIndex="firstname" key="firstname" />
                    <Column title="Mobile No" dataIndex="mobile_no" key="mobile_no" />
                    <Column title="Joining Date" dataIndex="doj" key="doj" />
                    <Column title="Due Date" dataIndex="next_due" key="next_due" />
                    <Column
                        title="Status"
                        key="status"

                        render={(status) => (
                            <span>
                                {
                                    this.addStatusDrop(status.status, status._id)
                                }

                            </span>
                        )}
                    />
                    <Column
                        title="Action"
                        key="_id"
                        render={(_id, record) => (
                            <span>
                                <Link to="#" onClick={() => this.showDrawer(_id)}>View Profile {record.lastName}</Link>
                                <Divider type="vertical" />
                                <Popconfirm
                                    title="Are you sure delete this member?"
                                    onConfirm={() => this.delUser(_id)}
                                    onCancel={this.cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Link to="#" >Delete</Link>

                                </Popconfirm>
                            </span>
                        )}
                    />
                </Table>
            </div>
        )
    }
}