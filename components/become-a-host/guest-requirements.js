import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Checkbox, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

class GuestRequirements extends React.Component {
  state = {
    isAdditionalRequirements: false,
    recommendByOtherWithNonNegativeReviewRequire: false,
    govtIssueIdCardRequire: false,
    loading: true
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["govtIssueIdCardRequire"]) {
          this.setState({
            govtIssueIdCardRequire: resp["govtIssueIdCardRequire"],
          });
        }

        if (resp["recommendByOtherWithNonNegativeReviewRequire"]) {
          this.setState({
            recommendByOtherWithNonNegativeReviewRequire: resp["recommendByOtherWithNonNegativeReviewRequire"],
          });
        }
        if (resp["govtIssueIdCardRequire"] || resp["recommendByOtherWithNonNegativeReviewRequire"]) {
          this.setState({
            isAdditionalRequirements: true,
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
        // console.log("Received values of form: ", values);return;
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/guest-requirements";
        let params = {};

        params["govtIssueIdCardRequire"] = values["govtIssueIdCardRequire"]
          ? true
          : false;
        params["recommendByOtherWithNonNegativeReviewRequire"] = values[
          "recommendByOtherWithNonNegativeReviewRequire"
        ]
          ? true
          : false;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(
              adventrueForm("guest-requirements", property_id)
            );
            //Router.push({pathname:"/become-a-host/house-rules"});
            next({ page: 2, step: 3, data: resp });
          }
        });
      }
    });
  };

  isShowAdditionalRequirements = () => {
    this.setState({
      isAdditionalRequirements: true,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { recommendByOtherWithNonNegativeReviewRequire, govtIssueIdCardRequire, loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>What hurraayy requires from every guests</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <p>To make everyone's life easier and safer all guests will provide:</p>
                <ul>
                  <li>
                    <Icon type="check" /> Email address
                  </li>
                  <li>
                    <Icon type="check" /> Confirmed phone number
                  </li>
                  <li>
                    <Icon type="check" /> Payment information
                  </li>
                  <li>
                    <Icon type="check" /> Government issues ID (such as national ID, passport, driving licence)
                  </li>
                </ul>
              </Col>
              <Col span={24}>
                <p>During booking each guest will have to:</p>
                <ul className="fa-ul">
                  <li>
                    <Icon type="check" /> Agree to your House Rules
                  </li>
                  {/* <li>
                    <Icon type="check" /> Message you about their trip
                  </li> */}
                  <li>
                    <Icon type="check" /> Must select the number of guests
                  </li>
                  {/* <li>
                    <Icon type="check" />
                    Confirm their check-in time if they’re arriving within 2
                    days
                  </li> */}
                </ul>
              </Col>
              {/* <Col span={24}>
                <a onClick={() => this.isShowAdditionalRequirements()}>
                  Add additional requirements
                </a>
              </Col> */}
              {this.state.isAdditionalRequirements ? (
                <Col span={24}>
                  <ul className="fa-ul">
                    <li>
                      {getFieldDecorator("govtIssueIdCardRequire", {
                        initialValue: govtIssueIdCardRequire,
                        valuePropName: "checked",
                        rules: [
                          {
                            required: false,
                          },
                        ],
                      })(
                        <Checkbox>
                          Government issues ID to Hurrayy
                        </Checkbox>
                      )}
                    </li>
                    {/* <li>
                      {getFieldDecorator(
                        "recommendByOtherWithNonNegativeReviewRequire",
                        {
                          initialValue: recommendByOtherWithNonNegativeReviewRequire,
                          valuePropName:"checked",
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        }
                      )(
                        <Checkbox>
                          Recommended by other hosts and have no negative
                          reviews
                        </Checkbox>
                      )}
                    </li> */}
                    <li>&nbsp;</li>
                    <li>Too many requirements can lead to fewer bookings!</li>
                  </ul>
                </Col>
              ) : (
                  ""
                )}
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
                      this.props.continue({ page: 0, step: 2 });
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

const WrappedApp = Form.create({ name: "coordinated" })(GuestRequirements);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
