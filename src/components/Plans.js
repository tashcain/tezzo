import React, { Component } from 'react';
import { Input, Button, InputNumber, Table, Popconfirm, notification } from 'antd';
import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';
import { Link } from 'react-router-dom'
const { Column } = Table;

export default class Plans extends Component {
    constructor() {
        super();
        this.state = {
            plan_name: '',
            plan_price: 1,
            plan_time: 1,
            btnloding: false,
            loadingTable: true,
            planData: []

        }
    }
    componentDidMount() {
        this.fetchPlan();
    }

    fetchPlan = () => {
        this.setState({
            loadingTable: true
        })
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        axios.post(ApiRoutes.api_route + '/plan/get-plan', {
            gymId: lc
        })
            .then(res => {
                console.log(res.data);
                this.setState({
                    planData: res.data.data
                })
            })
            .catch(err => {
                console.log(err);
            })
        this.setState({
            loadingTable: false
        })

    }
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    onChangePlan = (value) => {
        this.setState({
            plan_time: value
        })
    }
    onChangePrice = (value) => {
        this.setState({
            plan_price: value
        })
    }

    addPlan = () => {
        this.setState({
            btnloding: true
        })
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        const { plan_name, plan_time, plan_price } = this.state;
        axios.post(ApiRoutes.api_route + '/plan/add-plan', {
            plan_name,
            plan_time,
            plan_price,
            gymId: lc
        })
            .then(res => {
                console.log(res.data);
                this.setState({
                    btnloding: false,
                    plan_name: '',
                    plan_price: 1,
                    plan_time: 1

                })
                notification.success({
                    message: 'Plan Added Successfully !'
                })
                this.fetchPlan();

            })
            .catch(err => {
                console.log(err);
                this.setState({
                    btnloding: false
                })
            })
    }
    cancel = () => {
        console.log('cancel')
    }
    delPlan = (id) => {
        axios.post(ApiRoutes.api_route + '/plan/del-plan', {
            plan_id: id.plan_id
        })
            .then(res => {
                console.log(res.data);
                notification.success({
                    message: 'Plan Deleted !'
                })
                this.fetchPlan();

            })
            .catch(err => {
                console.log(err);
            })
    }
    render() {
        return (
            <div>
                <h1 className="page-head-sub">Add Plan</h1>
                <div className="mt-4 mb-6" style={{ width: '50%' }}>
                    <label className="label-title">Plan Name</label>
                    <Input placeholder="Plan Name" type="text" id="plan_name" onChange={this.onChange} value={this.state.plan_name} />
                    <br />
                    <br />
                    <label className="label-title mr-6">Plan Duration (In Months)</label>
                    <br />
                    <InputNumber placeholder="Plan Duration" type="number" min={1} max={12} id="plan_time" onChange={this.onChangePlan} value={this.state.plan_time} />
                    <br />
                    <br />
                    <label className="label-title mr-6">Plan Price</label>
                    <br />
                    <InputNumber placeholder="Plan Price" type="number" min={1} id="plan_price" onChange={this.onChangePrice} value={this.state.plan_price} />
                    <br />
                    <br />
                    <Button className="gen-btn mt-8" loading={this.state.btnloding} onClick={this.addPlan}>Add Plan</Button>

                </div>
                <div className="mt-6 mb-6">
                    <h1 className="page-head-sub">All Plans</h1>
                    <Table dataSource={this.state.planData} loading={this.state.loadingTable} >

                        <Column title="Plan Name" dataIndex="plan_name" key="plan_name" />
                        <Column title="Duration" dataIndex="plan_time" key="plan_time" />
                        <Column title="Price" dataIndex="plan_price" key="plan_price" />

                        <Column
                            title="Action"
                            key="_id"
                            render={(_id, record) => (
                                <span>

                                    <Popconfirm
                                        title="Are you sure delete this member?"
                                        onConfirm={() => this.delPlan(_id)}
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

            </div>
        )
    }
}
