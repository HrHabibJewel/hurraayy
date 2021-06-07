import { Fragment } from "react";
import { withRouter } from "next/router";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Row,
  Col,
  Button,
  Menu,
  Icon,
  Steps,
  Collapse,
  Avatar,
  Divider,
} from "antd";
import Footer from "../components/AppLayout/footer";

const { SubMenu } = Menu;
const { Step } = Steps;
const { Panel } = Collapse;

const Component = ({ children, page, step }) => {
  const router = useRouter();
  const queryParams = router.query;

  return (
    <Fragment>
      <header style={{ borderBottom: "1px solid #e8e8e8" }}>
        <div className="container header">
          <Row className="menuBar">
            <Col xs={18} sm={6} className="header-logo">
              <Link href="/">
                <img
                  src="./images/logo.png"
                  style={{ width: "48px", height: "44px" }}
                />
              </Link>
            </Col>
            <Col xs={6} sm={18}>
              <div className="rightMenu" >
                <Link href="/">
                  <Button htmlType="submit" style={{ float: "right",marginTop:20 }}>
                    Exit
                  </Button>
                </Link>
              </div>

              {/* <div className="barsMenu" type="primary" onClick={showDrawer}>
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
              </Drawer> */} 
            </Col>
          </Row>
          {/* <Link href="/">
            <a>
              <img src="../images/logo.png" style={{ width: 40 }} />
            </a>
          </Link> */}
        </div>
      </header>
      <main>
        {children}

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
      {/* <Divider className="footer-separator" /> */}
      <Divider />
      <footer>
        <Footer />
      </footer>
      {/* <div className="container-fluid experience-form">
        <div className="row">
          <div className="w-20" style={{ background: "#FCFCFC" }}>
            <div className="pl-3">
              <Link href="/">
                <a>
                  <img src="../images/logo.png" style={{ width: 40 }} />
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div>
          <main style={{ minHeight: "100vh" }}>{children}</main>
        </div>
      </div> */}
    </Fragment>
  );
};

export default withRouter(Component);
