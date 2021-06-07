import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Form,
  Button,
  Icon,
  Checkbox,
  Input,
  Radio,
  Modal,
  Popover,
  Spin
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

class HouseRules extends React.Component {
  state = {
    houseRules: [],
    houseRuleAdditionals: [],
    houseRuleGuests: [],
    visible: false,
    defaultExplain: "",
    loading: true
  };
  componentDidMount() {
    this.getHouseRule();
    this.getGuestHouseRule();
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp && resp["houseRules"]) {
        let propertyHouseRuleList = resp["houseRules"]["propertyHouseRuleList"];
        let propertyHouseRuleDetailsList =
          resp["houseRules"]["propertyHouseRuleDetailsList"];
        let propertyHouseRuleAdditionalList =
          resp["houseRules"]["propertyHouseRuleAdditionalList"];
        if (propertyHouseRuleList && propertyHouseRuleList.length > 0) {
          this.setHouseRule(propertyHouseRuleList);
        }
        if (
          propertyHouseRuleAdditionalList &&
          propertyHouseRuleAdditionalList.length
        ) {
          for (let key in propertyHouseRuleAdditionalList) {
            this.addAdditional(
              propertyHouseRuleAdditionalList[key]["ruleName"]
            );
          }
        }

        if (
          propertyHouseRuleDetailsList &&
          propertyHouseRuleDetailsList.length
        ) {
          this.setHouseRuleDetails(propertyHouseRuleDetailsList);
        }
        this.setState({ loading: false })
      }
    });
  }
  setHouseRule(propertyHouseRuleList) {
    let phouseRules = [];
    for (let key in propertyHouseRuleList) {
      let hr = propertyHouseRuleList[key];
      phouseRules[hr["houseRule"]["id"]] = {
        explanation: hr["explanation"],
        applicable: hr["applicable"],
      };
    }
    let houseRules = this.state.houseRules;
    if (houseRules && houseRules.length > 0) {
      let _houseRules = [];
      for (let key in houseRules) {
        let id = houseRules[key]["id"];
        if (phouseRules[id]) {
          _houseRules.push({
            id: houseRules[key]["id"],
            name: houseRules[key]["name"],
            ruleDetails: houseRules[key]["ruleDetails"],
            integrationSignAllow: houseRules[key]["integrationSignAllow"],
            explanationRequire: houseRules[key]["explanationRequire"],
            explanationOk: phouseRules[id]["explanation"],
            popoverVisible: false,
            explanation: "",
            applicable: phouseRules[id]["applicable"],
            isEdit: true,
          });
        } else {
          _houseRules.push(houseRules[key]);
        }
      }
      this.setState({
        houseRules: _houseRules,
      });
    }
  }
  setHouseRuleDetails(propertyHouseRuleDetailsList) {
    let hrDetails = [];
    for (let key in propertyHouseRuleDetailsList) {
      let hrd = propertyHouseRuleDetailsList[key];
      hrDetails[hrd["houseRuleDetails"]["id"]] = {
        name: hrd["houseRuleDetails"]["name"],
        description: hrd["description"],
      };
    }
    let houseRuleGuests = this.state.houseRuleGuests;
    if (houseRuleGuests && houseRuleGuests.length > 0) {
      let _houseRuleGuests = [];
      for (let key in houseRuleGuests) {
        let id = houseRuleGuests[key]["id"];
        if (hrDetails[id]) {
          _houseRuleGuests.push({
            id: id,
            name: hrDetails[id]["name"],
            description: hrDetails[id]["description"],
            isChecked: true,
          });
        } else {
          _houseRuleGuests.push(houseRuleGuests[key]);
        }
      }
      this.setState({
        houseRuleGuests: _houseRuleGuests,
      });
    }
  }
  getHouseRule() {
    let _this = this;
    $axios.get("/house_rule").then((resp) => {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let dataPush = [];
        if (dataList.length > 0) {
          for (let key in dataList) {
            dataPush.push({
              id: dataList[key]["id"],
              name: dataList[key]["name"],
              ruleDetails: dataList[key]["ruleDetails"],
              integrationSignAllow: dataList[key]["integrationSignAllow"],
              explanationRequire: dataList[key]["explanationRequire"],
              applicable: "",
              explanation: "",
              explanationOk: "",
              popoverVisible: false,
              isEdit: false,
            });
          }
        }
        _this.setState({
          houseRules: dataPush,
        });
      }
    });
  }
  getGuestHouseRule() {
    let _this = this;
    $axios.get("/house_rule_details").then((resp) => {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let dataPush = [];
        if (dataList.length > 0) {
          for (let key in dataList) {
            dataPush.push({
              id: dataList[key]["id"],
              name: dataList[key]["name"],
              description: "",
              isChecked: false,
            });
          }
        }
        _this.setState({
          houseRuleGuests: dataPush,
        });
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
        let url = "properties/" + property_id + "/house-rules";

        let addAdditionalHR = [];
        let houseRuleAdditionals = this.state.houseRuleAdditionals;
        if (houseRuleAdditionals.length) {
          for (let key in houseRuleAdditionals) {
            addAdditionalHR.push({
              property_id: property_id,
              ruleName: houseRuleAdditionals[key],
            });
          }
        }

        let detailsHR = [];
        let houseRuleGuests = this.state.houseRuleGuests;
        if (houseRuleGuests.length) {
          for (let key in houseRuleGuests) {
            if (houseRuleGuests[key]["isChecked"]) {
              detailsHR.push({
                description: houseRuleGuests[key]["name"],
                house_rule_details_id: houseRuleGuests[key]["id"],
                property_id: property_id,
              });
            }
          }
        }

        let hr = [];
        let houseRules = this.state.houseRules;
        if (houseRules.length) {
          for (let key in houseRules) {
            if (houseRules[key]["applicable"] !== "") {
              hr.push({
                applicable: houseRules[key]["applicable"],
                explanation: houseRules[key]["explanationOk"],
                house_rule_id: houseRules[key]["id"],
                property_id: property_id,
              });
            }
          }
        }

        params["propertyHouseRuleAdditionalParamList"] = addAdditionalHR;
        params["propertyHouseRuleDetailsParamList"] = detailsHR;
        params["propertyHouseRuleParamList"] = hr;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("house-rules", property_id));
            next({ page: 4, step: 3, data: resp });
            //Router.push({ pathname: "/become-a-host/check-requirements" });
          }
        });
      }
    });
  };
  addAdditional = (val) => {
    if (val) {
      this.state.houseRuleAdditionals.push(val);
      this.setState({
        houseRuleAdditionals: this.state.houseRuleAdditionals,
      });
    }
  };

  removeAdditional = (key) => {
    delete this.state.houseRuleAdditionals[key];
    this.setState({
      houseRuleAdditionals: this.state.houseRuleAdditionals,
    });
  };

  onChangeGuestDes = (key) => (e) => {
    e.persist();
    let val = e.target.value;
    if (val) {
      this.state.houseRuleGuests[key]["description"] = val;
      this.setState({
        houseRuleGuests: this.state.houseRuleGuests,
      });
    }
  };

  onChangeGuest = (key) => (e) => {
    let checked = e.target.checked;
    this.state.houseRuleGuests[key]["isChecked"] = checked;
    this.setState({
      houseRuleGuests: this.state.houseRuleGuests,
    });
  };
  /*       explain        */
  getModal(item, key) {
    return (
      <div>
        <p>{item["explanationOk"]}</p>
        <a onClick={this.showModal(key)}>Explain why</a>
        <Modal
          title="Explain why your listing isn’t suitable for children"
          visible={this.state.visible}
          okText="Done"
          onOk={this.handleOk(key)}
          onCancel={this.handleCancel}
        >
          <h3>
            What features of your space might be dangerous to children or easily
            damaged?
          </h3>
          <Form>
            <Input.TextArea
              rows={4}
              defaultValue={item["explanationOk"]}
              placeholder="Example: The second floor staircase doesn’t have handrails."
              onChange={this.changeHouseRuleExplain(key)}
            />
          </Form>
        </Modal>
      </div>
    );
  }

  changeHouseRuleExplain = (key) => (e) => {
    e.persist();
    let val = e.target.value;
    this.state.houseRules[key]["explanation"] = val;
    this.forceUpdate();
  };

  handleOk = (key) => (e) => {
    let val = this.state.houseRules[key]["explanation"];
    this.state.houseRules[key]["explanationOk"] = val;
    this.state.visible = false;
    this.forceUpdate();
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };
  showModal = (key) => (e) => {
    this.setState({
      visible: true,
    });
  };
  onChangeApplicable = (key) => (e) => {
    let val = e.target.value;
    let applicable = false;
    if (val) {
      applicable = true;
    }
    this.state.houseRules[key]["applicable"] = applicable;
    this.forceUpdate();
  };
  /*       popover        */
  handlePopoverChange(key, status) {
    this.state.houseRules[key]["popoverVisible"] = status;
    this.forceUpdate();
  }
  getPopover(item, key) {
    const content = (
      <div>
        <p
          onClick={() => this.handlePopoverChange(key, false)}
          style={{ float: "right", cursor: "pointer" }}
        >
          <CloseOutlined />
        </p>
        <p>{item["ruleDetails"]}</p>
      </div>
    );
    return (
      <Popover
        content={content}
        placement="bottomLeft"
        trigger="click"
        visible={item["popoverVisible"]}
        onVisibleChange={() => this.handlePopoverChange(key, true)}
      >
        <QuestionCircleOutlined />
      </Popover>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const houseRules = this.state.houseRules;
    const houseRuleAdditionals = this.state.houseRuleAdditionals;
    const houseRuleGuests = this.state.houseRuleGuests;
    const { loading } = this.state;
    let additional;
    if (houseRuleAdditionals.length > 0) {
      additional = (
        <table style={{ width: "100%" }}>
          <tbody>
            {houseRuleAdditionals.map((item, key) => {
              return (
                <tr key={key}>
                  <td>{item}</td>
                  <td
                    onClick={() => this.removeAdditional(key)}
                    style={{
                      float: "right",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <Icon type="close" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process house-rules">
          <div>
            <h2>Define your house policies</h2>
            <p>
              Guests will have to accept the policies before they make a reservation.
            </p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              {/* <Col span={24}>
                <ul>
                  {houseRules.length > 0 &&
                    houseRules.map((item, key) => {
                      return (
                        <li key={key} className="mb-4">
                          {item["name"]}&nbsp;
                          {item["integrationSignAllow"] &&
                            this.getPopover(item, key)}
                          <br />
                          {item["applicable"] === false &&
                            item["explanationRequire"] &&
                            this.getModal(item, key)}
                          <span
                            className="d-inline-block"
                            style={{ float: "right", marginTop: "-20px" }}
                          >
                            <Radio.Group
                              className="radio-circle"
                              onChange={this.onChangeApplicable(key)}
                            
                              buttonStyle="solid"
                            >
                              <Radio.Button
                                value={false}
                                checked={
                                  item["isEdit"] && item["applicable"] == false
                                    ? true
                                    : false
                                }
                                className="ant-btn-circle"
                                style={{
                                  marginRight: 10,
                                  padding: "0px",
                                  borderRadius: "50%",
                                }}
                              >
                                <CloseOutlined />
                              </Radio.Button>
                              <Radio.Button
                                value={true}
                                checked={
                                  item["isEdit"] && item["applicable"] == true
                                    ? true
                                    : false
                                }
                                className="ant-btn-circle"
                                style={{ padding: "0px", borderRadius: "50%" }}
                              >
                                <CheckOutlined />
                              </Radio.Button>
                            </Radio.Group>
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </Col> */}
              <Col span={24}>
                <p>Add policies</p>
                {additional}
                <Input.Search
                  placeholder="No smoking, No shoes."
                  enterButton="Add"
                  size="large"
                  onSearch={(value) => this.addAdditional(value)}
                />
              </Col>
              {/* <Col span={24}>
                <p className="text-bold">
                  Details guest must know about your home
                </p>
                <ul className="fa-ul">
                  {houseRuleGuests.length > 0 &&
                    houseRuleGuests.map((item, key) => {
                      return (
                        <span key={key}>
                          <li>
                            <Checkbox
                              onChange={this.onChangeGuest(key)}
                              checked={item["isChecked"] ? true : false}
                              value={item.val}
                            >
                              {item["name"]}
                            </Checkbox>
                          </li>
                          {item["isChecked"] && (
                            <div>
                              <li>
                                Describe the noise and when it’s likely to take
                                place
                              </li>
                              <li>
                                <Input
                                  style={{ marginBottom: "20px !important" }}
                                  value={item["description"]}
                                  placeholder="Add your description"
                                  onChange={this.onChangeGuestDes(key)}
                                  className="mb-4"
                                />
                              </li>
                            </div>
                          )}
                        </span>
                      );
                    })}
                </ul>
              </Col>*/}
            </Row>

            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() =>
                      this.props.continue({ page: 1, step: 3 })
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

const WrappedApp = Form.create({ name: "coordinated" })(HouseRules);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
