import React, { Component } from 'react';
import { Select, Button, Radio, notification } from 'antd';
import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';


const { Option } = Select;

export default class SendWorkout extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            memberData: [],
            temp: [],
            filterType: 'id',
            dietArr: [],
            member_id: '',
            diet_id: ''

        }
    }
    componentDidMount() {
        document.title = " Tezzo - Send Diet"
        this.fetchAllMembers();

    }
    fetchAllMembers = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')
        axios.post(ApiRoutes.api_route + '/member/all-members', {
            gymId: lc
        })
            .then(res => {
                this.setState({
                    memberData: res.data,
                    temp: res.data,


                })
                console.log(res.data)
            })
            .catch(err => console.log(err))
        axios.post(ApiRoutes.api_route + '/gprofile/fetch-workout-loop', {
            gymId: lc
        })
            .then(res => {
                this.setState({
                    dietArr: res.data.msg


                })
                console.log(res.data)
            })
            .catch(err => console.log(err))
    }

    onChange = (e) => {
        this.setState({
            filterType: e.target.value
        })
        console.log(`radio checked:${e.target.value}`);
    }
    onChangeSelect = (value) => {

        this.setState({
            member_id: value
        })
        console.log(`selected ${value}`);
    }


    onSearchSelect = (value) => {

        this.setState({
            member_id: value
        })
        console.log(`selected ${value}`);

    }
    onChangeSelectDiet = (value) => {
        this.setState({
            diet_id: value
        })

        console.log(`Die selected ${value}`);
    }


    onSearchSelectDiet = (value) => {


        this.setState({
            diet_id: value
        })
        console.log(`Diet selected ${value}`);

    }
    SendDiet = () => {

        if (this.state.member_id === "") {
            return notification.warning({
                message: "Please Select Member !"
            })
        }
        if (this.state.diet_id === "") {
            return notification.warning({
                message: "Please Select Workout !"
            })
        }
        this.setState({
            loading: true
        })
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref')

        axios.post(ApiRoutes.api_route + '/workout/send-workout', {
            member_id: this.state.member_id,
            workout_id: this.state.diet_id,
            gymId: lc
        })
            .then(res => {
                console.log(res.data);
                if (res.data.success) {
                    notification.success({
                        message: "Workout Sent Succesfully"
                    })
                    this.setState({
                        diet_id: "",
                        member_id: ""
                    })

                }
                this.setState({
                    loading: false
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loading: false
                })
            })
    }
    render() {
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">

                    <h3 className="set-heading">Send Diet </h3>
                    <div>
                        <Radio.Group onChange={this.onChange} defaultValue={this.state.filterType}>
                            <Radio.Button value="id">Member ID</Radio.Button>
                            <Radio.Button value="name">Member Name</Radio.Button>

                        </Radio.Group>
                        <div className="mt-4">
                            <h3 className="set-heading" style={{ fontSize: '16px' }}>Select Member </h3>

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

                        </div>
                        <div className="mt-4">
                            <h3 className="set-heading" style={{ fontSize: '16px' }}>Select Workout </h3>

                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                onChange={this.onChangeSelectDiet}
                                onSearch={this.onSearchSelectDiet}

                                filterOption={(input, option) => {
                                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                }
                            >
                                {
                                    this.state.dietArr.map((data, index) => (
                                        <Option value={data._id} key={index} >{`${data.plan_name}`}</Option>
                                    ))
                                }
                            </Select>

                        </div>
                        <Button className="gen-btn mt-4" loading={this.state.loading} onClick={this.SendDiet}>Send Workout</Button>

                    </div>
                </div>
            </div>
        )
    }
}
