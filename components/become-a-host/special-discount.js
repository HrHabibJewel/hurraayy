import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Listing from "../../layouts/Listing";
import { Row, Col, Form, Button, Icon, Checkbox, Radio } from "antd";

// import "./style.css";

class Page extends React.Component {
  state = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Router.push("/become-a-host/length-of-stay");
        //console.log("Received values of form: ", values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const list1 = [
      {
        title: "Ant Design Title 1",
      },
      {
        title: "Ant Design Title 2",
      },
      {
        title: "Ant Design Title 3",
      },
      {
        title: "Ant Design Title 4",
      },
    ];
    return (
      <Listing step={3} page={1}>
        <div className="process">
          <div>
            <h2>Something special for your first guests</h2>
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Radio value={1}></Radio>
                    <div style={{ paddingLeft: "40px" }}>
                      <p className="sub-title">
                        Offer 20% off to your first guests{" "}
                        <span className="mark mark-gray">recomended</span>
                      </p>
                      <p>
                        The first 3 guests who book your place will get 20% off
                        their stay. This special offer can attract new guests,
                        and help you get the 3 reviews you need for a star
                        rating.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Radio value={2}></Radio>
                    <div style={{ paddingLeft: "40px" }}>
                      <p className="sub-title">Don’t add a special offer</p>
                      <p>
                        Once you publish your listing, you won’t be able to add
                        this offer.
                      </p>
                    </div>
                  </div>
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
                    onClick={() => Router.push("/become-a-host/process-2")}
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

const WrappedApp = Form.create({ name: "coordinated" })(Page);

export default connect()(WrappedApp);
