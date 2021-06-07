import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Button, Menu, Icon, Divider, Table } from "antd";
import ExperienceListing from './listings'
import Bookings from './bookings'
import Calender from './calender'
import GoingWhere from './goingWhere'
import s from '../style.module.css'
function ExperienceHostPanel() {

    const [menuOptionExperience, setmenuOptionExperience] = useState()

    useEffect(() => {
        setmenuOptionExperience('listings');
    }, []);

    const handleClickExperience = (e) => {
        setmenuOptionExperience(e.key);
    }

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            align: 'center',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            align: 'center',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            align: 'center',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            align: 'center',
        },
    ];

    const data = [
        {
            key: '1',
            title: 'John Brown',
            money: '￥300,000.00',
            location: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            title: 'Jim Green',
            money: '￥1,256,000.00',
            location: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            title: 'Joe Black',
            money: '￥120,000.00',
            location: 'Sidney No. 1 Lake Park',
        },
        {
            key: '3',
            title: 'Joe Black',
            money: '￥120,000.00',
            location: 'Sidney No. 1 Lake Park',
        },
        {
            key: '3',
            title: 'Joe Black',
            money: '￥120,000.00',
            location: 'Sidney No. 1 Lake Park',
        },
        {
            key: '3',
            title: 'Joe Black',
            money: '￥120,000.00',
            location: 'Sidney No. 1 Lake Park',
        },
        {
            key: '3',
            title: 'Joe Black',
            money: '￥120,000.00',
            location: 'Sidney No. 1 Lake Park',
        },
        {
            key: '3',
            title: 'Joe Black',
            money: '￥120,000.00',
            location: 'Sidney No. 1 Lake Park',
        },
        {
            key: '3',
            title: 'Joe Black',
            money: '￥120,000.00',
            location: 'Sidney No. 1 Lake Park',
        },
    ];
    return (
        <div className="row" style={{ backgroundColor: "rgb(255, 255, 255)" }}>
            <div className="col-md-2 col-lg-2 col-sm-4 p-0" style={{ borderRadius: ".25rem !important;" }}>
                <Menu
                    mode="vertical"
                    defaultSelectedKeys={['listings']}
                    onClick={handleClickExperience}
                    className={s.menuPanel}
                >
                    <Menu.Item className={s.menubutton} key="listings"><b>Listings</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                    <Menu.Item key="bookings" className={s.menubutton}><b>Bookings</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                    <Menu.Item key="calendar" className={s.menubutton}><b>Calendar</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                    <Menu.Item key="goingWhere" className={s.menubutton}><b>Who's going where?</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                </Menu>
            </div>
            <div className="col-md-10 col-lg-10 col-sm-8" style={{ borderRadius: ".25rem !important;" }}>
                {menuOptionExperience == 'listings' && <ExperienceListing />}
                {menuOptionExperience == 'bookings' && <Bookings />}
                {menuOptionExperience == 'calendar' && <Calender />}
                {menuOptionExperience == 'goingWhere' && <GoingWhere />}
            </div>
        </div>
    );
};

export default ExperienceHostPanel;