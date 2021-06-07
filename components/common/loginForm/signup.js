import {
  Form,
  Input,
  DatePicker,
  Checkbox,
  Button,
  Divider,
  Modal,
} from "antd";
import { $openAxios } from "../../../lib/http-service";
import FacebookLogin from "react-facebook-login";


class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    error: "",
    agree: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ error: "" });
        //console.log("Received values of form: ", values);
        let params = {};
        let _this = this;
        params["dateOfBirth"] = values["dateOfBirth"].format("YYYY-MM-DD");
        params["usr"] = values["usr"];
        params["firstName"] = values["firstName"];
        params["lastName"] = values["lastName"];
        params["pwd"] = values["password"];

        $openAxios
          .post("registration", JSON.stringify(params))
          .then(function (resp) {
            if (resp && resp.status == 201) {
              _this.props.onSignupClose(resp.data);
            }
          })
          .catch((error) => {
            let resp = error.response;
            if (resp && resp.status == 422) {
              //  this.setState({error:resp.data.error_description})
              this.setState({ error: "This account already exists" });
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
  onCheckChange = (e) => {
    if (e.target.checked) {
      // setAgree(true)
      this.setState({
        agree: true,
      });
    } else {
      // setAgree(false)
      this.setState({
        agree: false,
      });
    }

    // console.log("agree",agree);
  };
  responseFacebook = (response) => {
    //console.log("fb response",response);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // console.log("state==", this.state)

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Modal
        title="&nbsp;"
        // wrapClassName="modal-login"
        visible={this.props.visible}
        // onOk={this.handleOk}
        onCancel={this.props.onSignupClose}
        // closeIcon={<Icon type="left" />}
        footer={null}
        wrapClassName="border-modal"
      >
        <div className="login">
          <div className="text-center" style={{marginTop:-30, marginBottom:20}}>
            {/* <p className="text-danger small">{this.state.error}</p> */}
            <h2 className="fc-primary ff-heebo fw-600 lh-6x m-0 title-2x">
              Join Hurraayy
            </h2>
            {/* <p className="lh-4x sub-1x">
              Find your best accommodation & adventure with Hurraayy
            </p> */}
          </div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("usr", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ],
              })(<Input size="large" placeholder="Email" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("firstName", {
                rules: [
                  {
                    required: true,
                    message: "Please input your first name!",
                    whitespace: true,
                  },
                ],
              })(<Input size="large" placeholder="First name" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("lastName", {
                rules: [
                  {
                    required: true,
                    message: "Please input your last name!",
                    whitespace: true,
                  },
                ],
              })(<Input size="large" placeholder="Last name" />)}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("dateOfBirth", {
                rules: [
                  {
                    type: "object",
                    required: true,
                    message: "Please select date of birth!",
                  },
                ],
              })(
                <DatePicker
                  size="large"
                  placeholder="Date of Birth"
                  style={{ width: "100%" }}
                />
              )}
            </Form.Item>
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
              })(<Input.Password size="large" placeholder="Password" />)}
            </Form.Item>
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
            <Form.Item>
              {getFieldDecorator("agreement", {
                valuePropName: "checked",
              })(
                <Checkbox onChange={this.onCheckChange}>
                  I have read the <a href="/terms" style={{color:'#ff6204'}}>Terms & Conditions</a>
                </Checkbox>
              )}
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                block
                disabled={this.state.agree ? false : true}
              >
                <span style={{fontFamily:'Heebo', fontSize:14, fontWeight:600}}>Sign up</span>
              </Button>
              {this.state.error != "" ? <p className="text-danger small">{this.state.error}</p> : ""}
            </Form.Item>
            <Form.Item>
              {/* {getFieldDecorator("agreement", {
                valuePropName: "checked",
              })(
                <Checkbox>
                  I have read the <a href="">agreement</a>
                </Checkbox>
              )} */}
              {/* <Divider>Or signup with</Divider>
              <div className="text-center">
                <Button className="icn icn-google" size="large">
                  Google
                </Button> */}
                {/* <FacebookLogin
                  appId="538568613799419"
                  autoLoad={false}
                  fields="name,email,picture"
                  // onClick={componentClicked}
                  callback={this.responseFacebook}
                  cssClass="my-facebook-button-class"
                  icon="fa-facebook"
                  scope="public_profile,user_friends,user_actions.books"
                /> */}
                {/* <Button className="icn icn-facebook" size="large">
                  Facebook
                </Button>
              </div> */}
              <div className="login-signup text-center">
                Already have an account?&nbsp;
                <a
                  href="#"
                  onClick={() => {
                    this.props.showLogin();
                    this.props.onSignupClose();
                  }}
                  style={{color:'#ff6204'}}
                >
                  Login
                </a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default Form.create()(RegistrationForm);
