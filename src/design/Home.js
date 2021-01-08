import React, { Component } from 'react';
import { Table, Divider, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { database } from '../firebase/index';
import moment from 'moment';
import ImgLogo from '../asset/images/gym.png';
import people from '../asset/images/people.svg';
import diet from '../asset/images/restaurant.svg';
import dumbell from '../asset/images/fit.svg';
import money from '../asset/images/credit-card.svg';
import received from '../asset/images/ok-circle.svg';
import expected from '../asset/images/activity.svg';
import music from '../asset/images/music.svg';
import sugg from '../asset/images/envelope.svg';
import axios from 'axios';
import ApiRoutes from '../config/ApiRoutes';

const { Column } = Table;
const rootref = database;
export default class Home extends Component {

    constructor() {
        super();
        this.state = {
            loadingTable: false,
            attendance: [],
            gym_summary: {}
        }
    }
    componentDidMount() {
        let lc = localStorage.getItem('xdGcsHneGi3r@ywThjref');

        axios.post(ApiRoutes.api_route + '/gprofile/dashboard', {
            gymId: lc
        })
            .then(res => {
                console.log(res.data)
                this.setState({
                    gym_summary: res.data
                })
            })
            .catch(err => {
                console.log(err);
            })
        document.title = "Tezzo - Dashboard"
        let gy_email = localStorage.getItem('gym_email')
        let eml = gy_email.slice(0, gy_email.indexOf("@"));
        let dt = moment().format('DDMMYYYY');
        console.log(dt);
        let g_name = localStorage.getItem('gym_name');
        let gy = `${g_name.replace(/\s/g, '')}${eml}`;

        rootref.ref().child('Attendance').child(gy).child(dt).on('value', (snap) => {
            let attArr = [];
            for (var key in snap.val()) {
                let obj = {};
                obj._id = key
                obj.name = snap.val()[key].name;
                obj.membership_no = snap.val()[key].membership_no;
                attArr.push(obj);

                // console.log(key + " -> " + snap.val()[key].status);

            }
            this.setState({
                attendance: attArr
            })
            console.log(snap.val());
        })
    }
    render() {

        return (
            <div>

                <div className="flex w-100 rounded-lg bg-white">
                    <div className="flex-1 bg-white p-10 box-left">
                        <h1 className="cover-head-one">Hello</h1>
                        <h3 className="cover-head-two">Welcome to <span className="cover-span">Tezzo</span> Dashboard</h3>
                        <p
                            style={{
                                fontSize: '18px',
                                letterSpacing: '1px'
                            }}
                        >Effortlessly Manage Your Gym</p>
                    </div>
                    <div className="flex-1 bg-white p-12 box-right">
                        <img src={ImgLogo} alt="logo" style={{ height: '250px', margin: '0 auto' }} />
                    </div>
                </div>
                <br />
                <div class="uk-child-width-expand@s" uk-grid="true">
                    <div>
                        <div>
                            <div className="w-100 rounded-lg bg-white">
                                <div className="flex bg-white p-4 box-left">
                                    <div>
                                        <img src={people} alt="member-logo" />
                                    </div>
                                    <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                        <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>{this.state.gym_summary.member}</h3>
                                        <span>Total Members</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div className="w-100 rounded-lg bg-white">
                                    <div className="flex bg-white p-4 box-left">
                                        <div>
                                            <img src={diet} alt="member-logo" />
                                        </div>
                                        <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                            <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>{this.state.gym_summary.diet}</h3>
                                            <span>Total Diet Plans</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div className="w-100 rounded-lg bg-white">
                                    <div className="flex bg-white p-4 box-left">
                                        <div>
                                            <img src={dumbell} alt="member-logo" />
                                        </div>
                                        <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                            <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>{this.state.gym_summary.workout}</h3>
                                            <span>Total Workout Plans</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div className="w-100 rounded-lg bg-white">
                                    <div className="flex bg-white p-4 box-left">
                                        <div>
                                            <img src={money} alt="member-logo" />
                                        </div>
                                        <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                            <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>{this.state.gym_summary.due_today}</h3>
                                            <span>Due Today</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="uk-child-width-expand@s uk-margin-top" uk-grid="true">
                    <div>
                        <nav className="uk-navbar-container" uk-navbar="true" style={{ background: '#fff' }}>

                            <div className="uk-navbar-left">

                                <ul className="uk-navbar-nav mr-left">
                                    <li className="uk-active"><Link to="#">
                                        Todays Attendance
</Link></li>

                                </ul>

                            </div>



                        </nav>
                        <Table dataSource={this.state.attendance} loading={this.state.loadingTable} >

                            <Column title="Membership No." dataIndex="membership_no" key="membership_no" />
                            <Column title="Name" dataIndex="name" key="name" />
                            {/* <Column
                                title="Action"
                                key="_id"
                                render={(_id, record) => (
                                    <span>
                                    
                                        <Popconfirm
                                            title="Are you sure delete this member?"
                                            onConfirm={() => this.delUser(_id)}
                                            onCancel={this.cancel}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Link to="#" >Delete</Link>

                                        </Popconfirm>
                                    </span>
                                )}
                            /> */}
                        </Table>
                        <br />
                        <nav className="uk-navbar-container" uk-navbar="true" style={{ background: '#fff' }}>

                            <div className="uk-navbar-left">

                                <ul className="uk-navbar-nav mr-left">
                                    <li className="uk-active"><Link to="#">
                                        Due Today
        </Link></li>

                                </ul>

                            </div>



                        </nav>
                        <Table dataSource={[]} loading={this.state.loadingTable} >

                            <Column title="Membership No." dataIndex="membership_no" key="membership_no" />
                            <Column title="Name" dataIndex="firstname" key="firstname" />
                            <Column title="Mobile No" dataIndex="mobile_no" key="mobile_no" />
                            <Column
                                title="Action"
                                key="_id"
                                render={(_id, record) => (
                                    <span>
                                        <Link to="#" onClick={() => this.showDrawer(_id)}>View Profile {record.lastName}</Link>
                                        <Divider type="vertical" />
                                        <Popconfirm
                                            title="Are you sure delete this member?"
                                            onConfirm={() => this.delUser(_id)}
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
                    <div>
                        <div class="uk-child-width-1-2@s" uk-grid="true">
                            <div>
                                <div>
                                    <div className="w-100 rounded-lg bg-white">
                                        <div className="flex bg-white p-4 box-left">
                                            <div>
                                                <img src={received} alt="member-logo" />
                                            </div>
                                            <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                                <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>₹ 15,000</h3>
                                                <span>Payment Received </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className="w-100 rounded-lg bg-white">
                                        <div className="flex bg-white p-4 box-left">
                                            <div>
                                                <img src={expected} alt="member-logo" />
                                            </div>
                                            <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                                <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>₹ 80,000</h3>
                                                <span>Expected Payment</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className="w-100 rounded-lg bg-white">
                                        <div className="flex bg-white p-4 box-left">
                                            <div>
                                                <img src={music} alt="member-logo" />
                                            </div>
                                            <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                                <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>250</h3>
                                                <span>Birthday Today</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className="w-100 rounded-lg bg-white">
                                        <div className="flex bg-white p-4 box-left">
                                            <div>
                                                <img src={sugg} alt="member-logo" />
                                            </div>
                                            <div className="uk-margin-left" style={{ paddingTop: '6px' }}>
                                                <h3 className="cover-head-two" style={{ fontSize: '30px', marginBottom: '0px' }}>250</h3>
                                                <span>Suggestion Box</span>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        )
    }
}