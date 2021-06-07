import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Button, Menu, Icon, Divider, Table } from "antd";
import AdventureTrips from './AdventureTrips'
import ExperienceTrips from './ExperienceTrips'
import PropertiesTrips from './PropertiesTrips'
import s from '../host-panel/style.module.css'
function TripsDetail() {

    const [menuOptionTrips, setmenuOptionTrips] = useState()

    useEffect(() => {
        setmenuOptionTrips('properies');
    }, []);

    const handleClickTrips = (e) => {
        setmenuOptionTrips(e.key);
    }

    return (
        <div className="row" style={{ backgroundColor: "rgb(255, 255, 255)" }}>
            <div className="col-md-2 col-lg-2 col-sm-4 p-0" style={{ borderRadius: ".25rem !important;" }}>
                <Menu
                    mode="vertical"
                    defaultSelectedKeys={['properies']}
                    onClick={handleClickTrips}
                    className={s.menuPanel}
                >
                    <Menu.Item className={s.menubutton} key="properies"><b>Properties</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                    <Menu.Item key="experience" className={s.menubutton}><b>Experience</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                    <Menu.Item key="adventure" className={s.menubutton}><b>Adventure</b><span className="float-right"><svg width="8" height="14" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z" fill="#D2D2D2" />
                    </svg></span></Menu.Item>
                </Menu>
            </div>
            <div className="col-md-10 col-lg-10 col-sm-8" style={{ borderRadius: ".25rem !important;" }}>
                {menuOptionTrips == 'properies' && <PropertiesTrips />}
                {menuOptionTrips == 'experience' && <ExperienceTrips />}
                {menuOptionTrips == 'adventure' && <AdventureTrips />}
            </div>
        </div>
    );
};

export default TripsDetail;