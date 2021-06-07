import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Checkbox, Spin } from "antd";

// import "./style.css";

class CheckRequirements extends React.Component {
  state = {loading:false};
  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        next({ page: 4, step: 3, data: true });
      }
    });
  };

  render() {
    const {loading} = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>Review Hurraayy’s guest requirements</h2>
            <p>
              Qui magna labore sunt do sunt mollit ad veniam deserunt tempor
              magna nisi ea. Sit voluptate laborum proident et mollit deserunt
              duis aliqua ipsum nisi.
            </p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Checkbox.Group style={{ width: "100%" }}>
              <Row gutter={24}>
                <Col span={24}>
                  <p>
                    All Hurraayy guest must provide{" "}
                    <Button className="float-right" type="link">
                      Review
                    </Button>
                  </p>
                  <ul>
                    <li>
                      <Icon type="check" /> Email address
                    </li>
                    <li>
                      <Icon type="check" /> Confirmed phone number
                    </li>
                    <li>
                      <Icon type="check" /> Payment information
                    </li>
                  </ul>
                </Col>
                <Col span={24}>
                  <p>
                    Before booking your home, each guest must:{" "}
                    <Button className="float-right" type="link">
                      Edit
                    </Button>
                  </p>
                  <ul className="fa-ul">
                    <li>
                      <Icon type="check" /> Agree to your House Rules
                    </li>
                    <li>
                      <Icon type="check" /> Message you about their trip
                    </li>
                    <li>
                      <Icon type="check" /> Let you know how many guests are
                      coming
                    </li>
                    <li>
                      <Icon type="check" />
                      Confirm their check-in time if they’re arriving within 2
                      days
                    </li>
                  </ul>
                </Col>
                <Col span={24}>
                  <p>
                    Your additional requirements{" "}
                    <Button className="float-right" type="link">
                      Edit
                    </Button>
                  </p>
                  <ul className="fa-ul">
                    <li>
                      <Icon type="check" /> Government-issued ID submitted to
                      Airbnb
                    </li>
                  </ul>
                </Col>
              </Row>
            </Checkbox.Group>
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() => this.props.continue({ page: 2, step: 3 })}
                  >
                    <Icon type="left" />
                    &nbsp;Back
                  </Button>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px", float: "right" }}
                >
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(CheckRequirements);

export default connect()(WrappedApp);
