import React from "react";
import { connect } from "react-redux";

import { Row, Col, Form, Select, Button, Spin } from "antd";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

const { Option } = Select;
class PlaceSetting extends React.Component {
  state = {
    propertyTypes: [],
    cities: [],
    placeAccommodatesCount: "",
    place_type_id: "",
    country_city_id: "",
    loading: true,
  };
  getPropertyTypes() {
    let _this = this;
    $axios.get("property_types").then(function (resp) {
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
          propertyTypes: dataPush,
          loading: false,
        });
      }
    });
  }

  getCities() {
    let _this = this;
    $axios.get("cities").then(function (resp) {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let dataPush = [];
        if (dataList.length > 0) {
          for (let key in dataList) {
            let city_id = dataList[key]["id"];
            let country_id = dataList[key]["state"]["country"]["id"];
            let city = dataList[key]["name"];
            let country = dataList[key]["state"]["country"]["name"];
            dataPush.push({
              id: city_id + "_" + country_id,
              name: city + ", " + country,
            });
          }
        }
        _this.setState({
          cities: dataPush,
        });
      }
    });
  }
  componentDidMount() {
    this.getPropertyTypes();
    this.getCities();
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["placeType"] && resp["placeType"]["id"]) {
          this.setState({
            place_type_id: resp["placeType"]["id"],
          });
        }
        if (resp["placeAccommodatesCount"]) {
          this.setState({
            placeAccommodatesCount: resp["placeAccommodatesCount"],
          });
        }
        if (
          resp["country"] &&
          resp["country"]["id"] &&
          resp["city"] &&
          resp["city"]["id"]
        ) {
          this.setState({
            country_city_id: resp["city"]["id"] + "_" + resp["country"]["id"],
          });
        }
        // this.setState({ loading: true });
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
        let country_city_id = values["country_city_id"].split("_");
        params["city_id"] = country_city_id[0];
        params["country_id"] = country_city_id[1];
        params["placeAccommodatesCount"] = values["placeAccommodatesCount"];
        params["place_type_id"] = values["place_type_id"];
        $axios.post("properties", JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 201) {
            _this.props.dispatch(
              adventrueForm("place-setting", resp.data["id"])
            );
            // Router.push({ pathname: "/become-a-host/place-type" });
            next({ page: 2, step: 1, data: resp });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const propertyTypes = this.state.propertyTypes;
    const { cities, loading, placeAccommodatesCount } = this.state;
    //console.log("placeAccommodatesCount", placeAccommodatesCount)
    return (
      <Spin spinning={loading} tip="Loading...">
        <div>
          <h2>What type of property you want to list?</h2>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={24}>
            <Col span={14}>
              <Form.Item>
                {getFieldDecorator("place_type_id", {
                  initialValue: this.state.place_type_id,
                  rules: [
                    {
                      required: true,
                      message: "Please select your property!",
                    },
                  ],
                })(
                  <Select size="large" placeholder="Apartment">
                    <Option value="">Please select your property</Option>
                    {propertyTypes.length > 0 &&
                      propertyTypes.map((item, key) => {
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
            <Col span={10}>
              <Form.Item>
                {getFieldDecorator("placeAccommodatesCount", {
                  initialValue: placeAccommodatesCount ? parseInt(placeAccommodatesCount) : "",
                  rules: [
                    { required: true, message: "Please select number of guests!" },
                  ],
                })(
                  <Select size="large" placeholder="for 1 guest">
                    <Option value="">Number of Guests</Option>
                    {[...new Array(16)].map((item, key) => {
                      return (
                        <Option key={key} value={key + 1}>
                          for {key + 1} {(key == 0) ? 'guest' : 'guests'}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item>
                {getFieldDecorator("country_city_id", {
                  initialValue: this.state.country_city_id,
                  rules: [
                    { required: true, message: "Please select location" },
                  ],
                })(
                  <Select size="large" placeholder="Dhaka, Bangladesh">
                    <Option value="">Please select location</Option>
                    {cities.length > 0 &&
                      cities.map((item, key) => {
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
          <Form.Item
            wrapperCol={{ span: 2, offset: 0 }}
            style={{ marginTop: "10px" }}
          >
            <Button size="large" type="primary" htmlType="submit">
              Continue
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(PlaceSetting);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};

export default connect(mapState)(WrappedApp);
