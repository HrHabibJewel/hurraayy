import Link from "next/link";
import { Menu, Icon, Drawer, Row, Col, Select, Avatar } from "antd";
import { withRouter, useRouter } from "next/router";
import { useState, useEffect, useRef, Fragment } from "react";
import { useSelector } from "react-redux";
import LoginForm from "../../common/loginForm/login";
import { useDispatch } from "react-redux";
import { authLogout } from "../../../store/auth/actions";
import StorageService from "../../../lib/storage.service";
import * as icon from "./icon";
import storageService from "../../../lib/storage.service";
import Signup from "./../../common/loginForm/signup";
import { tuple } from "antd/lib/_util/type";
import AutoCompleteSearch from "../../homepage/hero-section-up/autoCompleteSearch";
const SubMenu = Menu.SubMenu;
const { Option } = Select;

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
};

const RightMenu = ({ mod }) => {
  const [visible, setVisible] = useState(false);
  const [isLoggedin, setLoginStatus] = useState(false);
  const [isOnce, setOnce] = useState(false);
  const dispatch = useDispatch();
  const [userImageUrl, setUserImageUrl] = useState('./images/Avatar.jpg');
  const userInfo = useSelector((state) => state.auth);
  const router = useRouter();
  const [isSignUp, setSignUp] = useState(false);
  
  //const userInfo = StorageService.getUserInfo();
  const onLoginClose = () => {
    setVisible(false);
  };
  const onRendering = () => {

    setOnce(true);
    setLoginStatus(true);
    setUserImageUrl(storageService.getUserProfile().profilePhotoPath);
  };
  const showDrawer = () => {
    setVisible(true);
  };
  const setLogin = (status) => {
    setLoginStatus(status);
    if (!status) {
      setUserImageUrl(storageService.getUserProfile().profilePhotoPath);
    }
  };
  const loginUser = () => {
    setLogin(true);
  };
  const logout = () => {
    if (dispatch(authLogout())) {
      setLogin(false);
      storageService.destroyUserProfile();
      router.push('/')
    }
  };

  const onSignupClose = () => {
    setSignUp(false);
  }

  const onsignUpOpen = () => {
    setSignUp(true);
  }


  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted.current && userInfo && userInfo["token"]) {
      onLoginClose();
      setUserImageUrl(storageService.getUserProfile().profilePhotoPath);
    }

  }, [isMounted]);
  userInfo && userInfo["token"] && !isOnce && onRendering();
  return (
    <Fragment>
      <Menu mode={mod ? "inline" : "horizontal"}>
        <Menu.Item key="mail" className="currency">
          {/* <a href="">$USD</a> */}
          <Select
            defaultValue="bdt"
            className="currency-btn"
            style={{ width: 84, marginLeft: -14 }}
            //   onChange={handleChange}
            size="large"
          >
            <Option value="bdt">BDT</Option>
            <Option value="usd">USD</Option>
          </Select>
        </Menu.Item>
        {isLoggedin && (
          <SubMenu title={<span>Host & Earn</span>} >
            <Menu.Item style={{ height: "auto", maxWidth: 300 }}>
              <Link href={{ pathname: "/adventure-host", query: { step: 1, page: 1 } }}>
                <a className="d-flex">
                  <div className="p-2">{icon.adventure}</div>
                  <div className="p-2 w-100">
                    <p
                      className="title-1x lh-1x mb-2 d-block"
                      style={{ whiteSpace: "normal" }}
                    >
                      Host an Adventure
                  </p>
                    {/* <p
                    className="sub-1x fw-500 lh-1x mb-1 d-block"
                    style={{ whiteSpace: "normal" }}
                  >
                    Guide people & earn money
                  </p> */}
                    <p
                      className="lh-2x fw-300 fc-light d-block"
                      style={{ whiteSpace: "normal" }}
                    >
                      Start earning by guiding people into adventures
                  </p>
                  </div>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item style={{ height: "auto", maxWidth: 300 }}>
              <Link
                href={{
                  pathname: "/experience-host",
                  query: { step: 1, page: 1 },
                }}
              >
                <a className="d-flex">
                  <div className="p-2">{icon.experience}</div>
                  <div className="p-2 w-100">
                    <p
                      className="title-1x lh-1x mb-2 d-block"
                      style={{ whiteSpace: "normal" }}
                    >
                      Host an Experience
                  </p>
                    {/* <p
                    className="sub-1x fw-500 lh-1x mb-1 d-block"
                    style={{ whiteSpace: "normal" }}
                  >
                    Get paid though activities
                  </p> */}
                    <p
                      className="lh-2x fw-300 fc-light d-block"
                      style={{ whiteSpace: "normal" }}
                    >
                      Earn money by showing your skills
                  </p>
                  </div>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item style={{ height: "auto", maxWidth: 300 }}>
              <Link href={{ pathname: "/behost", query: { step: 1, page: 1 } }}>
                <a className="d-flex">
                  <div className="p-2">{icon.property}</div>
                  <div className="p-2 w-100">
                    <p
                      className="title-1x lh-1x mb-2 d-block"
                      style={{ whiteSpace: "normal" }}
                    >
                      List your property
                  </p>
                    {/* <p
                    className="sub-1x fw-500 lh-1x mb-1 d-block"
                    style={{ whiteSpace: "normal" }}
                  >
                    Get paid though activities
                  </p> */}
                    <p
                      className="lh-2x fw-300 fc-light d-block"
                      style={{ whiteSpace: "normal" }}
                    >
                      Register your property and start earning
                  </p>
                  </div>
                </a>
              </Link>
            </Menu.Item>
          </SubMenu>
        )}

        {isLoggedin && (
          <Menu.Item key="Trip">
            <a href="">Trip</a>
          </Menu.Item>
        )}
        {isLoggedin && (
          <Menu.Item key="Inbox">
            <a href="">Inbox</a>
          </Menu.Item>
        )}
        {isLoggedin && (
          <Menu.Item key="Favorite">
            <a href="">Favorite</a>
          </Menu.Item>
        )}
        <Menu.Item key="Help">
          <a href="">Help</a>
        </Menu.Item>
        {/* {!isLoggedin && (
        <Menu.Item key="SignUp">
          <a onClick={onsignUpOpen}>Sign Up</a>
        </Menu.Item>
        )} */}
        {!isLoggedin && (
          <Menu.Item key="Login">
            <a onClick={showDrawer}>Login</a>
          </Menu.Item>
        )}
        {isLoggedin && (
          <SubMenu
            title={
              <Avatar src={userImageUrl} />
            }
          >

            <Menu.Item key="Profile">
              <Link href={{ pathname: "/profile" }}>
                Profile
              </Link>
            </Menu.Item>
            <Menu.Item key="account">
              <Link href={{ pathname: "/account" }}>
                Account
              </Link>
            </Menu.Item>
            <Menu.Item key="hotsPanel">
              <Link href={{ pathname: "/host-panel" }}>
                Host Panel
              </Link>
            </Menu.Item>
            <Menu.Item key="trips">
              <Link href={{ pathname: "/trips" }}>
                Trips
              </Link>
            </Menu.Item>
            <Menu.Item key="Logout">
              <a onClick={logout}>Logout</a>
            </Menu.Item>
            {/* <Menu.Item key="Logout">
              <a onClick={logout}>Profile</a>
            </Menu.Item> */}
          </SubMenu>
        )}
      </Menu>
      <LoginForm
        visible={visible}
        onLoginClose={onLoginClose}
        // showSignup={showSignup}
        setLogin={loginUser}
        showLogin={showDrawer}
      />
      <Signup
          visible={isSignUp}
          onSignupClose={onSignupClose}
       //   showLogin={showDrawer}
        />
    </Fragment>
  );
};

const HeaderWithSearch = ({ router: { pathname } }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <header>
      <Row className="menuBar">
        <Col xs={18} sm={4} className="header-logo">
          <Link href="/">
            <img src="./images/logo.png" style={{ width: "48px", height: "44px" }} />
          </Link>
        </Col>
        {/* <Col sm={1}></Col> */}
        <Col xs={18} sm={6} style={{marginTop:"20px"}}>
        <AutoCompleteSearch
            //   hurraayyType={hurraayyType}
            //   criteria={criteria}
              style={{ boxShadow: "none", border: "none" }}
            />
        </Col>
        <Col xs={6} sm={14}>
          <div className="rightMenu" style={{ marginTop: "5px;" }}>
            <RightMenu />
          </div>
            <div className="col-sm-6">
                
            </div>
          <div className="barsMenu" type="primary" onClick={showDrawer}>
            <Menu mode="horizontal">
              <Menu.Item key="mail">
                <Icon type="menu" />
              </Menu.Item>
            </Menu>
          </div>
          <Drawer
            title="Menu"
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
          >
            <RightMenu mod={1} />
          </Drawer>
        </Col>
      </Row>
    </header>
  );
};

export default withRouter(HeaderWithSearch);
