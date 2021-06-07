import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Button, Menu, Icon, Divider, Table } from "antd";
import Listings from './listings'
import Bookings from './bookings'
import Calender from './calender'
import GoingWhere from './goingWhere'
import s from '../style.module.css'

export default () => {
    const [menuOptionAdventure, setmenuOptionAdventure] = useState()

    useEffect(() => {
        setmenuOptionAdventure('listings');
    }, []);

    const handleClickAdventure = (e) => {
        setmenuOptionAdventure(e.key);
    }

    return (
        <div className="row" style={{ backgroundColor: "rgb(255, 255, 255)" }}>
            <div className="col-md-2 col-lg-2 col-sm-4 p-0">
                <Menu
                    mode="vertical"
                    defaultSelectedKeys={['listings']}
                    onClick={handleClickAdventure}
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
            <div className="col-md-10 col-lg-10 col-sm-8">
                {menuOptionAdventure == 'listings' && <Listings />}
                {menuOptionAdventure == 'bookings' && <Bookings />}
                {menuOptionAdventure == 'calendar' && <Calender />}
                {menuOptionAdventure == 'goingWhere' && <GoingWhere />}
            </div>
        </div>
    );
};
