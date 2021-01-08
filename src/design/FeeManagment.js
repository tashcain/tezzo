import React, { Component } from 'react';
import { Select, message } from 'antd';
import { Radio, Button } from 'antd';
import { Table, Divider, notification, Popconfirm, Modal, Input } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PageHeader } from 'antd';
import ApiRoutes from '../config/ApiRoutes';

const { Option } = Select;
const { Column } = Table;


export default class FeeManagment extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            memberData: [],
            filterType: 'id',
            temp: [],
            feeDetails: null,
            feeArr: [],
            memberId: null,
            loadingBtn: false,
            tableLoading: false,
            visible: false,
            month: 1,
            fee_amount: 0,
            reminder_loading: false
        }
    }
    componentDidMount() {
        document.title = " Tezzo - Fee Managment"
        this.fetchAllMembers();

    }
    fetchAllMembers = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        this.setState({
            tableLoading: true
        })
        axios.post(ApiRoutes.api_route + '/member/all-members', {
            gymId: lc
        })
            .then(res => {
                this.setState({
                    memberData: res.data,
                    temp: res.data,
                    tableLoading: false

                })
                console.log(res.data)
            })
            .catch(err => console.log(err))
    }
    onChangeSelect = (value) => {
        this.setState({
            tableLoading: true
        })
        axios.post(ApiRoutes.api_route + '/member/getmemberbyid', {
            id: value
        })
            .then(res => {
                console.log(res.data)
                // var tempArray = [];
                // tempArray.push(res.data.msg)
                this.setState({
                    feeDetails: res.data.msg,
                    feeArr: res.data.msg.fee.reverse(),
                    memberId: res.data.msg._id,
                    tableLoading: false
                })
            })
        console.log(`selected ${value}`);
    }


    onSearchSelect = (value) => {
        this.setState({
            tableLoading: true
        })
        axios.post(ApiRoutes.api_route + '/member/getmemberbyid', {
            id: value
        })
            .then(res => {
                console.log(res.data)
                // var tempArray = [];
                // tempArray.push(res.data.msg)
                this.setState({
                    feeDetails: res.data.msg,
                    feeArr: res.data.msg.fee,
                    memberId: res.data.msg._id,
                    tableLoading: false
                })
            })
        console.log(`selected ${value}`);

    }
    onChange = (e) => {
        this.setState({
            filterType: e.target.value
        })
        console.log(`radio checked:${e.target.value}`);
    }
    onBlur = () => {
        this.setState({
            memberData: this.state.temp
        })
    }
    payFee = (a) => {
        this.setState({
            tableLoading: true
        })
        // e.setAttribute("loading", "true")
        //ant-click-animating-without-extra-node
        console.log(a);
        axios.post(ApiRoutes.api_route + '/member/payfee', {
            id: this.state.memberId,
            date: a.date,
            month: a.month,
            year: a.year,
            monthID: a.id
        })
            .then(res => {
                if (res.data === 'done') {
                    this.onChangeSelect(this.state.memberId);
                    notification.success({
                        message: 'Payment Status Updated Succesfully'
                    })
                    this.setState({
                        tableLoading: false
                    })
                }
                else {
                    notification.error({
                        message: 'Some error occured, Please Try Again'
                    })
                    this.setState({
                        tableLoading: false
                    })
                }


            })
            .catch(err => console.log(err));
    }
    confirmPop = (e) => {
        this.setState({
            tableLoading: true
        })
        console.log(e);
        axios.post(ApiRoutes.api_route + '/member/cancelfee', {
            id: this.state.memberId,
            fee_id: e

        })
            .then(res => {
                if (res.data === 'done') {
                    this.onChangeSelect(this.state.memberId);
                    notification.success({
                        message: 'Payment Cancelled Succesfully'
                    })
                    this.setState({
                        tableLoading: false
                    })
                }
                else {
                    notification.error({
                        message: 'Some error occured, Please Try Again'
                    })
                    this.setState({
                        tableLoading: false
                    })
                }


            })
            .catch(err => console.log(err));

    }

    cancelPop = (e) => {
        console.log(e);

    }
    handleText = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleOk = e => {

        if (isNaN(this.state.month)) {
            notification.warning({
                message: `Enter a valid Number, ${this.state.month} is not a number`
            })
        } else {
            if (isNaN(this.state.fee_amount)) {
                notification.warning({
                    message: `Enter a valid Number, ${this.state.fee_amount} is not a number`
                })
            } else {
                axios.post(ApiRoutes.api_route + '/member/add-fee', {
                    id: this.state.memberId,
                    for_next: this.state.month,
                    amount: this.state.fee_amount,
                    online: false,
                    next_due: this.state.feeDetails.next_due,
                    next_due_iso: this.state.feeDetails.next_due_iso
                })
                    .then(res => {
                        console.log(res.data);
                        if (res.data.success) {
                            this.setState({
                                visible: false
                            })
                            this.onSearchSelect(this.state.memberId)
                            notification.success({
                                message: 'Fee Added Successfully !'
                            })

                        }
                    })
                    .catch(err => console.log(err))
            }

        }
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    sendReminder = (id) => {
        this.setState({
            reminder_loading: true
        })
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')

        axios.post(ApiRoutes.api_route + '/reminder/add-reminder', {
            member_id: id,
            gymId: lc
        })
            .then(res => {
                console.log(res.data)
                if (res.data.success) {
                    notification.success({
                        message: 'Reminder Sent Successfully !'
                    })
                } else {
                    notification.warning({
                        message: 'Some Error Occured, Try Again !'
                    })
                }
                this.setState({
                    reminder_loading: false
                })

            })
            .catch(err => {
                console.log(err);
                this.setState({
                    reminder_loading: false
                })
            })
    }
    render() {
        return (
            <div>
                <Modal
                    title="Add Fee"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Input addonBefore="For next" addonAfter="Months" value={this.state.month} id="month" onChange={this.handleText} placeholder="No. of months" />
                    <br />
                    <br />
                    <Input addonBefore="₹" addonAfter="/-" value={this.state.fee_amount} id="fee_amount" onChange={this.handleText} placeholder="Fee Amount" />

                </Modal>
                <h1 className="page-head">Fee Managment</h1>
                <div uk-grid="true">

                    <div className="uk-width-1-3@m">
                        <div className="uk-card uk-card-default uk-card-body">

                            <h3 className="set-heading">Search Member </h3>
                            <div>
                                <Radio.Group onChange={this.onChange} defaultValue={this.state.filterType}>
                                    <Radio.Button value="id">Member ID</Radio.Button>
                                    <Radio.Button value="name">Member Name</Radio.Button>

                                </Radio.Group>
                                <div className="mt-4">
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Select a person"
                                        optionFilterProp="children"
                                        onChange={this.onChangeSelect}
                                        onSearch={this.onSearchSelect}

                                        filterOption={(input, option) => {
                                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        }
                                    >
                                        {
                                            (this.state.filterType === 'name') ?
                                                this.state.memberData.map((data, index) => (
                                                    <Option value={data._id} key={index} >{`${data.firstname}${data.lastname}`}</Option>
                                                ))
                                                : this.state.memberData.map((data, index) => (
                                                    <Option value={data._id} key={index} >{data.membership_no}</Option>
                                                ))
                                        }

                                    </Select>
                                    <Button className="gen-btn ml-2" onClick={this.findMember}>Find</Button>

                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="uk-width-expand@m">
                        <div className="uk-card uk-card-default uk-card-body">
                            {
                                (this.state.feeDetails)
                                    ? <PageHeader
                                        style={{
                                            border: '1px solid rgb(235, 237, 240)',
                                        }}
                                        onBack={() => null}
                                        title={`${this.state.feeDetails.firstname} ${this.state.feeDetails.lastname} (${this.state.feeDetails.doj})`}
                                        subTitle={`${this.state.feeDetails.email} - ${this.state.feeDetails.mobile_no}`}
                                    >
                                        <Button className="gen-btn ml-2" loading={this.state.reminder_loading} onClick={() => this.sendReminder(this.state.feeDetails._id)}>Send Reminder</Button>
                                        <Button className="gen-btn ml-2" onClick={() => { this.setState({ visible: true }) }}
                                            style={{ background: '#fff', border: '1px solid #38CB84', color: '#29435d', fontWeight: '600' }} >
                                            Add Fee
                                            </Button>

                                    </PageHeader>
                                    : <div></div>
                            }

                            <Table dataSource={this.state.feeArr} loading={this.state.tableLoading} >

                                <Column title="Paid On" dataIndex="paid_on" key="paid_on" />
                                <Column title="Paid For" dataIndex="paid_for" key="paid_for"
                                    render={(paid_for) => (
                                        <span>{`next ${paid_for} month`}</span>
                                    )}
                                />
                                <Column title="Amount" dataIndex="amount" key="amount" />
                                <Column title="Due Date" dataIndex="due_on" key="due_on" />



                                {/* Paid h to Paid Likha Aayega or Cancle ka button  Unpaid h to Pay Ka button Display krnana h   */}
                                <Column
                                    title="Action"
                                    key="online"

                                    render={(online) => (
                                        <span>
                                            {

                                                (online.online) ? <div>
                                                    <Button className="gen-btn ml-2" disabled={true} >Cancel Payment</Button>

                                                </div>
                                                    : <div>


                                                        <Popconfirm
                                                            title="Are you sure cancel this payment ?"
                                                            onConfirm={(e) => this.confirmPop(online.id)}
                                                            onCancel={this.cancelPop}
                                                            okText="Yes"
                                                            cancelText="No"
                                                        >
                                                            <Link to="#">Cancel Paymet</Link>
                                                        </Popconfirm>

                                                    </div>
                                            }

                                        </span>
                                    )}
                                />
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
