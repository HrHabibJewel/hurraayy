import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Input, Select, Spin, Modal } from "antd";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";
import Router from "next/router";
const { Option } = Select;

class PriceSpace extends React.Component {
  state = {
    visible: false,
    price: "",
    currency_id: "",
    currencies: [],
    cleaningFee: "",
    visible: false,
    loading: true,
    userName: ''
  };
  componentDidMount() {
    this.getCurrency();
    this.getEditData();
  }

  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["price"]) {
          this.setState({
            price: resp["price"],
          });
        }
        if (resp["cleaningFee"]) {
          this.setState({
            cleaningFee: resp["cleaningFee"],
          });
        }
        if (resp["currency"] && resp["currency"]["id"]) {
          this.setState({
            currency_id: resp["currency"]["id"],
          });
        }
        if (resp["user"]) {
          let fullName = resp['user']['firstName'] + " " + resp['user']['lastName'];
          this.setState({
            userName: fullName,
          });
        }
        this.setState({ loading: false })
      }
    });
  }

  getCurrency() {
    let _this = this;
    $axios.get("currencies").then(function (resp) {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let dataPush = [];
        if (dataList.length > 0) {
          for (let key in dataList) {
            dataPush.push({
              id: dataList[key]["id"],
              name: dataList[key]["name"],
            });
          }
        }
        _this.setState({
          currencies: dataPush,
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
        let url = "properties/" + property_id + "/price";
        params["currency_id"] = values["currency_id"];
        params["price"] = values["price"];
        params["cleaningFee"] = values["cleaningFee"];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("price-space", property_id));
            _this.setState({ visible: true });
            // next({ page: 11, step: 3, data: resp });
          }
        });
      }
    });
  };
  closeModal = () => {
    this.setState({ visible: false });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const currencies = this.state.currencies;
    const { loading, userName } = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="process">
          <div>
            <h2>How much do you want to charge?</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <p>Standard price</p>
                <Form.Item>
                  {getFieldDecorator("price", {
                    initialValue: this.state.price,
                    rules: [
                      {
                        required: true,
                        message: "Please enter your price!",
                      },
                    ],
                  })(<Input prefix="" placeholder={15} />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p>Cleaning fee</p>
                <Form.Item>
                  {getFieldDecorator("cleaningFee", {
                    initialValue: this.state.cleaningFee,
                    rules: [
                      {
                        required: true,
                        message: "Please enter cleaning fee!",
                      },
                    ],
                  })(<Input prefix="" placeholder={"Cleaning fee....."} />)}
                </Form.Item>
              </Col>
              <Col span={24}>
                <p>Currency</p>
                <Form.Item>
                  {getFieldDecorator("currency_id", {
                    initialValue: this.state.currency_id,
                    rules: [
                      {
                        required: true,
                        message: "Please select your apartment!",
                      },
                    ],
                  })(
                    <Select
                      className="margin-medium-bottom"
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select one"
                    >
                      <Option value="">Select One</Option>
                      {currencies.length > 0 &&
                        currencies.map((item, key) => {
                          return (
                            <Option key={key} value={item.id}>
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
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
                    onClick={() =>
                      this.props.continue({ page: 9, step: 3 })
                    }
                  >
                    <Icon type="left" />
                    &nbsp;Back
                  </Button>
                </Form.Item>
              </Col>
              {/* <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px", float: "right" }}
                >
                  <Button type="primary" htmlType="submit">
                    Next
                  </Button>
                </Form.Item>
              </Col> */}
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 2, offset: 0 }}
                  style={{ marginTop: "10px", float: "right" }}
                >
                  <Button type="primary" htmlType="submit">
                    Finish
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Modal
            title={null}
            closable={true}
            onCancel={() => this.closeModal()}
            visible={this.state.visible}
            footer={null}
          >
            <div className="px-4 pt-4 pb-2 text-center">


              <b>Hi {userName}, thank you for listing the property on Hurraayy.</b>
              <br />
              <br />
              <p>As part of our policy the property will go through the approval process and you will be able to check the status of your listing(s) from your host panel. Property approval normally takes no more than 72 hours.{" "}
              </p>
              <Button
                type="primary"
                style={{ margin: '0 auto', display: 'block', marginBottom: '20px' }}
                onClick={() => {
                  // Router.push({pathname:"/hosting/listings"})
                  Router.push({ pathname: "/host-panel" });
                }}
              >
                Go to Host Panel
            </Button>
              <p>
                If you have further question or if you need our assistance then
              please do not hesitate to contact us through our chat support.{" "}
              </p>
              <p>Thank you once again. </p>
            </div>
          </Modal>
        </div>
      </Spin>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(PriceSpace);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
