import React, { Component } from 'react';
import { Button } from 'antd';
import Chef from '../icons/chef.png';
import { Table, Divider, Spin, notification, Popconfirm } from 'antd';
import ManageWorkout from '../components/ManageWorkout';
import ViewWorkout from '../components/ViewWorkout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SendWorkout from '../components/SendWorkout';
import ApiRoutes from '../config/ApiRoutes';

const { Column } = Table;

export default class WorkoutPlan extends Component {
    constructor() {
        super();
        this.state = {
            view: null,
            dietArray: [
                {
                    id: 'ahxshjxhkjxs',
                    diet_name: 'Beginners Diet'
                }
            ],
            tableLoading: false
        }
    }
    componentDidMount() {
        document.title = "Tezzo - Workout Plan Manager"
        this.fetchWorkout();
    }
    fetchWorkout = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        this.setState({
            tableLoading: true
        })

        axios.post(ApiRoutes.api_route + '/workout/all-workout', {
            gym_id: lc
        })
            .then(res => {
                console.log(res.data);
                this.setState({
                    dietArray: res.data.msg,
                    tableLoading: false
                })
            })
    }
    handleView = (e, id) => {
        if (e === 1) {
            console.log(e, id)
            this.setState({
                view: <ManageWorkout updateDiet={this.fetchWorkout} />
            })
        } else if (e === 2) {
            console.log(e, id)
            this.setState({
                view: <ViewWorkout />
            })
            console.log(e, id)
            this.setState({
                view: <Spin />
            })
            axios.post(ApiRoutes.api_route + '/workout/getdietbyid', {
                id: id
            })
                .then(res => {

                    this.setState({

                        view: <ViewWorkout workout={res.data.msg} />
                    })
                    console.log(res.data)
                })
                .catch(err => {
                    console.log(err);
                })
        } else if (e === 3) {
            console.log(e, id)
            this.setState({
                view: <SendWorkout />
            })
        }

    }
    deleteWorkout = (e) => {
        this.setState({
            tableLoading: true
        })
        axios.post(ApiRoutes.api_route + '/workout/deletedietbyid', {
            id: e
        })
            .then(res => {
                if (res.data.success) {
                    notification.success({
                        message: "Workout plan deleted !"
                    })
                    this.fetchWorkout();

                } else {
                    notification.error({
                        message: "Some error occured, Try Again"
                    })
                }
                this.setState({
                    tableLoading: false
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    tableLoading: false
                })
            })
    }
    cancel = () => {
        console.log('Delete Cancel');
    }
    render() {
        return (
            <div>
                <div className="flex">
                    <h1 className="page-head">Workout Plan Manager</h1>
                    <img src={Chef} alt="diet-logo" className="ml-4 mt-6" style={{ height: '50px' }} />
                </div>
                <div uk-grid="true">

                    <div className="uk-width-1-3@m">
                        <div className="uk-card uk-card-default uk-card-body">

                            <h3 className="set-heading">Create Workout Plan</h3>
                            <Button className="gen-btn mt-2" onClick={() => this.handleView(1, null)}>Add Workout</Button>
                            <Button className="gen-btn mt-2 uk-margin-left" style={{ background: '#2c3e50' }} onClick={() => this.handleView(3, null)}>Send Workout</Button>

                            <Table loading={this.state.tableLoading} dataSource={this.state.dietArray}>

                                <Column title="Workout Plan" dataIndex="plan_name" key="plan_name" />

                                <Column
                                    title="Action"
                                    key="action"
                                    render={(action) => (
                                        <span>
                                            <Link to="#" onClick={() => this.handleView(2, action._id)}>View</Link>
                                            <Divider type="vertical" />
                                            <Popconfirm
                                                title="Are you sure delete this Diet?"
                                                onConfirm={() => this.deleteWorkout(action._id)}
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
