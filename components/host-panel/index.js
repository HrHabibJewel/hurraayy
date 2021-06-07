import React, { useState, useEffect, Fragment } from 'react';
import { Menu, Spin } from "antd";
import { useSelector } from "react-redux";
import { withRouter, useRouter } from "next/router";
import ExperienceHostPanel from './experience/experianceHostPanel'
import Adventure from './advanture/adventureHostPanel'
import Property from './property/propertyHostPanel'
import s from './style.module.css'
import { getAuthentication } from "../../lib/utils/utility";
function HostPanelLayout() {

    const [menuOption, setMenuOption] = useState();
    const [loading, setLoading] = useState(true);
    const userInfo = useSelector((state) => state.auth);
    const router = useRouter();
    useEffect(() => {
        // if (userInfo["token"]) {
        //     setMenuOption('properties')
        //     setLoading(false);
        // }
        // else {
        //     router.push('/');
        // }
        if (!getAuthentication()) {
            router.push("/");
        }
        setMenuOption('properties')
        setLoading(false);
    }, []);


    const handleClick = (e) => {
        setMenuOption(e.key);
    }



    return (
        <Spin spinning={loading} tip="Loading...">
            {loading ? <div style={{ height: '100vh' }}></div> :
                <div className="container">
                    <div className="row pl-md-3 pr-3">
                        <div className="col p-0">
                            <Menu
                                mode="horizontal"
                                defaultSelectedKeys={['properties']}
                                onClick={handleClick}
                                style={{ backgroundColor: "rgb(243, 243, 243)" }}
                            >
                                <Menu.Item className={menuOption == 'properties' ? s.hostMainMenu : s.hostMainMenuDeactive} key="properties"><p>Properties</p></Menu.Item>
                                <Menu.Item className={menuOption == 'experience' ? s.hostMainMenu : s.hostMainMenuDeactive} key="experience"><p>Experience</p></Menu.Item>
                                <Menu.Item className={menuOption == 'adventure' ? s.hostMainMenu : s.hostMainMenuDeactive} key="adventure"><p>Adventure</p></Menu.Item>
                            </Menu>
                        </div>
                    </div>
                    <div className="row pl-md-3 pr-3">
                        <div className="col">
                            {menuOption == 'experience' && <ExperienceHostPanel />}
                            {menuOption == 'properties' && <Property />}
                            {menuOption == 'adventure' && <Adventure />}
                        </div>
                    </div>
                </div>
            }
        </Spin>
    );
};
export default HostPanelLayout;