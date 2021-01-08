// SHUBHAM's FILEs

import React, { Component } from 'react';
import { Button, Popconfirm } from 'antd';
import Chef from '../icons/chef.png';
import { Table, Divider, Spin, notification } from 'antd';
import ManageDiet from '../components/ManageDiet';
import ViewDiet from '../components/ViewDiet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SendDiet from '../components/SendDiet';
import ApiRoutes from '../config/ApiRoutes';


const { Column } = Table;

export default class Diet extends Component {

    constructor() {
        super();
        this.state = {
            view: null,
            dietArray: [],
            tableLoading: false

        }
    }
    componentDidMount() {
        document.title = "Tezzo - Diet Plan Manager"
        this.fetchDiet();
    }
    fetchDiet = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref');
        this.setState({
            tableLoading: true
        })
        axios.post(ApiRoutes.api_route + '/diet/all-diet', {
            gym_id: lc
        })
            .then(res => {
                console.log(res.data);
                this.setState({
                    dietArray: res.data,
                    tableLoading: false
                })
            })
    }
    handleView = (e, id) => {
        if (e === 1) {
            console.log(e, id)
            this.setState({
                view: <ManageDiet updateDiet={this.fetchDiet} />
            })
        } else if (e === 2) {
            console.log(e, id)
            this.setState({
                view: <Spin />
            })
            axios.post(ApiRoutes.api_route + '/diet/getdietbyid', {
                id: id
            })
                .then(res => {

                    this.setState({

                        view: <ViewDiet diet_id={res.data.msg} />
                    })
                    console.log(res.data)
                })
                .catch(err => {
                    console.log(err);
                })

        } else if (e === 3) {
            console.log(e, id)
            this.setState({
                view: <SendDiet />
            })
        }

    }
    delDiet = (e) => {
        this.setState({
            tableLoading: true
        })
        axios.post(ApiRoutes.api_route + '/diet/deletedietbyid', {
            id: e
        })
            .then(res => {
                if (res.data === "deleted") {
                    notification.success({
                        message: 'Diet Deleted Successfully !'
                    })
                    this.fetchDiet();
                }

            })
            .catch(err => console.log(err))

    }
    cancel = () => {
        console.log('Cancel')
    }
    render() {
        return (
            <div>
                <div className="flex">
                    <h1 className="page-head">Diet Plan Manager</h1>
                    <img src={Chef} alt="diet-logo" className="ml-4 mt-6" style={{ height: '50px' }} />
                </div>
                <div uk-grid="true">

                    <div className="uk-width-1-3@m">
                        <div className="uk-card uk-card-default uk-card-body">

                            <h3 className="set-heading">Create Diet Plan</h3>
                            <Button className="gen-btn mt-2" onClick={() => this.handleView(1, null)}>Add Diet</Button>
                            <Button className="gen-btn mt-2 uk-margin-left" style={{ background: '#2c3e50' }} onClick={() => this.handleView(3, null)}>Send Diet</Button>

                            <Table dataSource={this.state.dietArray} loading={this.state.tableLoading} >

                                <Column title="Diet Name" dataIndex="diet_name" key="diet_name" />

                                <Column
                                    title="Action"
                                    key="_id"
                                    render={(_id, record) => (
                                        <span>
                                            <Link to="#" onClick={() => this.handleView(2, _id._id)}>View</Link>
                                            <Divider type="vertical" />
                                            <Popconfirm
                                                title="Are you sure delete this Diet?"
                                                onConfirm={() => this.delDiet(_id._id)}
                                                onCancel={this.cancel}
                                                okText="Yes"
                                                cancelText="No"
                                            >

                                                <Link to="#">Delete</Link>
                                            </Popconfirm>
                                        </span>
                                    )}
                                />
                            </Table>
                        </div>
                    </div>
                    <div className="uk-width-expand@m">
                        {
                            this.state.view
                        }
                    </div>
                </div>
            </div>
        )
    }
}
