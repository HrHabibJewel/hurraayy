import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Select,
  Input,
  Icon,
  Spin,
} from "antd";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import { GEOCODE_URL, GEOCODE_KEY } from "../../lib/constans";
import { $axios } from "../../lib/http-service";
import { experienceForm } from "../../store/experienceForm/actions";
import { useDispatch, useSelector } from "react-redux";
import { getExperienceFormEditData, getExperienceId } from "../../lib/utils/utility";
import axios from "axios";

const { Option } = Select;

const MeetingLocation = (props) => {
  const { getFieldDecorator, validateFields } = props.form;
  const [loading, setLoading] = useState(true);
  const [countryList, setCountryList] = useState(true);
  const [googleVisible, setGoogleVisible] = useState(false);
  
  const dispatch = useDispatch();
  const experienceId = getExperienceId();

  const [state, setState] = useState({
    countryId: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state:"",
    lat: 0, 
    lng: 0,
    activeMarker: {},
    direction:"",
    zipCode:"",
    locationName:""
  });
  const mapStyles = {
    width: "100%%",
    height: "100%%",
  };

  useEffect(() => {
    getCounty()
    getExperienceFormEditData().then((resp) => {
      if(resp && resp['experienceLocaton']) {
        let _data = resp['experienceLocaton'];
        let _country = resp['country'];
        setState({ ...state, 
            countryId: _country['id'],  
            streetAddress:_data['stateAddress'],
            apartment:_data['appartment'],
            city:_data['city'],
            state:_data['state'],
            lat:_data['latitude'],
            lng:_data['longitude'],
            direction:_data['direction'],
            zipCode:_data['zipCode'],
            locationName:_data['locationName']
        });
      } else {
        getCurrentLocation(resp['country'])
      }
      setLoading(false);
    })
  }, []);

  function getCounty() {
    $axios.get("/countries").then((resp) => {
      if(resp && resp.status == 200) {
        setCountryList(resp.data);
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = props.continue;
    validateFields((err, values) => {
      if (!err) {
      let params = {};
      params["appartment"] = values["apartment"];
      params["city"] = values["city"];
      params["countryId"] = values["countryId"];
      params["direction"] = values["direction"]
      params["latitude"] = state['lat'];
      params["locationName"] = values["locationName"];
      params["longitude"] = state['lng'];
      params["state"] = values["state"];
      params["stateAddress"] = values["streetAddress"];
      params["zipCode"] = values["zipCode"];
      
      $axios.put("experience/"+experienceId+"/meeting_location/", JSON.stringify(params)).then(function (resp) {
        if (resp && resp.status == 200) {
          dispatch(
            experienceForm("meeting-location", experienceId)
          );
          next({ page: 2, step: 4, data: true });
        }
      });
    }
    });
  };

  const onMapClicked = (ref, map, ev) => {
    const location = ev.latLng;
    if(location) {
      setState({ ...state, lat:location.lat(), lng:location.lng()});
    }
  }

  const moveMarker = (ref, map, ev) => {
    const location = ev.latLng;
    if(location) {
      setState({ ...state, lat:location.lat(), lng:location.lng()});
    }
  }

  function fetchPlaces(mapProps, map) {
    setGoogleVisible(true)
  }

 function getCurrentLocation(countryResp) {

    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      if (lat && long) {
        let url =
          GEOCODE_URL + "?latlng=" + lat + "," + long + "&key=" + GEOCODE_KEY;
        axios.get(url).then(function (resp) {
          if (resp && resp.status == 200) {
            if (resp.data.results.length > 0) {
              let parts = resp.data.results[0].address_components;
              let street_number = "";
              let route = "";
              let city = "";
              let zipCode = "";
              let state = "";
              parts.forEach((part) => {
            //     if (part.types.includes("country")) {
            //       _this.setState({ country_id: part.long_name });
            //     }
            //     /*        Division    */
                if (part.types.includes("administrative_area_level_1")) {
                  state=part.long_name
                }
            //     /*       District    */
            //     if (part.types.includes("administrative_area_level_2")) {
            //     }
                /*          city   */
                if (part.types.includes("locality")) {
                  city = part.long_name
                }
                if (part.types.includes("route")) {
                  route = part.long_name;
                }
                if (part.types.includes("street_number")) {
                  street_number = part.long_name;
                }
                if (part.types.includes("postal_code")) {
                 zipCode = part.long_name
                }
              });
              setState({ ...state, 
                countryId:countryResp['id'],
                lat:lat, 
                lng:long,
                city:city, 
                streetAddress:street_number + ", " + route,
                zipCode:zipCode,
                state:state
              });
             }
          }
        });
      }
    });
  }
  return (
    <Spin spinning={loading} tip="Loading...">
      <div>
        <Form.Item>
          <Button htmlType="submit" style={{ float: "right", marginTop:"20px" }}>
            Save & Exit
          </Button>
        </Form.Item>
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="exp_con">
          {/* <h2>Where should guests meet you?</h2> */}
          <h2>Where you will meet with your guests?</h2>
          <p>This is normally the starting point of your experience. Mention the exact address from where the experience will start.</p>
        </div>

        <div className="exp_con">
            {/* <h4>Step 1: Provide an address</h4> */}
            <h4>Address</h4>
            <Row gutter={24}>
                <Col span={18}>
                    <Form.Item label="Country / Region">
                    {getFieldDecorator("countryId", {
                        initialValue: state['countryId'],
                        rules: [
                            {
                            required: true,
                            message: "",
                            },
                        ],
                    })(
                        <Select>
                        <Option value="">Please select your country!</Option>
                        {countryList.length > 0 &&
                        countryList.map((item, key) => {
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
            <Row gutter={24}>
              <Col span={18}>
                <Form.Item label="Street address">
                  {getFieldDecorator("streetAddress", {
                    initialValue: state['streetAddress'],
                    rules: [
                      {
                        required: true,
                        message: "",
                      },
                    ],
                  })(<Input type="text" placeholder="Listing title" autoComplete='nope'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={18}>
                <Form.Item label="Appt, suite. (optional)">
                  {getFieldDecorator("apartment", {
                    initialValue: state["apartment"],
                    rules: [
                      {
                        required: false,
                        message: "",
                      },
                    ],
                  })(<Input type="text" placeholder="Listing title" autoComplete='off'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={9}>
                <Form.Item label="City">
                  {getFieldDecorator("city", {
                    initialValue: state["city"],
                    rules: [
                      {
                        required: true,
                        message: "",
                      },
                    ],
                  })(<Input type="text" placeholder="Dhaka" autoComplete='off'/>)}
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="State">
                  {getFieldDecorator("state", {
                    initialValue: state["state"],
                    rules: [
                      {
                        required: true,
                        message: "",
                      },
                    ],
                  })(<Input type="text" placeholder="Dhaka Divition" autoComplete='off'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col span={10}>
                    <Form.Item label="Zip / Post code">
                    {getFieldDecorator("zipCode", {
                        initialValue: state["zipCode"],
                        rules: [
                        {
                            required: true,
                            message: "",
                        },
                        ],
                    })(<Input type="text" autoComplete="off" placeholder=""/>)}
                    </Form.Item>
              </Col>
            </Row>
            <h4>Set the pin on the location where the activity will take place</h4>
            {/* <p>Qui magna labore sunt do sunt mollit ad veniam deserunt tempor magna nisi ea.</p> */}
            <Row gutter={24}>
                <Col span={20}>
                <Map
                    google={props.google}
                    style={mapStyles}
                    containerStyle={{
                        position: "relative",
                        width: "100%",
                        height: "300px",
                    }}
                    center={{
                      lat: state['lat'],
                      lng: state['lng'],
                    }}
                   onClick={onMapClicked}
                   onReady={fetchPlaces}
                    zoom={15}
                    visible={googleVisible}
                    >
                    <Marker
                      title="Location"
                      id={1}
                      position={{
                            lat: state['lat'],
                            lng: state['lng'],
                        }}
                      draggable={true}
                     // onMouseover={onMouseoverMarker}
                     // onClick={onMarkerClick}
                      onDragend={moveMarker}
                     />
                    </Map>
                </Col>
            </Row>
            {/* <h4>Step 3: Add a description (optional)</h4> */}
            <Row gutter={24}>
                <Col span={18}>
                  <h5>You can give a direction for the guests</h5>
                  {/* <p>Qui magna labore sunt do sunt mollit ad veniam deserunt tempor magna nisi ea. Sit voluptate </p> */}
                    <Form.Item>
                    {getFieldDecorator("direction", {
                        initialValue:state['direction']
                    })(<Input.TextArea rows={4}/>)}
                    </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
                <Col span={18}>
                  {/* <h5>Location name</h5> */}
                  <h5>Name of the location 
                    i.e Kolabagan bus stop, Mohakhali bus terminal etc. </h5>
                    <Form.Item>
                    {getFieldDecorator("locationName", {
                        initialValue:state['locationName']
                    })(<Input />)}
                    </Form.Item>
              </Col>
            </Row>
        </div>
        <div className="exp_con">
          <Col span={12}>
            <Form.Item
              wrapperCol={{ span: 6, offset: 0 }}
              style={{ marginTop: "10px" }}
            >
              <Button
                type="link"
                onClick={() => {
                  props.continue({ page: 7, step: 3 });
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
              <Button
                type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Col>
        </div>
      </Form>
    </Spin>
  );
};

const WrappedApp = Form.create({ name: "coordinated" })(MeetingLocation);
//export default Form.create()(MeetingLocation);
export default GoogleApiWrapper({
  apiKey: GEOCODE_KEY,
})(WrappedApp);
