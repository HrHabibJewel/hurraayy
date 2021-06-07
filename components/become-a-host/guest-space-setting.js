import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Checkbox, Spin } from "antd";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

class GuestSpaceSetting extends React.Component {
  state = {
    guestSpaceList: [
      {
        labelName: "Kitchen",
        val: "kitchen",
      },
      {
        labelName: "Laundry - washer",
        val: "laundry_washer",
      },
      {
        labelName: "Laundry - dryer",
        val: "laundry_dryer",
      },
      {
        labelName: "Parking",
        val: "parking",
      },
      {
        labelName: "Gym",
        val: "gym",
      },
      {
        labelName: "Pool",
        val: "pool",
      },
      {
        labelName: "Hot tub",
        val: "hot_tub",
      },
      {
        labelName: "Elevator",
        val: "elevator",
      },
    ],
    guest_space_ids: [],
    loading: true
  }
  componentDidMount() {
    this.getEditData();
  }

  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp['propertySpaceList'] && resp['propertySpaceList'].length > 0) {
          let guest_space_ids = [];
          for (let key in resp['propertySpaceList']) {
            guest_space_ids.push(resp['propertySpaceList'][key]['id']);
          }
          this.setState({ guest_space_ids: guest_space_ids });
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
        let guest_space = values["guest_space"];
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/spaces";
        let spaceParamList = [];
        if (guest_space.length > 0) {
          for (let key in guest_space) {
            spaceParamList.push({
              name: guest_space[key],
            });
          }
        }
        let params = {};
        params["spaceParamList"] = spaceParamList;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(
              adventrueForm("guest-space-setting", property_id)
            );
            next({ page: 0, step: 1, data: resp });
            //Router.push({pathname:"/become-a-host/process"});
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const guestSpaceList = this.state.guestSpaceList;
    const { guest_space_ids, loading } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="guest-space-setting">
          <div>
            <h2>What areas guests will be able to use?</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            {getFieldDecorator("guest_space", {
              initialValue: guest_space_ids,
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Checkbox.Group style={{ width: "100%" }}>
                <Row gutter={24}>
                  {guestSpaceList.length > 0 &&
                    guestSpaceList.map((item, key) => {
                      return (
                        <Col span={20} key={key}>
                          <Checkbox value={item.val}>{item.labelName}</Checkbox>
                        </Col>
                      );
                    })}
                </Row>
              </Checkbox.Group>
            )}
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() => {
                      this.props.continue({ page: 7, step: 1 });
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

const WrappedApp = Form.create({ name: "coordinated" })(GuestSpaceSetting);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
