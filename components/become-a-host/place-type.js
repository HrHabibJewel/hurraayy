import React from "react";
import { connect } from "react-redux";
import { Row, Col, Radio, Form, Button, Icon, Spin } from "antd";
import { $axios } from "../../lib/http-service";
import { adventrueForm } from "../../store/adventureForm/actions";
import { getAdvFormEditData } from "../../lib/utils/utility";

const descriptionList = [
  'Guests will have the entire place.',
  'Guests will have the private room. Other spaces may be shared.',
  'Guests will share the room and common area with others.'
]
class PlaceType extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      subcategories: [],
      propertyTypes: [],
      category_id: "",
      sub_category_id: "",
      property_type_id: "",
      is_dedicated_space: 1,
      is_listing_part_of_a_company: 1,
      loading: true,
    };
  }
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

  getCategory() {
    let _this = this;
    $axios.get("/categories").then((resp) => {
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
          categories: dataPush,
        });
      }
    });
  }
  getSubCategory() {
    let _this = this;
    $axios.get("/subcategories").then((resp) => {
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
          subcategories: dataPush,
        });
      }
    });
  }
  componentDidMount() {
    this.getCategory();
    this.getSubCategory();
    this.getPropertyTypes();
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["category"] && resp["category"]["id"]) {
          this.setState({
            category_id: resp["category"]["id"],
          });
          this.onChangeCategory(resp["category"]["id"]);
        }
        if (resp["subCategory"] && resp["subCategory"]["id"]) {
          this.setState({
            sub_category_id: resp["subCategory"]["id"],
          });
        }

        if (resp["propertyType"] && resp["propertyType"]["id"]) {
          this.setState({
            property_type_id: resp["propertyType"]["id"],
          });
        }
        if (resp["isDedicatedGuestSpace"] != null) {
          this.setState({
            is_dedicated_space: resp["isDedicatedGuestSpace"],
          });
        }
        if (resp["isListingPartOfCompany"] != null) {
          this.setState({
            is_listing_part_of_a_company: resp["isListingPartOfCompany"],
          });
        }
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
        let url = "properties/" + property_id + "/room";
        params["category_id"] = values["category_id"];
        params["is_dedicated_space"] = values["is_dedicated_space"];
        params["is_listing_part_of_a_company"] =
          values["is_listing_part_of_a_company"];
        params["property_type_id"] = values["property_type_id"];
        params["sub_category_id"] = values["sub_category_id"];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("place-type", resp.data["id"]));
            // Router.push({ pathname: "/become-a-host/accoommodation" });
            next({ page: 3, step: 1, data: resp });
          }
        });
      }
    });
  };

  onChangeCategory = (category_id) => {
    let _this = this;
    _this.setState({ category_id: category_id });
    $axios.get("/subcategories/category/" + category_id).then((resp) => {
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
          subcategories: dataPush,
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, categories, subcategories, propertyTypes } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="place-type">
          <div>
            <h2>Let's select exactly what you are listing??</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <h3>Please select</h3>
                <Form.Item>
                  {getFieldDecorator("category_id", {
                    initialValue: this.state.category_id,
                    rules: [
                      {
                        required: true,
                        message: "Please select a category!",
                      },
                    ],
                  })(
                    <Radio.Group
                      onChange={(e) => this.onChangeCategory(e.target.value)}
                    >
                      {categories.length > 0 &&
                        categories.map((item, key) => {
                          return (
                            <Radio.Button key={key} value={item.id}>
                              {item.name}
                            </Radio.Button>
                          );
                        })}
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <h3>Let's choose a property type</h3>
                <Form.Item>
                  {getFieldDecorator("sub_category_id", {
                    initialValue: this.state.sub_category_id,
                    rules: [
                      {
                        required: true,
                        message: "Please select a sub category!",
                      },
                    ],
                  })(
                    <Radio.Group>
                      {subcategories.length > 0 &&
                        subcategories.map((item, key) => {
                          return (
                            <Radio.Button key={key} value={item.id}>
                              {item.name}
                            </Radio.Button>
                          );
                        })}
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className="guest-setting">
                  <div>
                    <h2>More precisely your guests will have:</h2>
                  </div>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item>
                        {getFieldDecorator("property_type_id", {
                          initialValue: this.state.property_type_id,
                          rules: [
                            {
                              required: true,
                              message: "Please select a property type!",
                            },
                          ],
                        })(
                          <Radio.Group>
                            {propertyTypes.length > 0 &&
                              propertyTypes.map((item, key) => {
                                return (
                                  <div key={key}>
                                    <Radio style={radioStyle} value={item.id}>
                                      <b>{item.name}</b>
                                    </Radio>
                                    <p>
                                      {descriptionList[key]}
                                    </p>
                                  </div>
                                );
                              })}
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                    {/* <Col span={24}>
                      <h4>Is this setup as a dedicated guest space?</h4>
                      <Form.Item>
                        {getFieldDecorator("is_dedicated_space", {
                          initialValue: this.state.is_dedicated_space,
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Radio.Group>
                            <Radio style={radioStyle} value={1}>
                              Yes, it’s primarily setup for guests
                            </Radio>
                            <Radio style={radioStyle} value={0}>
                              No, it’s primarily setup for guests
                            </Radio>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={24}> 
                      <h4>Are you listing on Hurraayy as part of a company?</h4>
                      <Form.Item>
                        {getFieldDecorator("is_listing_part_of_a_company", {
                          initialValue: this.state.is_listing_part_of_a_company,
                          rules: [
                            {
                              required: false,
                            },
                          ],
                        })(
                          <Radio.Group>
                            <Radio style={radioStyle} value={1}>
                              Yes, I work for or run a business
                            </Radio>
                            <Radio style={radioStyle} value={0}>
                              No, that doesn’t sound like me
                            </Radio>
                          </Radio.Group>
                        )}
                      </Form.Item>
                    </Col>
                  
                */}
                  </Row>
                </div>
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
                      this.props.continue({ page: 1, step: 1 });
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
                  <Button size="large" type="primary" htmlType="submit">
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

const WrappedApp = Form.create({ name: "coordinated" })(PlaceType);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
