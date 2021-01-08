// SHUBHAM'S FILE

import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';

const { Column } = Table;

export default class ViewDiet extends Component {
    constructor() {
        super();
        this.state = {
            color: ['#60AAFE', '#FFB933', '#9A5EF1', '#FFB933', '#60AAFE', '#FFB933', '#60AAFE', '#9A5EF1', '#38CB84', '#FFB933'],
            dietInfo: {}
        }
    }

    componentDidMount() {
        this.setState({
            dietInfo: this.props.diet_id
        })
    }
    // componentDidUpdate(prevProps) {
    //     // console.log(prevProps);
    //     console.log('current', this.props.diet_id);
    //     console.log('Prev', prevProps.diet_id.diet_id)
    //     // if (this.props.diet_id.diet_id !== prevProps.diet_id.diet_id) {
    //     //     this.updateAndNotify();
    //     // }

    // }
    delDiet = (e) => {
        let ansArr = this.state.dietInfo.diet.filter((data, key) => {
            return e.id !== data.id
        })
        axios.post(ApiRoutes.api_route + '/diet/update-diet', {
            diet_name: this.state.dietInfo.diet_name,
            diet: ansArr,
            diet_id: e.id
        })
            .then(res => {
                console.log(res.data)
                // if (res.data.sucsess) {
                //     this.setState({
                //         dietName: '',
                //         dietArray: [],
                //         itemArray: []
                //     })
                //     notification.sucsess({
                //         message: 'Diet Added Succesfully !'
                //     })
                // }
            })
            .catch(err => console.log(err))
        // this.setState({
        //     dietInfo: ansArr
        // })

    }
    uploadDiet = () => {

    }

    render() {
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h1 className="page-head">{this.state.dietInfo.diet_name} </h1>

                    <Table dataSource={this.state.dietInfo.diet}>

                        <Column title="Time" dataIndex="time" key="time" />

                        <Column
                            title="Food Items"
                            dataIndex="item"
                            key="item"
                            render={item => (
                                <span>
                                    {item.map(tag => (
                                        <Tag style={{ background: `${tag.color}` }} key={tag.id}>
                                            {tag.value}
                                        </Tag>
                                    ))}
                                </span>
                            )}
                        />
                        <Column
                            title="Action"
                            key="id"
                            render={(id, record) => (
                                <span>

                                    <Divider type="vertical" />
                                    <Link to="#" onClick={() => this.delDiet(id)} >Delete</Link>
                                </span>
                            )}
                        />
                    </Table>
                </div>
            </div>
        )
    }
}
