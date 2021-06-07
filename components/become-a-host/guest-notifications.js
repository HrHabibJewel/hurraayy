import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Select, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";
const { Option } = Select;

class AvailabilityQuestions extends React.Component {
  state = {
    booksBefore: [],
    inFroms: [],
    toFroms: [],
    isCanBook: true,
    noticeBeforeGuestArrive: "0",
    timeGuestCanBook: "",
    checkInFrom: "",
    checkInTo: "",
    checkOutFrom: "",
    checkOutTo: "",
    id: 0,
    loading: true
  };
  componentDidMount() {
    this.getEditData();
    let booksBefore = this.getBooksBefore();
    let inFroms = this.getInFrom();
    let toFroms = this.getToFrom();
    this.setState({ booksBefore: booksBefore });
    this.setState({ inFroms: inFroms });
    this.setState({ toFroms: toFroms });
  }

  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["propertyAvailabilitySetting"]) {
          let data = resp["propertyAvailabilitySetting"];
          this.setState({
            noticeBeforeGuestArrive: data["noticeBeforeGuestArrive"],
          });
          if (data["noticeBeforeGuestArrive"] == 0) {
            this.setState({ isCanBook: true });
          } else {
            this.setState({ isCanBook: false });
          }
          this.setState({
            timeGuestCanBook: data["timeGuestCanBook"],
          });
          this.setState({
            checkInFrom: data["checkInFrom"],
          });
          this.setState({
            checkInTo: data["checkInTo"],
          });
          this.setState({
            checkOutFrom: data["checkOutFrom"],
          });
          this.setState({
            checkOutTo: data["checkOutTo"],
          });
          this.setState({
            id: data["id"],
          });
        }
        this.setState({ loading: false })
      }
    });
  }
  getBooksBefore() {
    let am = this.getHours(6, 12, "AM");
    let pm = this.getHours(1, 12, "PM");
    let ampm = am.concat(pm);
    return ampm;
  }
  getInFrom() {
    let am = this.getHours(8, 11, "AM");
    let pm = this.getHours(1, 11, "PM");
    let first = ["Flexible"];
    let firstam = first.concat(am);
    let twelvePm = ["12:00 PM"];
    let amTwelvePm = firstam.concat(twelvePm);
    let ampm = amTwelvePm.concat(pm);
    let last = ["12:00 AM", "1:00 AM (next day)", "1:00 AM (next day)"];
    let lastam = ampm.concat(last);
    return lastam;
  }
  getToFrom() {
    let am = this.getHours(8, 11, "AM");
    let pm = this.getHours(1, 11, "PM");
    let first = ["Flexible"];
    let firstam = first.concat(am);
    let twelvePm = ["12:00 PM"];
    let amTwelvePm = firstam.concat(twelvePm);
    let ampm = amTwelvePm.concat(pm);
    let last = ["12:00 AM", "1:00 AM (next day)", "1:00 AM (next day)"];
    let lastam = ampm.concat(last);
    return lastam;
  }


  getHours(hfrom, hto, hourType) {
    let arr = [];
    for (let i = hfrom; i <= hto; i++) {
      let hour = i + ":00 " + hourType;
      arr[i] = hour;
    }
    return arr;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/availability-settings";
        let params = {};

        params["noticeBeforeGuestArrive"] = values["noticeBeforeGuestArrive"];
        params["checkInFrom"] = values["checkInFrom"];
        params["checkInTo"] = values["checkInTo"];
        params["checkOutFrom"] = values["checkOutFrom"];
        params["checkOutTo"] = values["checkOutTo"];
        params["timeGuestCanBook"] = values["noticeBeforeGuestArrive"] == 0
          ? values["timeGuestCanBook"]
          : "";
        params["howFarAdvanceGuestCanBook"] = "";
        params["manuallyReviewAndApproveRequests"] = "";
        params["maxStayNight"] = "";
        params["minStayNight"] = "";
        if (this.state.id) {
          params["id"] = this.state.id;
        }

        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            //  params["id"] = resp.id;
            _this.props.dispatch(
              adventrueForm("guest-notifications", property_id)
            );
            next({ page: 7, step: 3, data: resp });
          }
        });
      }
    });
  };

  onChangeGuestArrive = (val) => {
    if (val == "0") {
      this.setState({ isCanBook: true });
    } else {
      this.setState({ isCanBook: false });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    let booksBefore = this.state.booksBefore;
    let inFroms = this.state.inFroms;
    let toFroms = this.state.toFroms;
    const {
      noticeBeforeGuestArrive,
      timeGuestCanBook,
      checkInFrom,
      checkInTo,
      checkOutFrom,
      checkOutTo,
      loading
    } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>How much time you need to prepare before a guest arrive?</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator("noticeBeforeGuestArrive", {
                    initialValue: noticeBeforeGuestArrive,
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select one"
                      optionFilterProp="children"
                      onChange={this.onChangeGuestArrive}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="0">Same day</Option>
                      <Option value="1">1 day</Option>
                      <Option value="2">2 days</Option>
                      <Option value="3">3 days</Option>
                      <Option value="4">4 days</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              {this.state.isCanBook && (
                <Col span={24}>
                  <h3>Guests can book before:</h3>
                  <Form.Item>
                    {getFieldDecorator("timeGuestCanBook", {
                      initialValue: timeGuestCanBook,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Select one"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {booksBefore.length > 0 &&
                          booksBefore.map((item, key, index) => {
                            return (
                              <Option key={index} value={item}>
                                {item}
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
              <Col span={24}>
                <p>
                  <span className="text-primary">Tip:</span> Recommended: It's better to accept booking same day to increase the chances of getting more bookings. However if you have time in hand then you can better prepare yourself.
                </p>
              </Col>
              <Col span={24}>
                <h3>Let's set the guest check in time</h3>
                <Row>
                  <Col span={12}>
                    <p>From</p>
                    <Form.Item>
                      {getFieldDecorator("checkInFrom", {
                        initialValue: checkInFrom,
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Select
                          className="mb-4"
                          style={{ width: "90%" }}
                          placeholder="Select one"
                        >
                          {inFroms.length > 0 &&
                            inFroms.map((item, key, index) => {
                              return (
                                <Option key={index} value={item}>
                                  {item}
                                </Option>
                              );
                            })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <p>To</p>
                    <Form.Item>
                      {getFieldDecorator("checkInTo", {
                        initialValue: checkInTo,
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Select
                          className="mb-4"
                          style={{ width: "90%" }}
                          placeholder="Select a time"
                        >
                          {toFroms.length > 0 &&
                            toFroms.map((item, key, index) => {
                              return (
                                <Option key={index} value={item}>
                                  {item}
                                </Option>
                              );
                            })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <h3>Let's set the guest check out time</h3>
                <Row>
                  <Col span={12}>
                    <p>From</p>
                    <Form.Item>
                      {getFieldDecorator("checkOutFrom", {
                        initialValue: checkOutFrom,
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Select
                          className="mb-4"
                          style={{ width: "90%" }}
                          placeholder="Select one"
                        >
                          {inFroms.length > 0 &&
                            inFroms.map((item, key) => {
                              return (
                                <Option key={key} value={item}>
                                  {item}
                                </Option>
                              );
                            })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <p>To</p>
                    <Form.Item>
                      {getFieldDecorator("checkOutTo", {
                        initialValue: checkOutTo,
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Select
                          className="mb-4"
                          style={{ width: "90%" }}
                          placeholder="Select a time"
                        >
                          {toFroms.length > 0 &&
                            toFroms.map((item, key) => {
                              return (
                                <Option key={key} value={item}>
                                  {item}
                                </Option>
                              );
                            })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() =>
                      this.props.continue({ page: 5, step: 3 })
                    }
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

const WrappedApp = Form.create({ name: "coordinated" })(AvailabilityQuestions);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
