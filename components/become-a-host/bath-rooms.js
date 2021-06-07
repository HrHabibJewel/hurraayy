import React from "react";
import { connect } from "react-redux";
import TextChange from "../../components/ui/form/textChange";
import { Row, Col, Form, Button, Icon, Spin } from "antd";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

class Bathrooms extends React.Component {
  state = {
    bathroomCount: 1,
    loading: true
  };
  componentDidMount() {
    this.getEditData();
  }

  getEditData() {
    getAdvFormEditData().then((resp) => {
      //console.log("====", resp)
      if (resp) {
        if (resp["bathroomCount"]) {
          this.setState({
            bathroomCount: resp["bathroomCount"],
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
        let url = "properties/" + property_id + "/bathrooms";
        let params = {};
        params["bathroomCount"] = this.state.bathroomCount;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("bath-rooms", resp.data["id"]));
            next({ page: 5, step: 1, data: resp });
            // Router.push({pathname:"/become-a-host/location-setup"});
          }
        });
      }
    });
  };
  setStateFunc = (val, name) => {
    this.setState({
      [name]: val,
    });
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="bathrooms">
          <div>
            <h2>How many bathrooms?</h2>
            <p>You can consider a bathroom as half if it doesn't have shower or bathtub.</p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  <TextChange
                    labelName="Bathrooms"
                    textName="bathroomCount"
                    val={this.state.bathroomCount}
                    valType={.5}
                    textChange={this.setStateFunc}
                  />
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
                      this.props.continue({ page: 3, step: 1 });
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

const WrappedApp = Form.create({ name: "coordinated" })(Bathrooms);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};

export default connect(mapState)(WrappedApp);
