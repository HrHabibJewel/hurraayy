import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Input, Select, Button, Icon, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

const { Option } = Select;

class VerifyPhone extends React.Component {
  state = {
    countryId: "",
    phoneNumber: "",
    countries: [],
    phoneNumberVerify: false,
    phoneNumberVisible: false,
    loading: true
  };

  getCountries() {
    let _this = this;
    $axios.get("countries").then(function (resp) {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let dataPush = [];
        if (dataList.length > 0) {
          for (let key in dataList) {
            dataPush.push({
              id: dataList[key]["id"] + "_" + dataList[key]["phoneCode"],
              name: dataList[key]["name"],
              phoneCode: dataList[key]["phoneCode"],
            });
          }
        }
        _this.setState({
          countries: dataPush,
        });
      }
    });
  }

  componentDidMount() {
    this.getCountries();
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["phoneNumber"]) {
          this.setState({
            phoneNumber: resp["phoneNumber"],
          });
          if (resp['country'] && resp['country']['id']) {
            this.setState({
              countryId: resp['country']['id'] + "_" + resp['country']["phoneCode"],
            });
          }
        }
        if (resp["phoneNumberVerify"]) {
          this.setState({
            phoneNumberVerify: resp["phoneNumberVerify"],
          });
          if (resp['phoneNumberVisible']) {
            this.setState({
              phoneNumberVisible: resp["phoneNumberVisible"],
            });
          }
        }
        this.setState({ loading: false })
      }
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {};
        let _this = this;
        let property_id = this.props.formInfo["propertyId"];
        let url = "properties/" + property_id + "/phone-verify";
        params["phoneNumber"] = values["phoneNum"];
        params["phoneNumberVerify"] = _this.state.phoneNumberVerify ? true : false;
        params["phoneNumberVisible"] = values["verifyPhoneCode"] ? true : false;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("verify-phone", property_id));
            next({ page: 0, step: 2, data: resp });
            // Router.push({pathname:"/become-a-host/process-2"});
          }
        });
      }
    });
  };

  checkPhone = (phoneNum) => {
    if (phoneNum) {
      this.setState({
        phoneNumberVerify: true,
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { phoneNumber, countryId, countries, phoneNumberVerify, phoneNumberVisible, loading } = this.state;
    const form = this.props.form;
    let phoneCode = "";
    if (form.getFieldValue("countryId")) {
      let phoneCodeId = form.getFieldValue("countryId").split("_");
      phoneCode = phoneCodeId[1];
    }
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="verify-phone">
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <div>
                  <h2>Add your mobile number</h2>
                  {/* <p>
                    Qui magna labore sunt do sunt mollit ad veniam deserunt
                    tempor magna nisi ea. Sit voluptate laborum proident et
                    mollit deserunt duis aliqua ipsum nisi.
                  </p> */}
                </div>
                <Form.Item>
                  {getFieldDecorator("countryId", {
                    initialValue: countryId,
                    rules: [
                      {
                        required: true,
                        message: "Please select your country!",
                      },
                    ],
                  })(
                    <Select>
                      <Option value="">Please select your country!</Option>
                      {countries.length > 0 &&
                        countries.map((item, key) => {
                          return (
                            <Option key={key} value={item.id}>
                              {item.name + "(+" + item.phoneCode + ")"}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </Form.Item>
                {form.getFieldValue("countryId") ? (
                  <Form.Item>
                    {getFieldDecorator("phoneNum", {
                      initialValue: phoneNumber,
                      rules: [
                        {
                          required: true,
                          message: "Please enter your phone number!",
                        },
                      ],
                    })(
                      <Input
                      // prefix={"+" + phoneCode}
                      // suffix={
                      //   <a
                      //     onClick={() =>
                      //       this.checkPhone(form.getFieldValue("phoneNum"))
                      //     }
                      //   >
                      //     Verify
                      //   </a>
                      // }
                      />
                    )}
                  </Form.Item>
                ) : null}
                {phoneNumberVerify ? (
                  <Form.Item>
                    {getFieldDecorator("phoneNumberVisible", {
                      initialValue: phoneNumberVisible ? "" : "",
                      rules: [
                        {
                          required: true,
                          message: "Please enter verify phone code!",
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() => {
                      this.props.continue({ page: 3, step: 2 });
                    }}
                  >
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

const WrappedApp = Form.create({ name: "coordinated" })(VerifyPhone);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
