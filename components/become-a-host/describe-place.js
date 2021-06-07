import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Input, Button, Icon, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

class DescribePlace extends React.Component {
  state = {
    descriptionSummery:"",
    descriptionSpace:"",
    descriptionAvailability:"",
    descriptionNeighborhood:"",
    descriptionAround:"",
    loading:true
  }
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["descriptionSummery"]) {
          this.setState({
            descriptionSummery: resp["descriptionSummery"],
          });
        }
        if (resp["descriptionSpace"]) {
          this.setState({
            descriptionSpace: resp["descriptionSpace"],
          });
        }
        if (resp["descriptionAvailability"]) {
          this.setState({
            descriptionAvailability: resp["descriptionAvailability"],
          });
        }
        if (resp["descriptionAvailability"]) {
          this.setState({
            descriptionAvailability: resp["descriptionAvailability"],
          });
        }
        if (resp["descriptionNeighborhood"]) {
          this.setState({
            descriptionNeighborhood: resp["descriptionNeighborhood"],
          });
        }
        if (resp["descriptionAround"]) {
          this.setState({
            descriptionAround: resp["descriptionAround"],
          });
        }
        this.setState({loading:false})
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
        let url = "properties/" + property_id + "/descriptions";
        params["descriptionSummery"] = values["descriptionSummery"];
        params["descriptionSpace"] = values["descriptionSpace"];
        params["descriptionAvailability"] = values["descriptionAvailability"];
        params["descriptionNeighborhood"] = values["descriptionNeighborhood"];
        params["descriptionAround"] = values["descriptionAround"];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("describe-place", property_id));
            //Router.push({pathname:"/become-a-host/name-place"});
            next({ page: 3, step: 2, data: resp });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { descriptionSummery, descriptionSpace, descriptionAvailability, 
      descriptionNeighborhood, descriptionAround, loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <div>
                  <h2>Give a good description to your place</h2>
                </div>
                <Form.Item>
                  {getFieldDecorator("descriptionSummery", {
                    initialValue:descriptionSummery,
                    rules: [
                      {
                        required: true,
                        message: "Please enter your place to guests!",
                      },
                    ],
                  })(<Input.TextArea />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <div>
                  <h2>A bit more will help travellers (optional)</h2>
                </div>
              </Col>
              {/* <Col span={24}>
                <div>
                  <h4>Your space</h4>
                  <p>
                    Qui magna labore sunt do sunt mollit ad veniam deserunt
                    tempor magna nisi ea. Sit voluptate
                  </p>
                </div>
                <Form.Item>
                  {getFieldDecorator("descriptionSpace", {
                    initialValue: descriptionSpace,
                    rules: [
                      {
                        required: false,
                        message: "Please enter your space!",
                      },
                    ],
                  })(<Input.TextArea />)}
                </Form.Item>
              </Col> */}
              <Col span={24}>
                <div>
                  <h4>You can add a note for the guests</h4>
                  <p>
                  On how you will get in touch with them
                  </p>
                </div>
                <Form.Item>
                  {getFieldDecorator("descriptionAvailability", {
                    initialValue:descriptionAvailability,
                    rules: [
                      {
                        required: false,
                        message: "Please enter your availability!",
                      },
                    ],
                  })(<Input.TextArea />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <div>
                  <h4>Surroundings and locality</h4>
                  <p>
                  You can add note about the localities, how to get around and is there any landmarks etc.
                  </p>
                </div>
                <Form.Item>
                  {getFieldDecorator("descriptionNeighborhood", {
                    initialValue:descriptionNeighborhood,
                    rules: [
                      {
                        required: false,
                        message: "Please enter your neighborhood!",
                      },
                    ],
                  })(<Input.TextArea />)}
                </Form.Item>
              </Col>
              {/* <Col span={24}>
                <div>
                  <h4>Getting around</h4>
                  <p>
                    Qui magna labore sunt do sunt mollit ad veniam deserunt
                    tempor magna nisi ea. Sit voluptate
                  </p>
                </div>
                <Form.Item>
                  {getFieldDecorator("descriptionAround", {
                    initialValue:descriptionAround,
                    rules: [
                      {
                        required: false,
                        message: "Please enter your around!",
                      },
                    ],
                  })(<Input.TextArea />)}
                </Form.Item>
              </Col> */}
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
                      this.props.continue({ page: 1, step: 2 });
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

const WrappedApp = Form.create({ name: "coordinated" })(DescribePlace);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
