import React, { Component } from 'react'
import { Table, Tag } from 'antd';
import { Link } from 'react-router-dom';

const { Column } = Table;
export default class ViewWorkout extends Component {
    constructor() {
        super();
        this.state = {
            workout: {}
        }
    }
    componentDidMount() {
        this.setState({
            workout: this.props.workout
        })
    }
    render() {
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h1 className="page-head">{this.state.workout.plan_name} </h1>

                    <Table dataSource={this.state.workout.workout}>

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
