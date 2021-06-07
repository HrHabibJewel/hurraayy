import Link from "next/link";
import { Menu, Icon, Drawer, Row, Col, Select, Avatar, Modal, Input, Button,notification,Form } from "antd";
import { withRouter, useRouter } from "next/router";
import { useState, useEffect, useRef, Fragment, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import LoginForm from "../../common/loginForm/login";
import { useDispatch } from "react-redux";
import { authLogout } from "../../../store/auth/actions";
import StorageService from "../../../lib/storage.service";
import * as icon from "./icon";
import storageService from "../../../lib/storage.service";
import Signup from "./../../common/loginForm/signup";
import { tuple } from "antd/lib/_util/type";
import { $openAxios } from "../../../lib/http-service";

const SubMenu = Menu.SubMenu;
const { Option } = Select;

const _userMenuStyle = {
  fontFamily: "Heebo",
  fontSize: 13,
  // color:"#094553",
  fontWeight: 400
}

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
};

const RightMenu = ({ mod }) => {
  // const { getFieldDecorator, validateFields } = props.form;
  const [visible, setVisible] = useState(false);
  const [urlFromHost, setUrlFromHost] = useState("");
  const [isLoggedin, setLoginStatus] = useState(false);
  const [isOnce, setOnce] = useState(false);
  const dispatch = useDispatch();
  const [userImageUrl, setUserImageUrl] = useState('./images/Avatar.jpg');
  const userInfo = useSelector((state) => state.auth);
  const router = useRouter();
  const [isSignUp, setSignUp] = useState(false);
  const [resentEmailVisible, setResentEmailVisible] = useState(false);
  const [usrEmail, setUsrEmail] = useState("");

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
    if (urlFromHost) {
      goToHostPage(urlFromHost)
    }
  };
  const logout = () => {
    if (dispatch(authLogout())) {
      setLogin(false);
      storageService.destroyUserProfile();
      router.push('/')
    }
  };

  const onSignupClose = (data) => {
    setSignUp(false);
    if (data && data['usr']) {
      setUsrEmail(data['usr'])
      setResentEmailVisible(true);
    }
  }

  const showLogin = () => {
    showDrawer();
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

  function goToPage(url) {
    setUrlFromHost(url);
    if (isLoggedin) {
      goToHostPage(url);
    } else {
      setVisible(true);
    }
  }

  function goToHostPage(url) {
    if(url == "trips"){
      router.push({ pathname: "/"+url})
    }
    else{
      router.push({ pathname: "/"+url, query: { step: 1, page: 1 } })
    }
  }
  function handleResendEmail() {
    // console.log("usrEmail", usrEmail);
    // e.preventDefault();
    // this.props.form.validateFields((err, values) => {
      if (usrEmail != "") {
        let params = {};
        params["email"] =usrEmail;// values["resend-email"];
        $openAxios
          .post("/registration/resend-mail", JSON.stringify(params))
          .then((res) => {
            if (res && res.status == 201) {
              // this.setState({ visible: false });
              setResentEmailVisible(false);
              getNotification(
                "success",
                // "please check your email and click on the link to verify."
                "We have sent the confirmation link to your email. You may click on the link and confirm your account."
              );
            } else {
              getNotification("error", "Please do the registration again");
            }
            // this.setState({ forgotPassword: false });
            setResentEmailVisible(false);
          })
          .catch((err) => {
            if (err.response) {
              getNotification(
                "error",
                err.response.data.error_description
              );
            }
          });
      }
    // });
  };
  const passwordRecoveryClose = () => {
    setResentEmailVisible(false);
  };
  const getNotification = (type = "success", msg = "") => {
    let _title = "Success";
    if (type == "error") {
      _title = "Error";
    }
    notification[type]({
      message: _title,
      description: msg,
      onClick: () => {
        //console.log('Notification Clicked!');
      },
    });
  };
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
          // size="large"
          >
            <Option value="bdt"><span style={{ fontFamily: "Heebo", fontSize: "13px", color: "#094553" }}>BDT</span></Option>
            {/* <Option value="usd">USD</Option> */}
          </Select>
        </Menu.Item>
        {/* {isLoggedin && ( */}
          <SubMenu title={<span style={{ fontFamily:"Heebo",fontSize:"13px",color:"#094553",fontWeight:700 }}>
            Host & earn</span>} >
            <Menu.Item style={{ height: "auto", maxWidth: 220 }} onClick={() => goToPage("adventure-host")}>
              {/* <Link href={{ pathname: "/adventure-host", query: { step: 1, page: 1 } }}> */}
                <a className="d-flex">
                  <div className="p-2">{icon.adventure}</div>
                  <div className="p-2 w-100">
                    <p
                      className="title-1x lh-1x mb-2 d-block"
                      style={{ whiteSpace: "normal",fontFamily:"Heebo",fontSize:"13px",fontWeight:700 }}
                    >Host an Adventure</p>
                    {/* <p
                    className="sub-1x fw-500 lh-1x mb-1 d-block"
                    style={{ whiteSpace: "normal" }}
                  >
                    Guide people & earn money
                  </p> */}
                    <p 
                      className="lh-2x fw-300 fc-light d-block" 
                      style={{ whiteSpace: "normal",fontFamily:"Heebo",fontSize:"12px",color:"#094553",fontWeight:400 }}
                    >Start earning by guiding people into adventures</p>
                  </div>
                </a>
              {/* </Link> */}
            </Menu.Item>
            <Menu.Item style={{ height: "auto", maxWidth: 220 }} onClick={() => goToPage("experience-host")}>
              {/* <Link
                href={{
                  pathname: "/experience-host",
                  query: { step: 1, page: 1 },
                }}
              > */}
            <a className="d-flex">
              <div className="p-2">{icon.experience}</div>
              <div className="p-2 w-100">
                <p
                  className="title-1x lh-1x mb-2 d-block"
                  style={{ whiteSpace: "normal", fontFamily: "Heebo", fontSize: "13px", fontWeight: 700 }}
                >Host an Experience</p>
                {/* <p
                    className="sub-1x fw-500 lh-1x mb-1 d-block"
                    style={{ whiteSpace: "normal" }}
                  >
                    Get paid though activities
                  </p> */}
                    <p
                      className="lh-2x fw-300 fc-light d-block"
                      style={{ whiteSpace: "normal",fontFamily:"Heebo",fontSize:"12px",color:"#094553",fontWeight:400 }}
                    >Earn money by showing your skills</p>
                  </div>
                </a>
              {/* </Link> */}
            </Menu.Item>
            <Menu.Item style={{ height: "auto", maxWidth: 220 }} onClick={() => goToPage("behost")}>
              {/* <Link href={{ pathname: "/behost", query: { step: 1, page: 1 } }}> */}
                <a className="d-flex">
                  <div className="p-2">{icon.property}</div>
                  <div className="p-2 w-100">
                    <p
                      className="title-1x lh-1x mb-2 d-block"
                      style={{ whiteSpace: "normal",fontFamily:"Heebo",fontSize:"13px",fontWeight:700 }}
                    >List your property</p>
                    {/* <p
                    className="sub-1x fw-500 lh-1x mb-1 d-block"
                    style={{ whiteSpace: "normal" }}
                  >
                    Get paid though activities
                  </p> */}
                <p
                  className="lh-2x fw-300 fc-light d-block"
                  style={{ whiteSpace: "normal", fontFamily: "Heebo", fontSize: "12px", color: "#094553", fontWeight: 400 }}
                >Register your property and start earning</p>
              </div>
            </a>
            {/* </Link> */}
          </Menu.Item>
        </SubMenu>
        {/* // )} */}

        {isLoggedin && (
          <Menu.Item key="Trip" onClick={() => goToPage("trips")}>
            {/* <a href="/trips"> */}
              <span style={{ fontFamily:"Heebo",fontSize:"13px",color:"#094553",fontWeight:700 }}>Trips</span>
            {/* </a> */}
          </Menu.Item>
        )}
        {/* {isLoggedin && (
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
        </Menu.Item> */}
        {!isLoggedin && (
          <Menu.Item key="SignUp">
            <a onClick={onsignUpOpen} style={{ fontFamily: "Heebo", fontSize: "13px", color: "#094553", fontWeight: 700 }}>Sign Up</a>
          </Menu.Item>
        )}
        {!isLoggedin && (
          <Menu.Item key="Login">
            <a onClick={showDrawer} style={{ fontFamily: "Heebo", fontSize: "13px", color: "#094553", fontWeight: 700 }}>Login</a>
          </Menu.Item>
        )}
        {isLoggedin && (
          <SubMenu
            title={
              <Avatar src={userImageUrl} />
            }
          >

            <Menu.Item key="Profile">
              <Link href={{ pathname: "/profile" }} >
                <span style={_userMenuStyle}>Profile</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="account">
              <Link href={{ pathname: "/account" }}>
                <span style={_userMenuStyle}>Account</span>

              </Link>
            </Menu.Item>
            <Menu.Item key="hotsPanel">
              <Link href={{ pathname: "/host-panel" }}>
                <span style={_userMenuStyle}>Host Panel</span>

              </Link>
            </Menu.Item>
            <Menu.Item key="trips">
              <Link href={{ pathname: "/trips" }}>
                <span style={_userMenuStyle}>Trips</span>

              </Link>
            </Menu.Item>
            <Menu.Item key="Logout">
              <a onClick={logout}>
                <span style={_userMenuStyle}>Logout</span>
              </a>
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
        showLogin={showLogin}
      />

      {/* <Modal
        title={null}
        closable={false}
        visible={resentEmailVisible}
        footer={null}
      // onOk={Router.push({pathname:"/hosting/listings"})}
      >
        <b>Welcome aboard! Thank you for joining us</b>
        <p>We have sent you an email. Please tap the link in the email to finish the sign-up process.  </p>
        <br />
        <br />
        <br />
        <br />
        <p>If you haven’t received the email then please tap the send email button below:</p>

        <Input size="large" placeholder="Email" value={usrEmail} />
        <Button style={{ paddingTop: "10px" }} size="large" type="primary" onClick={() => {
          setResentEmailVisible(false)
        }}>
          Resend Email
          </Button>
      </Modal> */}
      
        <Modal
          title={null}
          centered
          // visible={this.state.visible}
          visible={resentEmailVisible}
          onCancel={passwordRecoveryClose}
          footer={null}
          wrapClassName="border-modal-2"
        >
          <div className="text-center">
            <h6 className="fc-black ff-heebo fw-600 lh-6x m-0">
              Welcome aboard! Thank you for joining us
            </h6>
          </div>
          <br />
          <p>
            We have sent you an email. Please tap the link in the email to
            finish the sign-up process.{" "}
          </p>
          <p>
            If you haven’t received the email then please tap the resend email
            button below:
          </p>
          <Form onSubmit={handleResendEmail} style={{ marginTop: "20px" }}>
            <Form.Item>
              <Input size="large" placeholder="Email" value={usrEmail} 
              onChange={(e) => setUsrEmail(e.target.value)}
              />
              {/* {getFieldDecorator("resend-email", {
                initialValue: usrEmail,
                rules: [{ required: true, message: "Please input your mail!" }],
              })(<Input size="large" placeholder="Email" />)} */}
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button type="primary" className="mb-1" size="large" block onClick={handleResendEmail}>
                <b style={{ fontFamily: "Heebo", fontSize: 14, fontWeight: 600 }}>
                  Resend Email
                </b>
              </Button>
            </Form.Item>
          </Form>
        </Modal>
    </Fragment>
  );
};

const Header = ({ router: { pathname } }) => {
  const [visible, setVisible] = useState(false);
  const [isLowResolution, setIsLowResolution] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsLowResolution(window.innerWidth > 1400 ? true : false);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <header>
      <Row className="menuBar">
        <Col xs={18} sm={6} className="header-logo">
          <Link href="/">
            <img src="./images/logo.png" style={{ width: "48px", height: "44px", marginTop: 12 }} />
            
          </Link>
          <Link href="/">
            <img src="./images/hurraayy_title.svg" style={{ width: "168px", height: "20px", marginTop: 12 }} />
            
          </Link>
        </Col>
        {/* <Col sm={3}>
        <Link href="/">
          
          </Link>
        </Col> */}
        <Col xs={6} sm={18}>
          <div className="rightMenu"
          style={{marginTop:isLowResolution?0:12}}>
            <RightMenu />
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

export default withRouter(Header);