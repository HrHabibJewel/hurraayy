import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Button, Menu, Icon, Divider, Table,Form } from "antd";
import s from "../host-panel/style.module.css";
import BasicInfo from "./basicInfo";
import UserSecurity from "./security";

function AccountDetail() {
  const [menuOptionTrips, setmenuOptionTrips] = useState();

  useEffect(() => { 
    setmenuOptionTrips("basicInfo");
  }, []);
  const handleClickTrips = (e) => {
    setmenuOptionTrips(e.key);
  };

  return (
    <div>
      {/* <div>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right" }}>
            Save & Exit
          </Button>
        </Form.Item> 
      </div> */}
      <div
        className="main row"
        style={{ backgroundColor: "rgb(255, 255, 255)" }}
      >
        <div
          className="col-md-2 col-lg-2 col-sm-4 p-0"
          style={{ borderRadius: " .25rem !important" }}
        >
          <Menu
            mode="vertical"
            defaultSelectedKeys={["basicInfo"]}
            onClick={handleClickTrips}
            className={s.menuPanel}
          >
            <Menu.Item
            style={{backgroundColor:"#ffffff"}}
            className={s.menubutton} key="basicInfo">
              <b style={{fontFamily:"Heebo", fontSize:14,fontWeight:600}}>Basic Information</b>
              <span className={s.menuArrow}>
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 11 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z"
                    fill="#D2D2D2"
                  />
                </svg>
              </span>
            </Menu.Item>
            <Menu.Item 
            style={{backgroundColor:"#ffffff"}}
            key="security" className={s.menubutton}>
              <b Icon="right">Security</b>
              
              <span className={s.menuArrow}>
                <svg
                  width="8"
                  height="14"
                  viewBox="0 0 11 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.005 0L10.005 8L2.005 16L0 14L6.005 8L0 2L2.005 0Z"
                    fill="#D2D2D2"
                  />
                </svg>
              </span>
            </Menu.Item>
          </Menu>
        </div>
        <div
          className="col-md-10 col-lg-10 col-sm-8"
          style={{ borderRadius: ".25rem !important;" }}
        >
          {menuOptionTrips == "basicInfo" && <BasicInfo />}
          {menuOptionTrips == "security" && <UserSecurity />}
        </div>
      </div>
    </div>
  );
}

export default AccountDetail;
