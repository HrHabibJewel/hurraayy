import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Checkbox, Spin } from "antd";
import { getAdvFormEditData } from "../../lib/utils/utility";

class GuestSpaceSetting extends React.Component {
  state = {
    userName: "",
    loading: true
  };
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

  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        next({ page: 1, step: 2, data: true });
      }
    });
  };
  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>You are nearly there, {this.state.userName}!</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Checkbox.Group style={{ width: "100%" }}>
              <Row gutter={24}>
                <Col span={24}>
                  <b>Step 1</b>
                  <p>Bedrooms, amenitites etc</p>
                  <a style={{ color: '#ff6204' }}>Edit</a>
                  <Button
                    type="primary"
                    shape="circle"
                    icon="check"
                    style={{ float: "right", cursor: 'auto' }}
                  />
                </Col>
                <Col span={24}>
                  <b>Step 2</b>
                  <h3>Photos, descriptions etc</h3>
                  <Button
                    type="primary"
                    onClick={() => this.props.continue({ page: 1, step: 2 })}
                  >
                    Continue
                  </Button>
                </Col>
                <Col span={24}>
                  <b>Step 3</b>
                  <h2>Settings</h2>
                  <p> Price, calendar etc</p>
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
                    onClick={() => {
                      this.props.continue({ page: 8, step: 1 });
                    }}>
                    <a>
                      <Icon type="left" />
                      &nbsp;Back
                    </a>
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

const WrappedApp = Form.create({ name: "coordinated" })(GuestSpaceSetting);

export default connect()(WrappedApp);