import React from "react";
import { connect } from "react-redux";
import TextChange from "../../components/ui/form/textChange";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { Row, Col, Form, Button, Radio, Icon, Spin } from "antd";
import { getAdvFormEditData } from "../../lib/utils/utility";

class guestStay extends React.Component {
  state = {
    min: 1,
    max: 2,
    isApproveRequest: false,

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
    manuallyReviewAndApproveRequests: true,
    id: 0,
    loading: true
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp && resp["propertyAvailabilitySetting"]) {
        let data = resp["propertyAvailabilitySetting"];
        if (data["maxStayNight"]) {
          this.setState({ max: parseInt(data["maxStayNight"]) });
        }
        if (this.state.max != 2) {
          this.setState({ isApproveRequest: true });
        }
        if (data["minStayNight"]) {
          this.setState({ min: parseInt(data["minStayNight"]) });
        }
        this.setState({
          manuallyReviewAndApproveRequests:
            data["manuallyReviewAndApproveRequests"],
        });

        if (data["howFarAdvanceGuestCanBook"]) {
          this.setState({
            howFarAdvanceGuestCanBook: data["howFarAdvanceGuestCanBook"],
          });
        }
        this.setState({
          noticeBeforeGuestArrive: data["noticeBeforeGuestArrive"],
        });
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
        this.setState({ loading: false })
      }
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/availability-settings";
        const {
          noticeBeforeGuestArrive,
          checkInFrom,
          checkInTo,
          timeGuestCanBook,
          id,
          howFarAdvanceGuestCanBook,
          checkOutFrom,
          checkOutTo
        } = this.state;
        let params = {};
        params["manuallyReviewAndApproveRequests"] =
          values["manuallyReviewAndApproveRequests"] != undefined
            ? values["manuallyReviewAndApproveRequests"]
            : false;
        params["maxStayNight"] = this.state.max;
        params["minStayNight"] = this.state.min;
        params["id"] = this.state.id;

        params["noticeBeforeGuestArrive"] = noticeBeforeGuestArrive;
        params["checkInFrom"] = checkInFrom;
        params["checkInTo"] = checkInTo;
        params["checkOutFrom"] = checkOutFrom;
        params["checkOutTo"] = checkOutTo;
        params["timeGuestCanBook"] = timeGuestCanBook;
        params["howFarAdvanceGuestCanBook"] = howFarAdvanceGuestCanBook;
        params["id"] = id;

        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("guest-stay", property_id));
            next({ page: 9, step: 3, data: resp });
            //Router.push({ pathname: "/become-a-host/calendar" });
          }
        });
      }
    });
  };
  setStateFunc = (val, name) => {
    if (name == "max") {
      this.setState({ isApproveRequest: true });
    }
    this.setState({
      [name]: val,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const { loading, min, max } = this.state;
    let maxNightName = (max == 1 || max == 0) ? "night" : "nights";
    let nightMinName = (min == 1 || min == 0) ? " night min" : " nights min";
    let nightMaxName = " " + maxNightName + " max";
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>Please tell us for how long your guests can stay in your place?</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <div className="mt-4 mb-2">
                  <Form.Item>
                    {getFieldDecorator("minStayNight", {
                      initialValue: min,
                      rules: [
                        {
                          required: false,
                        },
                      ],
                    })(
                      <TextChange
                        textName="min"
                        val={min}
                        valText={nightMinName}
                        textChange={this.setStateFunc}
                      />
                    )}
                  </Form.Item>
                </div>
              </Col>
              {/* <Col span={24}>
                <div className="mt-4 mb-2">
                  <Form.Item>
                    {getFieldDecorator("maxStayNight", {
                      initialValue: max,
                      rules: [
                        {
                          required: false,
                        },
                      ],
                    })(
                      <TextChange
                        textName="max"
                        val={max}
                        valText={nightMaxName}
                        textChange={this.setStateFunc}
                      />
                    )}
                  </Form.Item>
                </div>
              </Col> */}
              {this.state.isApproveRequest && (
                <Col span={24}>
                  <p>For stays longer than {max} {maxNightName}</p>
                  <Form.Item>
                    {getFieldDecorator("manuallyReviewAndApproveRequests", {
                      initialValue: this.state.manuallyReviewAndApproveRequests,
                      rules: [
                        {
                          required: false,
                        },
                      ],
                    })(
                      <Radio.Group>
                        <Radio style={radioStyle} value={true}>
                          Manually review and approve reservation requests{" "}
                          <b>RECOMMENDED</b>
                        </Radio>
                        <Radio style={radioStyle} value={false}>
                          Don't allow reservation requests for stays longer than{" "}
                          {max} {maxNightName}
                        </Radio>
                      </Radio.Group>
                    )}
                  </Form.Item>
                </Col>
              )}
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
                      this.props.continue({ page: 7, step: 3 })
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

const WrappedApp = Form.create({ name: "coordinated" })(guestStay);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
