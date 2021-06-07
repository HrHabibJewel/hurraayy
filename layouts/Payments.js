import { Fragment } from "react";
import { withRouter } from "next/router";
import { Row, Col } from "antd";
import Footer from "../components/AppLayout/footer";
const Component = ({ children }) => {
  return (
    <Fragment>
      <div className="container pb-5">
        <Row>
          <Col md={{ span: 24 }}>
            <main className="payments-form">{children}</main>
          </Col>
        </Row>
      </div>
      <hr />
      <footer className="pt-5">
        <Footer />
      </footer>
    </Fragment>
  );
};

export default withRouter(Component);
