import { Fragment } from "react";
import { withRouter } from "next/router";
import Router from "next/router";
import Link from "next/link";
import { Row, Col, Button,Menu,Icon, Divider } from "antd";
import Footer from "../../components/AppLayout/footer";
import Header from "../../components/AppLayout/header/Header";

const { SubMenu } = Menu;

const Component = ({children}) => {
  return (
    <Fragment>
      <div className="container">
      <header>
        <Row>
          <Col md={{ span: 1 }}>
            
            <Link href="/">
             <a><img style={{width: "40px", height: "40px",marginTop: "14px"}} src="../images/logo.png" /></a>
              </Link>
            </Col>
            <Col md={{ span: 23 }}>
            <Menu 
            mode={"horizontal"}
            defaultSelectedKeys={['listings']}
            >
                <Menu.Item key="home">Home</Menu.Item>
                <Menu.Item key="inbox">Inbox</Menu.Item>
                <Menu.Item key="calendar">Calendar</Menu.Item>
                <Menu.Item key="listings"> 
                    <Link href="/hosting/listings"><a>Listings</a></Link>
                </Menu.Item>
                <Menu.Item key="help">Help</Menu.Item>
            </Menu>
            </Col>
            </Row>
            </header>
            <Row>
          <Col md={{ span: 24 }}>
            <Divider />
                <main className="listing-form">{children}</main>
            <Divider />
            <footer>
                <Footer />
            </footer>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default withRouter(Component);
