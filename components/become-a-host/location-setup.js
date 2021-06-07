import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Select, Input, Button, Icon, Spin } from "antd";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import axios from "axios";
import { GEOCODE_URL, GEOCODE_KEY } from "../../lib/constans";
import { getAdvFormEditData } from "../../lib/utils/utility";

const { Option } = Select;

class LocationSetup extends React.Component {
  state = {
    lat: "",
    long: "",
    apartment: "",
    country_id: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    countries: [],
    countryArr: {},
    loading:true
  };
  componentDidMount() {
    this.getCountries();
    this.getEditData();
  }

  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if(resp['city'] && resp['city']['state'] && resp['city']['state']['country'] && resp['city']['state']['country']['shortName']){
          this.setState({
            country_id: resp['city']['state']['country']['shortName']
          });
        }
        if(resp['locZipCode']){
          this.setState({
            zipCode: resp['locZipCode']
          });
        }
        if(resp['locState']){
          this.setState({
            state: resp['locState']
          });
        }
        if(resp['locCity']){
          this.setState({
            city: resp['locCity']
          });
        }
        if(resp['locApartment']){
          this.setState({
            apartment: resp['locApartment']
          });
        }
        if(resp['locStreet']){
          this.setState({
            street: resp['locStreet']
          });
        }
        if(resp['langitude']){
          this.setState({
            long: resp['langitude']
          });
        }
        if(resp['latitude']){
          this.setState({
            lat: resp['latitude']
          });
        }
        this.setState({loading:false})
      }
    });
  }

  getCountries() {
    let _this = this;
    $axios.get("countries").then(function (resp) {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let dataPush = [];
        if (dataList.length > 0) {
          for (let key in dataList) {
            dataPush.push({
              id: dataList[key]["shortName"],
              name: dataList[key]["name"],
            });
            _this.state.countryArr[dataList[key]["shortName"]] =
              dataList[key]["id"];
          }
        }
        _this.setState({
          countries: dataPush,
        });
      }
    });
  }

  getCurrentLocation() {
    let _this = this;
    navigator.geolocation.getCurrentPosition(function (position) {
      //console.log("po",position)
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      if (lat && long) {
        _this.setState({ lat: lat });
        _this.setState({ long: long });
        let url =
          GEOCODE_URL + "?latlng=" + lat + "," + long + "&key=" + GEOCODE_KEY;
        axios.get(url).then(function (resp) {
          if (resp && resp.status == 200) {
            if (resp.data.results.length > 0) {
              let parts = resp.data.results[0].address_components;
              let street_number = "";
              let route = "";
              parts.forEach((part) => {
                if (part.types.includes("country")) {
                  _this.setState({ country_id: part.long_name });
                }
                /*        Division    */
                if (part.types.includes("administrative_area_level_1")) {
                  _this.setState({ state: part.long_name });
                }
                /*       District    */
                if (part.types.includes("administrative_area_level_2")) {
                }
                /*          city   */
                if (part.types.includes("locality")) {
                  _this.setState({ city: part.long_name });
                }
                if (part.types.includes("route")) {
                  route = part.long_name;
                }
                if (part.types.includes("street_number")) {
                  street_number = part.long_name;
                }
                if (part.types.includes("postal_code")) {
                  _this.setState({ zipCode: part.long_name });
                }
              });
              _this.setState({ street: street_number + ", " + route });
            }
          }
        });
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let countryArr = this.state.countryArr;
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/location";
        let params = {};
        params["apartment"] = values["apartment"];
        params["city"] = values["city"];
        (params["country_id"] = countryArr[values["country_id"]]
          ? countryArr[values["country_id"]]
          : 0),
          (params["langitude"] = this.state.long);
        params["latitude"] = this.state.lat;
        params["state"] = values["state"];
        params["street"] = values["street"];
        params["zipCode"] = values["zipCode"];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("location-setup", property_id));
            next({ page: 6, step: 1, data: resp });
           // Router.push({ pathname: "/become-a-host/location-confirmation" });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {countries, loading} = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="location-setup">
          <div>
            <h2>The location of your place?</h2>
            <p>We will send the exact location to guests only when they confirm a reservation.</p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col>
                <Form.Item>
                  <Button
                    onClick={() => this.getCurrentLocation()}
                    type="primary"
                    icon="search"
                  >
                    Use current location
                  </Button>
                </Form.Item>
              </Col>
              <Col span={20}>
                <Form.Item label="Country">
                  {getFieldDecorator("country_id", {
                    initialValue: this.state.country_id,
                    rules: [
                      {
                        required: true,
                        message: "Please select your country!",
                      },
                    ],
                  })(
                    <Select>
                      <Option value="">Please select your country!</Option>
                      {countries.length > 0 &&
                        countries.map((item, key) => {
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
              <Col span={20}>
                <Form.Item label="Street address">
                  {getFieldDecorator("street", {
                    initialValue: this.state.street,
                    rules: [
                      {
                        required: true,
                        message: "Please enter your street address!",
                      },
                    ],
                  })(<Input type="text" placeholder="House, road etc" autoComplete='nope'/>)}
                </Form.Item>
              </Col>
              <Col span={20}>
                <Form.Item label="Apartment, suite">
                  {getFieldDecorator("apartment", {
                    initialValue: this.state.apartment,
                    rules: [
                      {
                        required: true,
                        message: "Please enter your Apartment, suite!",
                      },
                    ],
                  })(<Input type="text" placeholder="Apartment, suite" autoComplete='off'/>)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="City">
                  {getFieldDecorator("city", {
                    initialValue: this.state.city,
                    rules: [
                      {
                        required: true,
                        message: "Please enter your city!",
                      },
                    ],
                  })(<Input type="text" placeholder="Dhaka" autoComplete='off'/>)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="State/County">
                  {getFieldDecorator("state", {
                    initialValue: this.state.state,
                    rules: [
                      {
                        required: true,
                        message: "Please enter your state!",
                      },
                    ],
                  })(<Input type="text" placeholder="Dhaka Divition" autoComplete='off'/>)}
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="Zip code / Post code">
                  {getFieldDecorator("zipCode", {
                    initialValue: this.state.zipCode,
                    rules: [
                      {
                        required: true,
                        message: "Please enter your zip code!",
                      },
                    ],
                  })(<Input type="text" autoComplete="off" placeholder=""/>)}
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
                      this.props.continue({ page: 4, step: 1 });
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

const WrappedApp = Form.create({ name: "coordinated" })(LocationSetup);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
