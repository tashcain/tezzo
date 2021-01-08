//  SHUBHAM's FILE

import React, { Component } from 'react';
import { Table, Divider, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { Input, Button, notification } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Select, InputNumber } from 'antd';
import ApiRoutes from '../config/ApiRoutes';

const { Option } = Select;




const { Column } = Table;


var workoutArray = [];
export default class ManageWorkout extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            reps: '',
            sets: 4,
            itemArray: [],
            color: ['#60AAFE', '#FFB933', '#9A5EF1', '#FFB933', '#60AAFE', '#FFB933', '#60AAFE', '#9A5EF1', '#38CB84', '#FFB933'],
            time: '',
            dietArray: [],
            workout_name: '',
            workout_day: 'Monday',
            workoutData: [],
            body_part: [],
            workout_plan_name: ''
        }
    }
    componentDidMount() {
        workoutArray = [];
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



    delDiet = (e) => {
        let ansArr = this.state.dietArray.filter((data, key) => {
            return e.id !== data.id
        })
        this.setState({
            dietArray: ansArr
        })

    }
    uploadWorkout = () => {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref');
        console.log('CLickedddd');
        axios.post(ApiRoutes.api_route + '/workout/add-workout', {
            plan_name: this.state.workout_plan_name,
            workout: this.state.workoutData,
            gymId: lc
        })
            .then(res => {

                if (res.data.success) {
                    this.setState({
                        workout_plan_name: '',
                        workoutData: [],
                        workout_name: ''
                    })
                    notification.success({
                        message: 'Workout Added Succesfully !'
                    })
                    this.props.updateDiet();
                }
            })
            .catch(err => console.log(err))
    }
    onChangeSets = (value) => {
        this.setState({
            sets: value
        })
    }
    handleDayChange = (value) => {
        console.log('Day selected', value);
        this.setState({
            workout_day: value
        })
    }
    addWorkout = (e) => {
        if (e.key === 'Enter') {
            if (workoutArray.length === 0) {
                let obj = {};
                let wk_arr = [];
                let arr_id = uuidv4();
                obj.id = arr_id;
                obj.workout_day = this.state.workout_day;
                obj.body_part = [this.state.body_part];
                let wk_obj = {};
                wk_obj.id = uuidv4();
                wk_obj.arr_id = arr_id;
                wk_obj.workout_name = this.state.workout_name;
                wk_obj.workout_sets = this.state.sets;
                wk_obj.workout_reps = this.state.reps;
                wk_arr.push(wk_obj)
                obj.workout = wk_arr;
                workoutArray.push(obj);
            } else {
                var flag = 0;

                for (var i = 0; i < workoutArray.length; i++) {
                    var check = workoutArray[i].body_part.toString() === this.state.body_part.toString();
                    if (workoutArray[i].workout_day === this.state.workout_day && check) {
                        console.log('Matched True');
                        flag = 1;

                        let wk_obj = {};
                        wk_obj.id = uuidv4();
                        wk_obj.arr_id = workoutArray[i].id
                        wk_obj.workout_name = this.state.workout_name;
                        wk_obj.workout_sets = this.state.sets;
                        wk_obj.workout_reps = this.state.reps;
                        workoutArray[i].workout.push(wk_obj)


                    }
                }
                if (flag === 0) {
                    console.log('Unmatched !')
                    let obj = {};
                    let wk_arr = [];
                    let arr_id = uuidv4();
                    obj.id = arr_id;
                    obj.workout_day = this.state.workout_day;
                    obj.body_part = [this.state.body_part];
                    let wk_obj = {};
                    wk_obj.id = uuidv4();
                    wk_obj.arr_id = arr_id;
                    wk_obj.workout_name = this.state.workout_name;
                    wk_obj.workout_sets = this.state.sets;
                    wk_obj.workout_reps = this.state.reps;
                    wk_arr.push(wk_obj)
                    obj.workout = wk_arr;
                    workoutArray.push(obj);
                }
            }
        }
        // if (e.key === 'Enter') {
        //     if (workoutArray.length === 0) {
        //         let obj = {};
        //         obj.workout_day = this.state.workout_day;
        //         obj.body_part = this.state.body_part;
        //         obj.workout_name = [
        //             this.state.workout_name
        //         ]
        //         obj.workout_sets = [

        //             this.state.sets
        //         ]

        //         obj.workout_reps = [
        //             this.state.reps
        //         ]
        //         workoutArray.push(obj);
        //     } else {
        //         var flag = 0;

        //         for (var i = 0; i < workoutArray.length; i++) {
        //             var check = workoutArray[i].body_part.toString() === this.state.body_part.toString();
        //             if (workoutArray[i].workout_day === this.state.workout_day && check) {
        //                 console.log('Matched True');
        //                 flag = 1;
        //                 workoutArray[i].workout_name.push(this.state.workout_name);
        //                 workoutArray[i].workout_sets.push(this.state.sets);
        //                 workoutArray[i].workout_reps.push(this.state.reps);


        //             }
        //         }
        //         if (flag === 0) {
        //             let obj = {};
        //             obj.workout_day = this.state.workout_day;
        //             obj.body_part = this.state.body_part;
        //             obj.workout_name = [
        //                 this.state.workout_name
        //             ]

        //             obj.workout_sets = [

        //                 this.state.sets
        //             ]

        //             obj.workout_reps = [
        //                 this.state.reps
        //             ]
        //             workoutArray.push(obj);
        //         }

        //     }


        console.log('Workout Added');
        this.setState({
            workoutData: workoutArray
        })
        console.log(workoutArray);
        // }
    }
    handleBodyPartChange = (value) => {
        console.log(value);
        this.setState({
            body_part: value
        })
    }
    handleDelWorkout = (array_id, item_id) => {
        for (var i = 0; i < workoutArray.length; i++) {
            if (workoutArray[i].id === array_id) {
                console.log(workoutArray[i]);
                let arr_m = workoutArray[i].workout;

                if (arr_m.length === 1) {
                    workoutArray = workoutArray.filter((data, index) => (
                        data.id !== array_id
                    ))
                } else {

                    arr_m = arr_m.filter((data, index) => (
                        data.id !== item_id
                    ))
                    workoutArray[i].workout = arr_m;
                }




                break;
            }

        }
        this.setState({
            workoutData: workoutArray
        })
        // console.log(array_id, item_id);
    }
    render() {
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h1 className="page-head">Create Workout</h1>
                    <div uk-grid="true">
                        <div className="uk-width-expand@m">
                            <Input placeholder="Workout Plan Name" value={this.state.workout_plan_name} style={{ width: '250px' }} id="workout_plan_name" onChange={this.onChange} />
                            <br />
                            <br />
                            <div className="flex mt-4" >
                                <Select defaultValue="Monday" style={{ width: 120 }} onChange={this.handleDayChange}>
                                    <Option value="Monday">Monday</Option>
                                    <Option value="Tuesday">Tuesday</Option>
                                    <Option value="Wednesday">Wednesday</Option>
                                    <Option value="Thursday">Thursday</Option>
                                    <Option value="Friday">Friday</Option>
                                    <Option value="Saturday">Saturday</Option>
                                </Select>
                                <Select
                                    mode="multiple"
                                    style={{ width: 300, marginLeft: '10px' }}
                                    placeholder="Select Body Part"
                                    defaultValue={[]}
                                    onChange={this.handleBodyPartChange}

                                >
                                    <Option value="Chest">
                                        Chest
                                    </Option>
                                    <Option value="Back">
                                        Back
                                    </Option>
                                    <Option value="Biceps" >
                                        Biceps
                                    </Option>
                                    <Option value="Triceps" >
                                        Triceps
                                    </Option>
                                    <Option value="Shoulder" >
                                        Shoulder
                                    </Option>
                                    <Option value="Legs" >
                                        Legs
                                    </Option>
                                </Select>
                            </div>
                            <div className="flex mt-4">

                                <Input style={{ width: '250px' }} type="text" placeholder="Enter Workout Name" id="workout_name" onChange={this.onChange} value={this.state.workout_name} />
                                <InputNumber className="uk-margin-left" min={1} max={8} defaultValue={4} onChange={this.onChangeSets} />
                                <Input className="uk-margin-left" style={{ width: '250px' }} type="text" placeholder="Enter Reps eg. 12-10-9-9" id="reps" onKeyPress={this.addWorkout} onChange={this.onChange} value={this.state.reps} />



                                <Button className="gen-btn ml-2" onClick={this.uploadWorkout}>Upload Plan</Button>

                            </div>


                        </div>


                    </div>


                    <br />
                    <br />
                    <Table dataSource={this.state.workoutData}>

                        <Column title="Workout Day" dataIndex="workout_day" key="workout_day" />
                        <Column
                            title="Body Part"
                            key="body_part"
                            dataIndex="body_part"
                            render={body_part => (
                                <span>
                                    {body_part.map((tag, index) => (
                                        <Tag key={index}>
                                            {tag}
                                        </Tag>
                                    ))}
                                </span>
                            )}
                        />
                        <Column
                            title="Workouts"
                            key="id"

                            render={body_part => (
                                <span>
                                    {
                                        body_part.workout.map((data, index) => (
                                            <div key={index}>
                                                {<Tag style={{ background: '#64ACFB' }} key={data.workout_name}>
                                                    {data.workout_name}
                                                </Tag>}
                                                {<Tag style={{ background: '#8746ED' }} key={data.workout_sets}>
                                                    {data.workout_sets}
                                                </Tag>}
                                                {<Tag style={{ background: '#55CEAD' }} key={data.workout_reps}>
                                                    {data.workout_reps}
                                                </Tag>}
                                                {<Link to="#" key={data.id} onClick={() => this.handleDelWorkout(data.arr_id, data.id)} >
                                                    delete
                                                </Link>}


                                            </div>
                                        ))
                                    }
                                </span>
                            )}
                        />

                    </Table>
                </div>
            </div>
        )
    }
}
