import React, { useEffect, useState } from "react";
import { Row, Col, Button, Menu, Icon, Divider, Table } from "antd";
import Listings from './listings'
import Bookings from './bookings'
import Calender from './calender'
import Calender_Host from './calender_host'
import { RightOutlined } from '@ant-design/icons';
import s from '../style.module.css'
export default () => {
    const [menuOptionProperty, setmenuOptionProperty] = useState()

    useEffect(() => {
        setmenuOptionProperty('listings');
    }, []);

    const handleClickProperty = (e) => {
        setmenuOptionProperty(e.key);
    }
    return (
        <div className="row" style={{ backgroundColor: "rgb(255, 255, 255)" }}>
            <div className="col-md-2 col-lg-2 col-sm-4 p-0">
                <Menu
                    mode="vertical"
                    defaultSelectedKeys={['listings']}
                    className={s.menuPanel}
                    onClick={handleClickProperty}
                >
                    <Menu.Item className={s.menubutton} key="listings"><b>Listings</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                    <Menu.Item className={s.menubutton} key="bookings"><b>Bookings</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                    <Menu.Item className={s.menubutton} key="calendar"><b>Calendar</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                </Menu>
            </div>
            <div className="col-md-10 col-lg-10 col-sm-8">
                {menuOptionProperty == 'listings' && <Listings />}
                {menuOptionProperty == 'bookings' && <Bookings />}
                {menuOptionProperty == 'calendar' && <Calender />}
            </div>
        </div>
    );
};
