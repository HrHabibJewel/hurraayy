import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import {
  Form,
  Input,
  DatePicker,
  Checkbox,
  Button,
  notification,
  Modal,
  Row,
  Col,
  Card,
} from "antd";
import Router from "next/router";
import { $openAxios } from "../lib/http-service";

import HeroSection from "../components/homepage/hero-section";
import s from "../components/host-panel/style.module.css";

class PageIndex extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    error: "",
  };
  componentDidMount() {}

  getNotification = (type = "success", msg = "") => {
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && Router.query && Router.query["q"]) {
        let params = {};
        let _this = this;
        params["pwd"] = values["password"];
        params["q"] = Router.query["q"];

        $openAxios
          .put("registration/reset-password", JSON.stringify(params))
          .then(function (resp) {
            if (resp && resp.status == 201) {
              _this.getNotification(
                "success",
                "Password changed Successfully!"
              );
              Router.push("/");
            }
          });
      }
    });
  };

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="container">
        <div className="row">
          <Card
            className={`${s["reset-pass-cardstyle"]}`}
            // style={{
            //   width: "30%",
            //   margin: "0px auto",
            //   marginTop: "70px",
            //   paddingBottom: "0px",
            // }}
          >
            <Form onSubmit={this.handleSubmit} className="login-form">
              <div className="row">
                <Col span={24}>
                  <Form.Item hasFeedback>
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        {
                          validator: this.validateToNextPassword,
                        },
                      ],
                    })(
                      <Input.Password
                        size="large"
                        placeholder="Choose a new password"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item hasFeedback>
                    {getFieldDecorator("confirm", {
                      rules: [
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        {
                          validator: this.compareToFirstPassword,
                        },
                      ],
                    })(
                      <Input.Password
                        size="large"
                        placeholder="Confirm password"
                        onBlur={this.handleConfirmBlur}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    {/* <Button size="large" type="primary" htmlType="submit" block>
                
              </Button> */}
                    <Button
                      type="primary"
                      className="mb-1"
                      htmlType="submit"
                      size="large"
                      block
                    >
                      <b
                        style={{
                          fontFamily: "Heebo",
                          size: 16,
                          fontWeight: 600,
                        }}
                      >
                        Reset Password
                      </b>
                    </Button>
                  </Form.Item>
                </Col>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    );
  }
}

// const mapState = (state) => {
//   return { userInfo: state.auth };
// };

// export default connect(mapState)(PageIndex);
export default Form.create()(PageIndex);
