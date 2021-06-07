import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Listing from "../../layouts/Listing";
import { Row, Col, Form, Select, Input, Button, Icon, Radio } from "antd";

const { Option } = Select;

class GuestSetting extends React.Component {
  state = {
    value: 3,
    value1: 1,
    value2: 1,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Router.push("/become-a-host/accoommodation");
        //console.log("Received values of form: ", values);
      }
    });
  };

  handleSelectChange = (value) => {
    //console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === "male" ? "man" : "lady"}!`,
    });
  };

  onChange = (e) => {
    //console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value,
    });
  };
  onChange1 = (e) => {
    //console.log("radio checked", e.target.value);
    this.setState({
      value1: e.target.value,
    });
  };
  onChange2 = (e) => {
    //console.log("radio checked", e.target.value);
    this.setState({
      value2: e.target.value,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      <Listing step={1} page={3}>
        <div className="guest-setting">
          <div>
            <h2>What will guest have?</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  <Radio.Group
                    onChange={this.onChange}
                    value={this.state.value}
                  >
                    <Radio style={radioStyle} value={1}>
                      <b>Entire place</b>
                    </Radio>
                    <p>
                      Qui magna labore sunt do sunt mollit ad veniam deserunt
                      tempor magna nisi ea. Sit voluptate laborum proident et
                      mollit deserunt duis aliqua ipsum nisi.
                    </p>
                    <Radio style={radioStyle} value={2}>
                      <b>Private room</b>
                    </Radio>
                    <p>
                      Qui magna labore sunt do sunt mollit ad veniam deserunt
                      tempor magna nisi ea. Sit voluptate laborum proident et
                      mollit deserunt duis aliqua ipsum nisi.
                    </p>
                    <Radio style={radioStyle} value={3}>
                      <b>Shared room</b>
                    </Radio>
                    <p>
                      Qui magna labore sunt do sunt mollit ad veniam deserunt
                      tempor magna nisi ea. Sit voluptate laborum proident et
                      mollit deserunt duis aliqua ipsum nisi.
                    </p>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <h4>Is this setup as a dedicated guest space?</h4>
                <Form.Item>
                  <Radio.Group
                    onChange={this.onChange1}
                    value={this.state.value1}
                  >
                    <Radio style={radioStyle} value={1}>
                      Yes, it’s primarily setup for guests
                    </Radio>
                    <Radio style={radioStyle} value={2}>
                      No, it’s primarily setup for guests
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <h4>Are you listing on Hurraayy as part of a company?</h4>
                <Form.Item>
                  <Radio.Group
                    onChange={this.onChange2}
                    value={this.state.value2}
                  >
                    <Radio style={radioStyle} value={1}>
                      Yes, I work for or run a business
                    </Radio>
                    <Radio style={radioStyle} value={2}>
                      No, that doesn’t sound like me
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <p>
                  Qui magna labore sunt do sunt mollit ad veniam deserunt tempor
                  magna nisi ea. Sit voluptate laborum proident et mollit
                  deserunt duis aliqua ipsum nisi.
                </p>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <a onClick={() => Router.push("/become-a-host/place-type")}>
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
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Listing>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(GuestSetting);

export default connect()(WrappedApp);
