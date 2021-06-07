import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Select, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

const { Option } = Select;

class AvailabilityQuestions extends React.Component {
  state = {
    availability_a2: ["Not sure yet", "As often as possible", "Part-time"],
    availability_a1: ["I’m new to this", "I have"],
    answerId1: "",
    answerId2: "",
    loading: true
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["questionAnswer"]) {
          let questionAnswer = JSON.parse(resp["questionAnswer"]);
          if (questionAnswer[0] && questionAnswer[0]["q1"]) {
            this.setState({
              answerId1: questionAnswer[0]["q1"],
            });
          }
          if (questionAnswer[0] && questionAnswer[0]["q2"]) {
            this.setState({
              answerId2: questionAnswer[0]["q2"],
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
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/availability-questions";
        let params = {};

        params["questionAnswer"] = JSON.stringify([
          {
            q1: values["answerId1"],
            q2: values["answerId2"],
          },
        ]);
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(
              adventrueForm("availability-questions", property_id)
            );
            //Router.push("/become-a-host/guest-notifications");
            next({ page: 6, step: 3, data: resp });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { availability_a1, availability_a2, loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>Please answer these</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <p>Have you rented your property in any other platform before?</p>
                <Form.Item>
                  {getFieldDecorator("answerId1", {
                    initialValue: this.state.answerId1,
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
                      <Option value="" disabled>
                        Select one
                      </Option>
                      {availability_a1.length > 0 &&
                        availability_a1.map((item, key) => {
                          return (
                            <Option key={key} value={key}>
                              {item}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p> How often do you want to host?</p>
                <Form.Item>
                  {getFieldDecorator("answerId2", {
                    initialValue: this.state.answerId2,
                    rules: [
                      {
                        required: false,
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
                      <Option value="" disabled>
                        Select one
                      </Option>
                      {availability_a2.length > 0 &&
                        availability_a2.map((item, key) => {
                          return (
                            <Option key={key} value={key}>
                              {item}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </Form.Item>
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
                      this.props.continue({ page: 4, step: 3 })
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
