import React, { useState, useEffect, Fragment } from 'react';
import { Menu, Spin } from "antd";
import TripsDetail from '../Trips/TripsDetail'
import s from '../host-panel/style.module.css'
import { useSelector } from "react-redux";
import { withRouter, useRouter } from "next/router";
import { getAuthentication } from "../../lib/utils/utility";
function TripsHome() {
    const [loading, setLoading] = useState(true);
    const userInfo = useSelector((state) => state.auth);
    const router = useRouter();
    useEffect(() => {
        if (!getAuthentication()) {
            router.push("/");
          }
          setLoading(false);
        // if (userInfo["token"]) {
        //     setLoading(false);
        // }
        // else {
        //     router.push('/');
        // }
    }, [])
    return (
        <Spin spinning={loading} tip="Loading...">
            {loading ? <div style={{ height: '100vh' }}></div> :
                <div className="container">
                    <div className="row">
                        <div className="col p-0">
                            <Menu
                                mode="horizontal"
                                style={{ backgroundColor: "rgb(243, 243, 243)" }}
                            >
                                <Menu.Item className={s.hostMainMenu} key="Trips"><p>Trips</p></Menu.Item>
                            </Menu>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <TripsDetail />
                        </div>
                    </div>
                </div>
            }
        </Spin>
    );
};
export default TripsHome;