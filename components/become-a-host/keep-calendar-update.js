import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Checkbox, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

class KeepCalendarUpdate extends React.Component {
  state = {
    keepCalenderUpToDate: false,
    loading: true
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["keepCalenderUpToDate"]) {
          this.setState({
            keepCalenderUpToDate: resp["keepCalenderUpToDate"],
          });
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
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/keep-calendar-up-to-date";
        let params = {};

        params["keepCalenderUpToDate"] = values["keepCalenderUpToDate"];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(
              adventrueForm("keep-calendar-update", property_id)
            );
            //Router.push({pathname:"/become-a-host/availability-questions"});
            next({ page: 5, step: 3, data: resp });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="keep-calendar-update">
          <div>
            <h2>An accurate calendar helps you to get frequent guests</h2>
            <p>
              If you keep the calendar up-to-date then you will get more bookings and guests will be able to  book available days instantly.
            </p>
            <p>
              If you cancel any booking made by the guests due to your inaccurate calendar then it creates chaos, you may receive negative review and overall it creates bad impression.
            </p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator("keepCalenderUpToDate", {
                    initialValue: this.state.keepCalenderUpToDate,
                    valuePropName: "checked",
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Checkbox>
                      I will take care of the calendar
                    </Checkbox>
                  )}
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
                    onClick={() =>
                      this.props.continue({ page: 2, step: 3 })
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

const WrappedApp = Form.create({ name: "coordinated" })(KeepCalendarUpdate);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
