import React from "react";
import { connect } from "react-redux";
import { Row, Col, Form, Button, Icon, Checkbox, Spin } from "antd";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

class Amenities extends React.Component {
  state = {
    amenitieList:[],
    amenityIds:[],
    loading:true
  };

  componentDidMount() {
    this.getAmenities();
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        if(resp['amenities'] && resp['amenities'].length > 0) {
          let amenityIds = [];
          for(let key in resp['amenities']) {
              amenityIds.push(resp['amenities'][key]['id']);
          }
          this.setState({amenityIds: amenityIds });
        }
        this.setState({loading: false})
      }
    });
  }
  getAmenities() {
    let _this = this;
    $axios.get("amenities").then(function (resp) {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let amenitieList = [];
        let uniqAmenitie = [];
        let i = 0;
        if (dataList.length > 0) {
          for (let key in dataList) {
            let item = dataList[key];
            let typeId = item['amenityTypeVO']['id']
            let typeName = item['amenityTypeVO']['name'];
            if(!uniqAmenitie[typeName]) {
              i = 0;
              amenitieList[typeName] = [];
              amenitieList[typeName][i] = {
                id:item['id'],
                name:item['name'],
                desc:item['amenityDiscription'],
                typeId:typeId
              };
            } else {
              i++;
              amenitieList[typeName][i] = {
                id:item['id'],
                name:item['name'],
                desc:item['amenityDiscription'],
                typeId:typeId
              };
            }
          uniqAmenitie[typeName] = true;
          }
        }
        _this.setState({amenitieList: amenitieList });
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
        let url = "properties/" + property_id + "/amenities";
        let amenityParamList = [];
        amenityParamList = values['amenities'];
        let params = {};
        params["amenity_ids"] = amenityParamList.length > 0 ? amenityParamList : [0];
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("amenities", property_id));
            next({ page: 8, step: 1, data: resp });
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {amenitieList, amenityIds, loading} = this.state;
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="location-setup">
          <div>
            <h2>What amenities the place has?</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>

          {getFieldDecorator("amenities", {
              initialValue: amenityIds,
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <Checkbox.Group style={{ width: "100%" }}>
                <Row gutter={24}>
                  {Object.keys(amenitieList).length > 0 &&
                    Object.keys(amenitieList).map((item, key) => {
                      return (
                        <Col span={20} key={key}>
                          <h3>{item}</h3>
                          {
                            amenitieList[item] &&
                            amenitieList[item].length > 0 &&
                            amenitieList[item].map((item1, key1) => {
                             return(
                                <div key={key+"_"+key1}>
                                  <Checkbox value={item1['id']}>{item1['name']}</Checkbox>
                                  {item1['desc'] && <p>{item1['desc']}</p>}
                                </div>
                              );
                            })
                          }
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
                      this.props.continue({ page: 6, step: 1 });
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

const WrappedApp = Form.create({ name: "coordinated" })(Amenities);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
