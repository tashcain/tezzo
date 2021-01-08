//  SHUBHAM'S PROFILE
import React, { Component } from 'react';
import { Button, Input } from 'antd';
import { Table, Divider, notification, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';

const { TextArea } = Input
const { Column } = Table;

export default class NoticeManager extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            descp: '',
            allNotice: [],
            tableLoading: false
        }
    }
    componentDidMount() {
        document.title = "Tezzo - Notice Manager";
        this.fetchNotice();
    }
    fetchNotice = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref');
        this.setState({
            tableLoading: true
        })
        Axios.post(ApiRoutes.api_route + '/notice/all-notice', {
            gymId: lc
        })
            .then(res => {
                this.setState({
                    allNotice: res.data,
                    tableLoading: false
                })
            })
            .catch(err => console.log(err))
    }
    onChangeText = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    addNotice = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        this.setState({
            tableLoading: true
        })
        Axios.post(ApiRoutes.api_route + '/notice/addnotice', {
            title: this.state.title,
            description: this.state.descp,
            gymId: lc
        })
            .then(res => {
                if (res.data.success) {
                    notification.success({
                        message: 'Notice Added Successfully !!'
                    })
                    this.setState({
                        title: '',
                        descp: '',
                        tableLoading: false
                    })
                    this.fetchNotice();
                }


            })
            .catch(err => console.log(err))
    }
    delNotice = (e) => {
        this.setState({
            tableLoading: true
        })
        Axios.post(ApiRoutes.api_route + '/notice/deletenoticebyid', {
            id: e
        })
            .then(res => {
                if (res.data === 'deleted') {

                    notification.success({
                        message: 'Notice Deleted !!'
                    })

                    this.fetchNotice();
                    this.setState({
                        tableLoading: false
                    })
                }
            })
            .catch(err => console.log(err));
    }
    cancel = () => {
        console.log('Cancel')
    }
    render() {
        return (
            <div>
                <h1 className="page-head">Notice Manager</h1>
                <div uk-grid="true">

                    <div className="uk-width-1-3@m">
                        <div className="uk-card uk-card-default uk-card-body">

                            <h3 className="set-heading">Add Notice </h3>
                            <div>

                                <div className="mt-4">
                                    <Input type="text" placeholder="Enter Title" onChange={this.onChangeText} id="title" value={this.state.title} />
                                    <br />
                                    <br />
                                    <TextArea value={this.state.descp} placeholder="Enter Description" id="descp" onChange={this.onChangeText} />
                                    <br />
                                    <br />
                                    <Button className="gen-btn ml-2" onClick={this.addNotice}>Add</Button>

                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="uk-width-expand@m">
                        <div className="uk-card uk-card-default uk-card-body">
                            <Table dataSource={this.state.allNotice}
                                loading={this.state.tableLoading}
                            >

                                <Column title="Title" dataIndex="title" key="title" />
                                <Column title="Description" dataIndex="description" key="description" />
                                <Column title="Date" dataIndex="date" key="date" />


                                {/* Paid h to Paid Likha Aayega or Cancle ka button  Unpaid h to Pay Ka button Display krnana h   */}
                                <Column
                                    title="Action"
                                    key="_id"
                                    dataIndex="_id"
                                    render={(_id, record) => (
                                        <span>

                                            <Divider type="vertical" />
                                            <Popconfirm
                                                title="Are you sure delete this Notice?"
                                                onConfirm={() => this.delNotice(_id)}
                                                onCancel={this.cancel}
                                                okText="Yes"
                                                cancelText="No"
                                            >

                                                <Link to="#"  >Delete</Link>
                                            </Popconfirm>
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
