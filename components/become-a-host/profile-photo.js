import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Listing from "../../layouts/Listing";
import { Row, Col, Form, Button, Icon, Avatar, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

// import "./style.css";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";

class ProfilePhoto extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    let property_id = this.props.formInfo["propertyId"];
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(adventrueForm("profile-photo", property_id));
        Router.push("/become-a-host/verify-phone");
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Listing step={2} page={4}>
        <div className="profile-photo">
          <Form onSubmit={this.handleSubmit}>
            <h2>Add your photo</h2>
            <Row gutter={24}>
              <Col span={12}>
                <Avatar size={100} icon={<UserOutlined />} />
              </Col>
              <Col span={12}>
                <Upload>
                  <Button>
                    <UploadOutlined /> Click to Upload
                  </Button>
                </Upload>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <a
                    onClick={() => Router.push("/become-a-host/describe-place")}
                  >
                    <Icon type="left" />
                    &nbsp;Back
                  </a>
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

const WrappedApp = Form.create({ name: "coordinated" })(ProfilePhoto);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
