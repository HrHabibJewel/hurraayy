import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Listing from "../../layouts/Listing";
import { Row, Col, Form, Button, Icon, Checkbox, Radio } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";

//

class AddCalendar extends React.Component {
  state = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Router.push("/become-a-host/import-calendar");
        //console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Listing step={3} page={5}>
        <div className="process">
          <div>
            <h2>
              Do you want to connect another calendar with your Hurraayy
              calendar?
            </h2>
            <p>
              Qui magna labore sunt do sunt mollit ad veniam deserunt tempor
              magna nisi ea. Sit voluptate laborum proident et mollit deserunt
              duis aliqua ipsum nisi.
            </p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Radio.Group defaultValue={1}>
                  <p>
                    <Radio value={1}>No</Radio>
                  </p>
                  <p>
                    <Radio value={2}>Yes, connect another calendar</Radio>
                  </p>
                </Radio.Group>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() =>
                      Router.push("/become-a-host/keep-calendar-update")
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
      </Listing>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(AddCalendar);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
