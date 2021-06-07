import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Checkbox, Spin } from "antd";
import { getAdvFormEditData } from "../../lib/utils/utility";

class ProcessTwo extends React.Component {
  state = { loading: true };

  componentDidMount() {
    this.getEditData();
  }

  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp && resp['user']) {
        let userName = resp['user']['firstName'] + " " + resp['user']['lastName'];
        this.setState({ userName: userName })
      }
      this.setState({ loading: false })
    });
  }

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>Nearly done, {this.state.userName}!</h2>
            {/* <p>
              Qui magna labore sunt do sunt mollit ad veniam deserunt tempor
              magna nisi ea. Sit voluptate laborum proident et mollit deserunt
              duis aliqua ipsum nisi.
            </p> */}
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Checkbox.Group style={{ width: "100%" }}>
              <Row gutter={24}>
                <Col span={24}>
                  <b>Step 1</b>
                  <p>Towels, bed, sheets, soap, toilet paper, and more</p>
                  <a style={{ color: '#ff6204' }}>Edit</a>
                  <Button
                    type="primary"
                    shape="circle"
                    icon="check"
                    style={{ float: "right", cursor: "auto" }}
                  />
                </Col>
                <Col span={24}>
                  <b>Step 2</b>
                  <h3>Set the scene</h3>
                  <p>Photos, short description, title</p>
                  <a style={{ color: '#ff6204' }}>Edit</a>
                  <Button
                    type="primary"
                    shape="circle"
                    icon="check"
                    style={{ float: "right", cursor: "auto" }}
                  />
                </Col>
                <Col span={24}>
                  <b>Step 3</b>
                  <h2>Few more things</h2>
                  <p>Price, calendar etc</p>
                  <Button
                    type="primary"
                    onClick={() =>
                      this.props.continue({ page: 1, step: 3 })
                    }
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </Checkbox.Group>
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <a onClick={() => this.props.continue({ page: 4, step: 2 })}>
                    <Icon type="left" />
                    &nbsp;Back
                  </a>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px", float: "right" }}
                >
                  <Button type="primary" onClick={() =>
                    this.props.continue({ page: 1, step: 3 })
                  }>
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

const WrappedApp = Form.create({ name: "coordinated" })(ProcessTwo);

export default connect()(WrappedApp);