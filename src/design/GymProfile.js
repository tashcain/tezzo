import React, { Component } from 'react';
import { Tabs } from 'antd';
import Profile from '../components/Profile';
import Plans from '../components/Plans';
import Biling from '../components/Biling';
const { TabPane } = Tabs;

export default class GymProfile extends Component {
    componentDidMount() {
        document.title = "Tezzo - Gym Profile"
    }
    render() {
        return (
            <div>
                <h1 className="page-head">Profile</h1>
                <Tabs defaultActiveKey="1" tabPosition="left" style={{ minHeight: 220, paddingBottom: '40px' }}>

                    <TabPane tab="Account" key="1">
                        <Profile />
                    </TabPane>
                    <TabPane tab="Plans" key="2">
                        <Plans />
                    </TabPane>
                    <TabPane tab="Payment Summary" key="3">
                        <Plans />
                    </TabPane>
                    <TabPane tab="Biling" key="4">
                        <Biling />
                    </TabPane>

                </Tabs>
            </div>
        )
    }
}