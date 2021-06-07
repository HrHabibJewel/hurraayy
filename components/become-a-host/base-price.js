import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Listing from "../../layouts/Listing";
import { Row, Col, Form, Button, Icon, Checkbox, Radio, Input } from "antd";

// import "./style.css";

class Page extends React.Component {
  state = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Router.push("/become-a-host/special-discount");
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
            <h2>Price your space</h2>
            <p>
              <b>Increase your chances of getting booked</b>
            </p>
            <p>
              Qui magna labore sunt do sunt mollit ad veniam deserunt tempor
              magna nisi ea. Sit voluptate laborum proident et mollit deserunt
              duis aliqua ipsum nisi.
            </p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <h3>Set up the base price for each night</h3>
              </Col>
              <Col span={24}>
                <p>Base price</p>
                <p>
                  This will be your default price for days when you decide to
                  turn off smart pricing
                </p>
                <Input prefix="$" placeholder={15} />
              </Col>
              <Col span={24}>
                <p className="mt-5">Currency</p>

                <Input placeholder="Ex: https://calendar.google.com/calendar"></Input>
                <p
                  className="text-primary text-bold "
                  style={{ fontSize: 16, marginTop: 20 }}
                >
                  Set up smart pricing{" "}
                  <span className="mark mark-gray">recomended</span>
                </p>
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
