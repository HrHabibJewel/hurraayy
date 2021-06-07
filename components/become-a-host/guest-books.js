import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Listing from "../../layouts/Listing";
import { Row, Col, Form, Button, Icon, Select, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";
const { Option } = Select;

class GuestBooks extends React.Component {
  state = {
    id:0,
    noticeBeforeGuestArrive:"",
    checkInFrom:"",
    checkInTo:"",
    checkOutFrom:"",
    checkOutTo:"",
    timeGuestCanBook:"",
    howFarAdvanceGuestCanBook:"-1",
    manuallyReviewAndApproveRequests:true,
    maxStayNight:"",
    minStayNight:"",
    loading:true
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp && resp["propertyAvailabilitySetting"]) {
        let data = resp["propertyAvailabilitySetting"];
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
      }
      this.setState({ loading: false })
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
        let params = {};
        const {
          noticeBeforeGuestArrive, 
          checkInFrom, 
          checkInTo, 
          timeGuestCanBook, 
          checkOutFrom,
          checkOutTo,
          id
        } = this.state;
        params["noticeBeforeGuestArrive"] = noticeBeforeGuestArrive;
        params["checkInFrom"] = checkInFrom;
        params["checkInTo"] = checkInTo;
        params["checkOutFrom"] = checkOutFrom;
        params["checkOutTo"] = checkOutTo;
        params["timeGuestCanBook"] = timeGuestCanBook;
        params["howFarAdvanceGuestCanBook"] = values["howFarAdvanceGuestCanBook"];
        params["manuallyReviewAndApproveRequests"] = "";
        params["maxStayNight"] = "";
        params["minStayNight"] = "";
        params["id"] = id;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("guest-books", property_id));
            next({ page: 8, step: 3, data: resp });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { howFarAdvanceGuestCanBook, loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>How far in advance you will allow booking?</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator("howFarAdvanceGuestCanBook", {
                    initialValue: howFarAdvanceGuestCanBook,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Select
                      className="mb-4"
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
                      <Option value="-1">Any time</Option>
                      <Option value="90">3 months in advance</Option>
                      <Option value="180">6 months in advance</Option>
                      <Option value="270">9 months in advance</Option>
                      <Option value="365">1 year</Option>
                      <Option value="0">Dates unavailable by default</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p>
                  <span className="text-primary">Recommended:</span>You may allow to book 6 months in advance.
                </p>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() =>
                      this.props.continue({ page: 6, step: 3 })
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

const WrappedApp = Form.create({ name: "coordinated" })(GuestBooks);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
