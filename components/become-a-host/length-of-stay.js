import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import {
  Row,
  Col,
  Form,
  Button,
  Icon,
  Input,
  Checkbox,
  Modal,
  Spin,
} from "antd";
import { adventrueForm, propertyDestroy } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

class LengthOfStay extends React.Component {
  state = {
    visible: false,
    weekendList: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    checked: [],
    weeklyPrice: "",
    weekends: [],
    monthlyPrice: [],
    loading: true,
    userName:''
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["weeklyPrice"]) {
          this.setState({
            weeklyPrice: resp["weeklyPrice"],
          });
        }
        if (resp["monthlyPrice"]) {
          this.setState({
            monthlyPrice: resp["monthlyPrice"],
          });
        }
        if (resp["weekends"]) {
          let weekends = resp["weekends"].split(",");
          this.setState({
            weekends: weekends,
          });
        }
        if (resp["user"]) {
          let fullName = resp['user']['firstName'] + " "+ resp['user']['lastName'];
          this.setState({
            userName: fullName,
          });
        }
        this.setState({ loading: false });
      }
    });
  }
  success() {
    // Modal.success({
    //   title:'Hi Jane, thank you for listing the property on Hurraayy.',
    //   content: 'As part of our policy the property will go through the approval process and you will be able to check the status of your listing(s) from your host panel. Property approval normally takes no more than 72 hours.',
    //   onOk() {
    //     Router.push({pathname:"/hosting/listings"});
    //   },
    // });
    // </div>
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {};
        let _this = this;
        let property_id = this.props.formInfo["propertyId"];
        let url = "properties/" + property_id + "/additional-pricing";
        params["weeklyPrice"] = values["weeklyPrice"];
        params["weekends"] = values["weekends"].toString();
        params["monthlyPrice"] = values["monthlyPrice"];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("length-of-stay", property_id));
            // Router.push({pathname:"/hosting/listings"});
            _this.setState({ visible: true });
            //_this.success();
          }
        });
      }
    });
  };

  onChange = (val) => {
    this.setState(() => {
      return { checked: val };
    });
  };

  goToHostPanel = () => {
    this.props.dispatch(propertyDestroy());
    Router.push({pathname:"/hosting/listings"});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      userName,
      weekendList,
      weekends,
      monthlyPrice,
      weeklyPrice,
      loading,
    } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>Length-of-stay prices</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <p className="sub-title">Weekly discount</p>
                <Form.Item>
                  {getFieldDecorator("weeklyPrice", {
                    initialValue: weeklyPrice,
                    rules: [
                      {
                        required: true,
                        message: "Please enter weekly!",
                      },
                    ],
                  })(<Input placeholder="5% off" autoComplete="off" />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p className="sub-title">Weekends</p>
                <Form.Item>
                  {getFieldDecorator("weekends", {
                    initialValue: weekends,
                    rules: [
                      {
                        required: true,
                        message: "Please select weekends!",
                      },
                    ],
                  })(
                    <Checkbox.Group
                      style={{ width: "100%" }}
                      onChange={this.onChange}
                    >
                      <Row>
                        {weekendList.length > 0 &&
                          weekendList.map((item, key) => {
                            return (
                              <Col span={8} key={key}>
                                <Checkbox value={item}>{item}</Checkbox>
                              </Col>
                            );
                          })}
                      </Row>
                    </Checkbox.Group>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p className="sub-title">Monthly discount</p>
                <Form.Item>
                  {getFieldDecorator("monthlyPrice", {
                    initialValue: monthlyPrice,
                    rules: [
                      {
                        required: true,
                        message: "Please enter monthly!",
                      },
                    ],
                  })(<Input placeholder="5% off" autoComplete="off" />)}
                </Form.Item>
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
                    onClick={() => this.props.continue({ page: 10, step: 3 })}
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
                    Finish
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Modal
            title={null}
            closable={false}
            visible={this.state.visible}
            footer={null}
            // onOk={Router.push({pathname:"/hosting/listings"})}
          >
            <b>Hi {userName}, thank you for listing the property on Hurraayy.</b>
            <br />
            <br />
            <p>
              As part of our policy the property will go through the approval
              process and you will be able to check the status of your
              listing(s) from your host panel. Property approval normally takes
              no more than 72 hours.{" "}
            </p>
            <Button
              type="primary"
              style={{margin:'0 auto', display:'block',marginBottom: '20px'}}
              // onClick={() => {
              //   // Router.push({pathname:"/hosting/listings"})
              //   Router.push({ pathname: "/hosting/listings" });
              // }}
              onClick={() => this.goToHostPanel()}
            >
              Go to Home
            </Button>
            <p>
              If you have further question or if you need our assistance then
              please do not hesitate to contact us through our chat support.{" "}
            </p>
            <p>Thank you once again. </p>
          </Modal>
        </div>
      </Spin>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(LengthOfStay);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
