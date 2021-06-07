import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Divider,
  Modal,
  notification,
} from "antd";
import { auth } from "../../../store/auth/actions";
import { connect } from "react-redux";
import Signup from "./signup";
import { Fragment } from "react";
import { $axios, $openAxios } from "../../../lib/http-service";
import storageService from "../../../lib/storage.service";
import s from "../../adventureDetailsPage/details-sections/style.module.css";

class LoginForm extends React.Component {
  state = {
    signup: false,
    error: "",
    visible: false,
    userEmail: "",
    forgotPassword: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values["email"] && values["password"]) {
        this.setState({ error: "" });
        let _this = this;
        let isBooking = false;
        let email = values["email"];
        let password = values["password"];
        if (_this.props.isBooking) {
          isBooking = true;
        }
        this.props.dispatch(auth(email, password)).then((res) => {
          if (res && res.status == 500) {
            this.setState({ error: "user name and password invalid" });
          }
          if (res && res.status == 200) {
            _this.props.onLoginClose();
            _this.props.setLogin();
            $axios.get("/profile").then((res) => {
              if (res && res.status == 200) {
                //console.log(res.data);
                storageService.saveUserProfile(res.data);
              }
            });
          }
        });
      }
    });
  };
  showSignup = () => {
    this.setState({ signup: true });
  };
  onSignupClose = (data) => {
    this.setState({ signup: false });
    if (data && data["usr"]) {
      this.setState({ userEmail: data["usr"] });
      this.setState({ visible: true });
    }
  };

  handleForgotPassword = () => {
    this.props.onLoginClose();
    this.setState({ forgotPassword: true });
  };
  handleForgotPasswordBack = () => {
    this.props.showLogin();
    this.forgotPasswordClose();
  };

  forgotPasswordClose = () => {
    this.setState({ forgotPassword: false });
  };

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

  handleResetEmail = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values["send-email"]) {
        let params = {};
        params["email"] = values["send-email"];
        $openAxios
          .post("/registration/forget-password", JSON.stringify(params))
          .then((res) => {
            if (res && res.status == 201) {
              this.getNotification(
                "success",
                // "please check your email and click on the link to verify."
                "We have sent the password reset link to your email. You may click on the link and reset your password."
              );
            } else {
              this.getNotification("error", "Your password not validated.");
            }
            this.setState({ forgotPassword: false });
          })
          .catch((err) => {
            if (err.response) {
              this.getNotification(
                "error",
                err.response.data.error_description
              );
            }
          });
      }
    });
  };
  passwordRecoveryClose = () => {
    this.setState({ visible: false });
  };

  handleResendEmail = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (values["resend-email"]) {
        let params = {};
        params["email"] = values["resend-email"];
        $openAxios
          .post("/registration/resend-mail", JSON.stringify(params))
          .then((res) => {
            if (res && res.status == 201) {
              this.setState({ visible: false });
              this.getNotification(
                "success",
                // "please check your email and click on the link to verify."
                "We have sent the confirmation link to your email. You may click on the link and confirm your account."
              );
            } else {
              this.getNotification("error", "Please do the registration again");
            }
            this.setState({ forgotPassword: false });
          })
          .catch((err) => {
            if (err.response) {
              this.getNotification(
                "error",
                err.response.data.error_description
              );
            }
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { error } = this.state;
    let invalidValidation;
    if (this.props.userInfo["error"]) {
      invalidValidation = (
        <div style={{ color: `red` }}>
          <b>Invalid user name and password</b>
        </div>
      );
    }
    return (
      <Fragment>
        <Modal
          title={
            // <Button className="border-0" icon="left">
            //   Back
            // </Button>
            null
          }
          // wrapClassName="modal-login"
          visible={this.props.visible}
          // onOk={this.handleOk}
          onCancel={this.props.onLoginClose}
          //closeIcon={<Icon type="left" />}
          footer={null}
          wrapClassName="border-modal"
        >
          <div className="login">
            <div className="text-center" style={{ paddingTop: 20 }}>
              <h2 className="fc-primary ff-heebo fw-600 lh-6x m-0 title-2x">
                Log in to Hurraayy
              </h2>
              <p>&nbsp;</p>
              {/* <p className="lh-4x sub-1x">
            Find your best accommodation & adventure with Hurraayy
          </p> */}
            </div>
            {/* {invalidValidation} */}
            <Form
              onSubmit={this.handleSubmit}
              className="login-form"
              autoComplete="off"
            >
              <Form.Item>
                {getFieldDecorator("email", {
                  rules: [
                    { required: true, message: "Please type your email!" },
                  ],
                })(<Input size="large" placeholder="Email" />)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please type your password!" },
                  ],
                })(<Input.Password size="large" placeholder="Password" />)}
              </Form.Item>
              {error && <p className="text-danger small">{error}</p>}
              <Form.Item>
                <div>
                  {getFieldDecorator("remember", {
                    valuePropName: "checked",
                    initialValue: true,
                  })(<Checkbox>Remember me</Checkbox>)}
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  size="large"
                  block
                >
                  <span
                    style={{
                      fontFamily: "Heebo",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Log in
                  </span>
                </Button>
                <div className="text-center">
                  <a
                    className="login-form-forgot fc-dark"
                    onClick={() => this.handleForgotPassword()}
                  >
                    Forgot password?
                  </a>
                </div>
                {/* <Divider>Or log in with</Divider>
                <div className="text-center">
                  <Button className="icn icn-google" size="large">
                    Google
                  </Button>
                  <Button className="icn icn-facebook" size="large">
                    Facebook
                  </Button>
                </div> */}
                <div className="login-signup text-center">
                  Don’t have an account?&nbsp;
                  <a
                    href="#"
                    onClick={() => {
                      this.showSignup();
                      this.props.onLoginClose();
                    }}
                    style={{ color: "#ff6204" }}
                  >
                    Sign Up
                  </a>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        <Signup
          visible={this.state.signup}
          onSignupClose={this.onSignupClose}
          showLogin={this.props.showLogin}
        />

        <Modal
          title={null}
          centered
          // closable={false}
          visible={this.state.visible}
          onCancel={this.passwordRecoveryClose}
          footer={null}
          // onOk={Router.push({pathname:"/hosting/listings"})}
          wrapClassName="border-modal-2"
        // onOk={Router.push({pathname:"/hosting/listings"})}
        >
          <div className="text-center">
            <h6 className="fc-black ff-heebo fw-600 lh-6x m-0">
              Welcome aboard! Thank you for joining us
            </h6>
          </div>
          <br />
          {/* <b>Welcome aboard! Thank you for joining us</b> */}
          <p>
            We have sent you an email. Please tap the link in the email to
            finish the sign-up process.{" "}
          </p>
          <p>
            If you haven’t received the email then please tap the resend email
            button below:
          </p>

          {/* <Form
            style={{ marginTop: "20px" }}
          >
            <Form.Item>
              {getFieldDecorator("send-email", {
                rules: [{ required: true, message: "Please input your mail!" }],
              })(
                <Input
                  size="large"
                  placeholder="Email"
                  value={this.state.userEmail}
                />
              )}
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="primary"
                className="mb-1"
                size="large"
                block
                onClick={() => {
                  this.setState({ visible: false });
                }}
              >
                <span
                  style={{ fontFamily: "Heebo", fontSize: 14, fontWeight: 600 }}
                >
                  Resend Email
                </span>
              </Button>
            </Form.Item>
          </Form> */}
          {/* <Input
            size="large"
            placeholder="Email"
            value={this.state.userEmail}
          /> */}
          {/* <Button
            size="large"
            type="primary"
            onClick={() => {
              this.setState({ visible: false });
            }}
          >
            Resent Email
          </Button> */}

          <Form onSubmit={this.handleResendEmail} style={{ marginTop: "20px" }}>
            <Form.Item>
              {getFieldDecorator("resend-email", {
                initialValue: this.state.userEmail,
                rules: [{ required: true, message: "Please input your mail!" }],
              })(<Input size="large" placeholder="Email" />)}
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              {/* <Button type="primary" htmlType="submit">
                Send password reset link
              </Button> */}
              <Button type="primary" className="mb-1" size="large" block onClick={this.handleResendEmail}>
                <b style={{ fontFamily: "Heebo", fontSize: 14, fontWeight: 600 }}>
                  Resend Email
                </b>
              </Button>
            </Form.Item>
          </Form>

          {/* <span style={{ fontFamily: 'Heebo', fontSize: 14, fontWeight: 600 }}>Resend Email</span> */}

        </Modal>

        {/* <Modal
          title={null}
          // closable={false}
          onCancel={this.forgotPasswordClose}
          visible={this.state.forgotPassword}
          footer={null}
          // onOk={Router.push({pathname:"/hosting/listings"})}
        > */}
        <Modal
          title={
            <div className="row">
              <Button
                className="border-0"
                icon="left"
                style={{ marginTop: -10, marginLeft: 10 }}
                onClick={this.handleForgotPasswordBack}
              >
                Back
              </Button>
            </div>
          }
          centered
          // wrapClassName="modal-login"
          visible={this.state.forgotPassword}
          // onOk={this.handleOk}
          onCancel={this.forgotPasswordClose}
          //closeIcon={<Icon type="left" />}
          footer={null}
          wrapClassName="border-modal-2"
          bodyStyle={{ paddingTop: "0px" }}
        // width={800}
        >
          <div className="text-center">
            <h2 className="fc-primary ff-heebo fw-600 lh-6x m-0 title-2x">
              Password Recovery
            </h2>
          </div>
          <Form onSubmit={this.handleResetEmail} style={{ marginTop: "20px" }}>
            <Form.Item>
              <h6>
                Please enter the email address connected to your account and we
                will send a link to reset your password.
              </h6>
              {getFieldDecorator("send-email", {
                rules: [{ required: true, message: "Please input your mail!" }],
              })(<Input size="large" placeholder="Email" />)}
            </Form.Item>
            <Form.Item style={{ textAlign: "center" }}>
              {/* <Button type="primary" htmlType="submit">
                Send password reset link
              </Button> */}
              <Button
                type="primary"
                className="mb-1"
                size="large"
                block
                onClick={this.handleResetEmail}
              >
                <b className={s["forgot-password-button-text"]}>
                  {" "}
                  Send password reset link
                </b>
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Fragment >
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(Form.create()(LoginForm));
