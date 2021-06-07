import {
  Menu,
  Icon,
  Drawer,
  Button,
  Row,
  Col,
  Input,
  Radio,
  Select,
  DatePicker,
} from "antd";
import Router, { withRouter } from "next/router";
import { useState, useLayoutEffect } from "react";
import HeroAvatar from "../hero-avatar";
import HeroSectionUp from "../hero-section-up";

import s from "./style.module.css";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Option } = Select;
const { Search } = Input;

export default () => {
  const [visible, setVisible] = useState(false);
  const [isLowResolution, setIsLowResolution] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsLowResolution(window.innerWidth > 1400 ? true : false);
      setIsMobile(window.innerWidth < 770 ? true : false);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <div className="container">
      <div className={s["hero-section"]}>
        <Row>
          <HeroSectionUp />
          <Col span={24} className=" text-center">
            {/* <h1 className={s["title"]}>Let's Explore the World</h1> */}
            {/* <p className="subtitle">With Hurraayy</p> */}
            <h1 className={s["title"]} style={{marginTop: isLowResolution ? 48:48, marginBottom: isLowResolution? 20:40}}>
              time to travel again!
              </h1>
          </Col>
        </Row>
      </div>
      {/* <Row>
        <Col  className="row text-center" style={{marginLeft: "200px", marginRight:"200px"}}> */}
          {/* <div className={s["hero-avatar-container"]}> */}
          <div className="row" style={{textAlign:"center"}}>
            <div className="col-sm-2"></div>
            <div className="row col-sm-8"
            style={{marginLeft: isMobile? -5 : 5}}>
            {/* <div className="col-sm-3"></div> */}
            <div className="col-sm-4"
            style={{marginLeft:isMobile? 0 : 0}}>
            <HeroAvatar
              size={210}
              txt="Adventures"
              link="/adventure"
              img={"./images/Adventure_circle.png"}
              
            />
            </div>
            <div className="col-sm-4" 
            style={{marginLeft:isMobile? 0 : 0, marginTop:isMobile?20:''}}>
            <HeroAvatar
              size={210}
              txt="Accommodations"
              link="/accomodation"
              img={"./images/Accomodation_circle.png"}
            />
              </div>
              <div className="col-sm-4"
              style={{marginLeft:isMobile? 0 : 0, marginTop:isMobile?20:''}}>
              <HeroAvatar
              size={210}
              txt="Experiences"
              link="/experience"
              img={"./images/Experience_circle.png"}
              
            />
              </div>
              {/* <div className="col-sm-3"></div> */}

            </div>
            <div className="col-sm-2"></div>

            
          </div>
            
            
            
          {/* </div> */}
        {/* </Col>
      </Row> */}
    </div>
  );
};
