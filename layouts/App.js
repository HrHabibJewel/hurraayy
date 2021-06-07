import { Fragment } from "react";
import { Divider } from "antd";
import Header from "../components/AppLayout/header/Header";
import Footer from "../components/AppLayout/footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess } from "../store/auth/actions";
import { adventrueForm } from "../store/adventureForm/actions";
import StorageService from "../lib/storage.service";
import Head from "next/head";
import HeaderWithSearch from "../components/AppLayout/header/HeaderWithSearch";
import { Scrollbars } from "react-custom-scrollbars";
export default ({ children }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth);
  const [color, setColor] = useState("white");
  const [scrollPosition, setScrollPosition] = useState(null);
  var token, localUser, step, adventureForm;
  useEffect(() => {
    // window.addEventListener('scroll', listenScrollEvent)
    !token && checkIt();
    // return () => {
    //   window.removeEventListener("scroll", listenScrollEvent);
    // };
  });

  const checkIt = () => {
    if (localStorage) {
      token = StorageService.getToken();
      localUser = localStorage.getItem("user");
      step = localStorage.getItem("step");
      adventureForm = JSON.parse(StorageService.getAdventureForm());

      if (adventureForm && Object.keys(adventureForm).length > 0) {
        dispatch(
          adventrueForm(
            adventureForm["currentPageName"],
            adventureForm["propertyId"]
          )
        );
      }
      if (userInfo && Object.keys(userInfo) < 1 && localUser) {
        dispatch(authSuccess(step, token, localUser));
      }
    }
  };

  const listenScrollEvent = () => {
    setScrollPosition(window.scrollY);
    // if (window.scrollY > 195) {
    //   setColor('black')
    //   setScrollPosition(window.scrollY)
    // } else {
    //   setColor('white')
    //   setScrollPosition()
    // }
    // console.log("scroll", window.scrollY);
  };
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: "#ff6204",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const CustomScrollbars = (props) => (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      {...props}
    />
  );
  return (
    <CustomScrollbars
      autoHide
      autoHideTimeout={500}
      autoHideDuration={200}
      style={{ height: "100vh" }}
    >
      <Fragment>
        <Head>
          <link rel="shortcut icon" href="./images/favicon.ico" />
          <title>
            Adventures | Travel activities | Accommodations | Travel marketplace
          </title>
        </Head>
        <header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            borderBottom: "1px solid #e8e8e8",
            backgroundColor: color,
            marginTop: "-10px",
          }}
        >
          <div className="container header">
            {/* {scrollPosition > 100 
          ? <HeaderWithSearch/>
          :<Header />} */}
            <Header />
          </div>
        </header>
        <main>
          <div style={{ paddingTop: "70px" }}>{children}</div>

          <style jsx global>{`
            // * {
            //   font-family: Menlo, Monaco, 'Lucida Console', 'Liberation Mono',
            //     'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New',
            //     monospace, serif;
            // }
            // .container{
            //   maxwidth
            // }
          `}</style>
        </main>
        {/* <Divider className="footer-separator"style={{marginTop:"20px"}} /> */}
        <Divider style={{ marginTop: "20px",marginBottom:"20px" }} />
        <footer>
          <Footer />
        </footer>
      </Fragment>
    </CustomScrollbars>
  );
};
