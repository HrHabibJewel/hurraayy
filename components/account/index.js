import React, { useState, useEffect, Fragment, useLayoutEffect } from 'react';
import { Menu, Spin } from "antd";
import s from '../host-panel/style.module.css'
import AccountDetail from './accountDetail';
import { useRouter, Router } from "next/router";
import { getAuthentication } from "../../lib/utils/utility";
function AccountHome() {
    const [loading, setLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const router = useRouter();
    useEffect(() => { 
        if (!getAuthentication()) {
            router.push("/");
          }
        setLoading(false);
    }, [])
    useLayoutEffect(() => {
        function updateSize() {
          //console.log("window.innerWidth", window.innerWidth);
          setIsDesktop(window.innerWidth > 550 ? true : false);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
      }, []);
    return ( 
        <Spin spinning={loading} tip="Loading...">
            {loading ? <div style={{ height: '100vh' }}></div> :
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Menu
                                mode="horizontal"
                                style={{ backgroundColor: "rgb(243, 243, 243)", marginTop:5,marginLeft:-15 }}
                                className={s.hostMainMenu1}
                            >
                                <Menu.Item className={s.hostMainMenu} key="account" style={{backgroundColor:"#FF6304"
                                , width : isDesktop?"":"50%" }}>
                                    <p style={{fontFamily:"Heebo", fontWeight:600,fontSize:16}}>Account</p>
                                </Menu.Item>
                            </Menu>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <AccountDetail />
                        </div>
                    </div>
                </div>
            }
        </Spin>
    );
};
export default AccountHome;