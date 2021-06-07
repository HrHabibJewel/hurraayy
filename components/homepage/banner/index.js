import s from "./style.module.css";
import { Button, Carousel } from "antd";
import Router from "next/router"
import { useEffect, useState, useLayoutEffect } from "react";
import { getAuthentication } from '../../../lib/utils/utility'
import LoginForm from "../../common/loginForm/login";
export default () => {
  const [visible, setVisible] = useState(false);
  const [path, setPath] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSmallerDesktop, setIsSmallerDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const onLoginClose = () => {
    setVisible(false);
  };
  const showDrawer = () => {
    setVisible(true);
  };
  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsDesktop(window.innerWidth > 1440 ? true : false);
      setIsSmallerDesktop(window.innerWidth > 1375 ? true : false)
      setIsMobile(window.innerWidth < 650 ? true : false)
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  const onRoute = (path) => {
    setPath(path);
    if (!getAuthentication()) {
      setVisible(true);
    } else {
      Router.push(path);
    }

  }

  const loginUser = () => { };
  return (
    <div className="home-banner">
      {/* className={isDesktop? s["container1"] : ""} */}
      <Carousel 
      autoplay
      >
        <div>
          <div
            className={s["hero-banner"]}
            style={{
              backgroundImage: `url("images/Home_adventure_slider.jpg")`,
              marginLeft: isDesktop? 50: isSmallerDesktop? 100 : isMobile? 30: 50,
              marginRight: isDesktop? 50: isSmallerDesktop? 100 : isMobile? 30: 50,
            }}
          >
            <img src="./images/logo.png" style={{marginBottom:isMobile ? -40:''}} />
            <p>
              Do you organise adventures, trekking, hiking, multi day tours?
              <br />Is traveling your passion? If yes then you can start
              earning by
              <br />listing your travel business with us!
            </p>
            {/* <h3>Save 30% Money</h3> */}
            <br />
            <Button onClick={() => onRoute("/adventure-host?step=1&page=1")} size="large" type="primary" style={{ color: "#fefefe" }}>
              Host an Adventure
            </Button>
          </div>
        </div>
        <div >
          <div
            className={s["hero-banner"]}
            style={{
              backgroundImage: `url("images/Home_experience_slider.jpg")`,
              marginLeft: isDesktop? 50: isSmallerDesktop? 100 : isMobile? 30: 50,
              marginRight: isDesktop? 50: isSmallerDesktop? 100 : isMobile? 30: 50,
            }}
          >
            <img src="./images/logo.png" style={{marginBottom:isMobile ? -40:140}} />
            <p>
              Can you lead people into
              <br />travel activities, site seeing, day tours?
              <br />Do you posses unique skills?
              <br />If yes then you can start earning by listing your activities with
              us!
            </p>
            {/* <h3>Save 70% Money</h3> */}
            <br />
            <Button onClick={() => onRoute("/experience-host?step=1&page=1")} size="large" type="primary">
              Host an Experience
            </Button>
          </div>
        </div>
        <div>
          <div
            className={s["hero-banner"]}
            style={{
              backgroundImage: `url("images/Home_property_slider.jpg")`,
              marginLeft: isDesktop? 50: isSmallerDesktop? 100 : isMobile? 30: 50,
              marginRight: isDesktop? 50: isSmallerDesktop? 100 : isMobile? 30: 50,
            }}
          >
            <img src="./images/logo.png" style={{marginBottom:isMobile ? -10:''}} />
            <p>
              Do you have spare property? Do you have hotel, resort
              <br />business? If yes then you can list your property and start
              <br />earning!
            </p>
            {/* <h3>Save 90% Money</h3> */}
            <br />
            <Button onClick={() => onRoute("/behost?step=1&page=1")}
              size="large" type="primary">
              List your property
            </Button>
          </div>
        </div>
      </Carousel>
      <LoginForm
        visible={visible}
        onLoginClose={onLoginClose}
        // showSignup={showSignup}
        setLogin={loginUser}
        showLogin={showDrawer}
      />
    </div>
  );
};
