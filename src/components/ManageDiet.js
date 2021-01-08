//  SHUBHAM's FILE

import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { TimePicker, Input, Button, notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes'


const { Column } = Table;


export default class ManageDiet extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            item: '',
            itemArray: [],
            color: ['#60AAFE', '#FFB933', '#9A5EF1', '#FFB933', '#60AAFE', '#FFB933', '#60AAFE', '#9A5EF1', '#38CB84', '#FFB933'],
            time: '',
            dietArray: [],
            dietName: ''
        }
    }


    handleTagClose = (e) => {
        const itemArray = this.state.itemArray.filter((data, index) => {
            return data.id !== e;
        })
        this.setState({
            itemArray
        }, () => {
            console.log(this.state.itemArray)
        })
        console.log('Tag Deleted')
    }
    onChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleEnter = (e) => {
        var rand = Math.floor(Math.random() * 10);
        if (e.key === 'Enter') {
            let mahArr = []
            let obj = {};
            obj.id = Math.random();
            obj.value = this.state.item;
            obj.color = this.state.color[rand];
            mahArr.push(obj);
            this.setState({
                itemArray: [...this.state.itemArray, ...mahArr],
                item: ''
            })
            console.log(this.state.itemArray);
        }
    }
    onChangeTime = (time, timeString) => {
        this.setState({
            time: timeString
        })
        console.log(time, timeString);
    }
    addDiet = () => {
        let dietobj = {};
        dietobj.id = uuidv4();
        dietobj.time = this.state.time;
        dietobj.item = this.state.itemArray;
        this.setState({
            dietArray: [...this.state.dietArray, dietobj],
            itemArray: []
        }, () => {
            console.log(this.state.dietArray);
        })

    }
    delDiet = (e) => {
        let ansArr = this.state.dietArray.filter((data, key) => {
            return e.id !== data.id
        })
        this.setState({
            dietArray: ansArr
        })

    }
    uploadDiet = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref');
        axios.post(ApiRoutes.api_route + '/diet/adddiet', {
            diet_name: this.state.dietName,
            diet: this.state.dietArray,
            gymId: lc

        })
            .then(res => {
                if (res.data.sucsess) {
                    this.setState({
                        dietName: '',
                        dietArray: [],
                        itemArray: []
                    })
                    notification.success({
                        message: 'Diet Added Succesfully !'
                    })
                    this.props.updateDiet();
                }
            })
            .catch(err => console.log(err))
    }
    render() {
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h1 className="page-head">Manage Diet</h1>
                    <div uk-grid="true">
                        <div className="uk-width-expand@m">
                            <Input placeholder="Diet Name" value={this.state.dietName} style={{ width: '250px' }} id="dietName" onChange={this.onChange} />
                            <div className="flex mt-4">
                                <TimePicker use12Hours minuteStep={15} format="h:mm a" onChange={this.onChangeTime} />
                                <Input className="uk-margin-left" onKeyPress={this.handleEnter} style={{ width: '250px' }} type="text" placeholder="Enter Food Name and Hit Enter" id="item" onChange={this.onChange} value={this.state.item} />
                                <Button className="gen-btn ml-2" onClick={this.addDiet}>Add Diet</Button>
                                <Button className="gen-btn ml-2" onClick={this.uploadDiet}>Upload Diet</Button>

                            </div>
                            <div className="mt-4">
                                {
                                    this.state.itemArray.map((data, index) => (
                                        <Tag key={index} style={{ background: `${data.color}` }} onClick={() => { this.handleTagClose(data.id) }}>
                                            {
                                                data.value
                                            }
                                        </Tag>
                                    ))
                                }
                                {(this.state.itemArray.length !== 0) ? <p className="mt-2">Click On item to delete</p> : <div></div>}
                            </div>

                        </div>


                    </div>


                    <Table dataSource={this.state.dietArray}>

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
