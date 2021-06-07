import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Input, Button, Icon, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

class NamePlace extends React.Component {
  state = {
    name: "",
    loading: true
  }
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["name"]) {
          this.setState({
            name: resp["name"],
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
        let params = {};
        let _this = this;
        let property_id = this.props.formInfo["propertyId"];
        let url = "properties/" + property_id + "/titles";
        params["name"] = values["name"];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("name-place", property_id));
            next({ page: 4, step: 2, data: resp });
            //Router.push({pathname:"/become-a-host/verify-phone"});
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
        <div className="process">
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <div>
                  <h2>Give the listing a title</h2>
                  {/* <p>
                    Qui magna labore sunt do sunt mollit ad veniam deserunt
                    tempor magna nisi ea. Sit voluptate laborum proident et
                    mollit deserunt duis aliqua ipsum nisi.
                  </p> */}
                </div>
                <Form.Item>
                  {getFieldDecorator("name", {
                    initialValue: this.state.name,
                    rules: [
                      {
                        required: true,
                        message: "Please enter name your place!",
                      },
                    ],
                  })(<Input placeholder="Listing title" autoComplete="off" />)}
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
                    onClick={() => {
                      this.props.continue({ page: 2, step: 2 });
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

const WrappedApp = Form.create({ name: "coordinated" })(NamePlace);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
