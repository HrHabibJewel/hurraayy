import React from "react";
import { Row, Col, Form, Button, Icon, Spin } from "antd";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import { GEOCODE_KEY } from "../../lib/constans";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";
// 1 Shyamoli Road 1, ঢাকা, ঢাকা বিভাগ 1207, Bangladesh
class LocationConfirmation extends React.Component {
  state = {
    lat: 0,
    lng: 0,
    // address: "",
    // loading: true,
    // activeMarker: {},
    // selectedPlace: {},
    // showingInfoWindow: false,
    apartment: "",
    country_id: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    googleVisible:false,
    propertyId: 0
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      if (resp) {
        this.setState({propertyId: resp['id'] });
        let countryName = "";
        if (resp['city'] && resp['city']['state'] && resp['city']['state']['country'] && resp['city']['state']['country']['name']) {
          countryName = resp['city']['state']['country']['name'];
        }
        let address = resp['locStreet'] + ", " + resp['locCity'] + ", " + resp['locState'] + ", " + resp['locZipCode'] + ", " + countryName;
        this.setState({
          address: address
        });
        if(resp['city'] && resp['city']['state'] && resp['city']['state']['country'] && resp['city']['state']['country']['shortName']){
          this.setState({
            country_id: resp['city']['state']['country']['id']
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
        if (resp['langitude']) {
          this.setState({lng: resp['langitude'] });
        }
        if (resp['latitude']) {
          this.setState({lat: resp['latitude']});
        }
        this.setState({ loading: false })
      }
    });
  }
  // onMarkerClick = (props, marker) =>
  //   this.setState({
  //     activeMarker: marker,
  //     selectedPlace: props,
  //     showingInfoWindow: true
  //   });

  // onInfoWindowClose = () =>
  //   this.setState({
  //     activeMarker: null,
  //     showingInfoWindow: false
  //   });

  onMapClicked = (ref, map, ev) => {
    const location = ev.latLng;
    if(location) {
      this.setState({lat:location.lat(), lng:location.lng()});
    }
    // if (this.state.showingInfoWindow)
    //   this.setState({
    //     activeMarker: null,
    //     showingInfoWindow: false
    //   });
  };
  moveMarker = (ref, map, ev) => {
    const location = ev.latLng;
    if(location) {
      this.setState({lat:location.lat(), lng:location.lng()});
    }
  }
 fetchPlaces = (mapProps, map) => {
    this.setState({googleVisible: true});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let _this = this;
        let propertyId = this.state.propertyId;
        let url = "properties/" + propertyId + "/location";
        let params = {};
        // params["langitude"] = this.state.lng;
        // params["latitude"] = this.state.lat;

        params["apartment"] = this.state["apartment"];
        params["city"] = this.state["city"];
        params["country_id"] =  this.state['country_id'],
        params["langitude"] = this.state.lng;
        params["latitude"] = this.state.lat;
        params["state"] = this.state["state"];
        params["street"] = this.state["street"];
        params["zipCode"] = this.state["zipCode"];


        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
           // _this.props.dispatch(adventrueForm("location-confirm", propertyId));
            next({ page: 7, step: 1, data: resp });
          }
        });
      }
    });
  };

  render() {
    const { loading, address } = this.state;
    let lat = this.state.lat;
    let lng = this.state.lng;
    const mapStyles = {
      width: "100%",
      height: "280%",
    };
    let map;
    // {
    //   lat && lng &&
    //     (map = (
    //       <Map
    //         className="map"
    //         google={this.props.google}
    //         // onClick={this.onMapClicked}
    //         style={mapStyles}
    //         center={{
    //           lat: "90.3682429",
    //           lng: "23.7773607",
    //         }}
    //         zoom={13}
    //        // onReady={this.fetchPlaces}
    //        // visible={this.state.googleVisible}
    //       >
    //         <Marker
    //          // name={"latitude:" + lat + ", longitude:" + lng}
    //           // title={'The marker`s title will appear as a tooltip.'}
    //         //  onClick={this.onMarkerClick}
    //          // position={{ lat: lat, lng: lng }}
    //         />

    //         {/* <InfoWindow
    //           marker={this.state.activeMarker}
    //           onClose={this.onInfoWindowClose}
    //           visible={this.state.showingInfoWindow}
    //         >
    //           <div>
    //             <h4>{this.state.selectedPlace.name}</h4>
    //           </div>
    //         </InfoWindow> */}
    //       </Map>
    //     ));
    // }
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="location-setup">
          <div>
            <h2>The pin corresponds to the right place?</h2>
            <p>
              If needed, you can adjust the map so the pin is in the right
              location. Only confirmed guests will see this, so they know how to
              get to your place.
            </p>
          </div>
          <div>
            <span>{address}</span>
            <Map
              className="map"
              google={this.props.google}
              style={mapStyles}
              center={{
                lat: lat,
                lng: lng,
              }}
              onClick={this.onMapClicked}
              zoom={15}
              onReady={this.fetchPlaces}
              visible={this.state.googleVisible} >
              <Marker
                title="Location"
                id={1}
                position={{
                  lat: lat,
                  lng: lng,
                  }}
                draggable={true}
                // onMouseover={onMouseoverMarker}
                // onClick={onMarkerClick}
                onDragend={this.moveMarker}
              />
            </Map>
          </div>
          <Form
            onSubmit={this.handleSubmit}
            style={{ position: "absolute", top: "528px", width: "100%" }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() => {
                      this.props.continue({ page: 5, step: 1 });
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
                    That's correct
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

const WrappedApp = Form.create({ name: "coordinated" })(LocationConfirmation);
// const mapState = state => {
//   return { formInfo: state.adventureForm };
// };
//export default connect(mapState)(WrappedApp);
export default GoogleApiWrapper({
  apiKey: GEOCODE_KEY,
})(WrappedApp);