import React from "react";
import { connect } from "react-redux";
import TextChange from "../ui/form/textChange";
import { Row, Col, Form, Select, Button, Icon, Spin } from "antd";
//
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

const { Option } = Select;

class BedRoom extends React.Component {
  state = {
    guest_count: 2,
    bedroom_count: 0,
    bed_count: 2,
    bedDropDownList: [],
    bedRoomlist: [],
    bedTypes: {},
    sleepingArrangements: {},
    editBedType: [],
    editTotalBed: [],
    loading: true,
  };

  componentDidMount() {
    this.getEditData().then((res) => {
      this.getBedType();
      this.getbedRoomlist();
    });
  }
  async getEditData() {
    await getAdvFormEditData().then((resp) => {
      if (resp) {
        if (resp["bedroomCount"]) {
          this.setState({
            bedroom_count: parseInt(resp["bedroomCount"]),
          });
        }
        if (resp["bedCount"]) {
          this.setState({
            bed_count: resp["bedCount"],
          });
        }
        if (resp["accommodatesCount"]) {
          this.setState({
            guest_count: resp["accommodatesCount"],
          });
        }
        /*      edit bed list */
        let propertyBedsList = [];
        let totalBed = [];
        let uniqBed = [];
        let i = 0;
        if (resp["propertyBedsList"].length > 0) {
          resp["propertyBedsList"].map((item, key) => {
            if (!uniqBed[item["bed_room_id"]]) {
              i = 0;
              propertyBedsList[item["bed_room_id"]] = [];
              propertyBedsList[item["bed_room_id"]][i] = {
                bed_type_id: item["bed_type"]["id"],
                bed_room_id: item["bed_room_id"],
                bedCount: item["bedCount"],
              };
              totalBed[item["bed_room_id"]] = parseInt(item["bedCount"]);
            } else {
              i++;
              propertyBedsList[item["bed_room_id"]][i] = {
                bed_type_id: item["bed_type"]["id"],
                bed_room_id: item["bed_room_id"],
                bedCount: item["bedCount"],
              };
              totalBed[item["bed_room_id"]] += parseInt(item["bedCount"]);
            }
            uniqBed[item["bed_room_id"]] = true;
          });
        }
        //console.log("==", propertyBedsList);
        //console.log("==", totalBed);
        this.setState({
          editBedType: propertyBedsList,
        });
        this.setState({
          editTotalBed: totalBed,
        });
      }
    });
  }
  getBedType() {
    let _this = this;
    $axios.get("/bed_types").then((resp) => {
      if (resp && resp.status == 200) {
        let dataList = resp.data;
        let dataPush = {};
        const { editTotalBed, bedroom_count, editBedType } = this.state;
        if (dataList.length > 0) {
          for (let key in dataList) {
            dataPush[key] = {
              id: dataList[key]["id"],
              name: dataList[key]["name"],
              textName: "text_" + dataList[key]["id"],
              isActive: false,
              isDefaultShow: key >= 3 ? false : true,
              val: 0,
            };
          }
        }
        _this.setState({
          bedTypes: dataPush,
          loading: false
        });
        let sleepingArrangements = {};
        sleepingArrangements = {
          [0]: {
            key: 0,
            name: "Common areas",
            status: editTotalBed[0] ? 3 : 1,
            totalBed: editTotalBed[0] ? editTotalBed[0] : 0,
            bedTypes: this.state.bedTypes,
          },
        };
        _this.setState({
          sleepingArrangements: sleepingArrangements,
        });
        if (editTotalBed.length > 0) {
          this.onChangeBedRooms(bedroom_count);
          this.setEditBedType();
        }
      }
    });
  }
  setEditBedType() {
    const { sleepingArrangements, editBedType } = this.state;
    // console.log("=========", sleepingArrangements)
    // console.log("====editBedType====", editBedType)
    // if(Object.keys(sleepingArrangements).length > 0) {
    //   for(let key in sleepingArrangements) {
    //     console.log("key", sleepingArrangements[key]['bedTypes']['id'])
    //     editBedType[key]
    //     console.log("key1", editBedType[key])
    //   }
    // }
  }

  getbedRoomlist() {
    let bedRooms = [];
    for (let i = 0; i < 11; i++) {
      let bedRoomName = (i == 1) ? " Bedroom " : " Bedroom ";
      let _name = i == 0 ? "Studio" : bedRoomName + i;
      bedRooms.push({
        id: i,
        name: _name,
        status: 1,
        bedTypes: [],
      });
    }
    this.setState({
      bedRoomlist: bedRooms,
      //loading:false
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const next = this.props.continue;
        let property_id = this.props.formInfo["propertyId"];
        let _this = this;
        let url = "properties/" + property_id + "/bedrooms";
        let params = {};
        let sleepingArrangements = [];
        params["bed_count"] = this.state.bed_count.toString();
        params["bedroom_count"] = this.state.bedroom_count.toString();
        params["guest_count"] = this.state.guest_count.toString();

        let sa = this.state.sleepingArrangements;
        if (Object.keys(sa).length > 0) {
          for (let key in sa) {
            let bt = sa[key]["bedTypes"];
            if (Object.keys(bt).length) {
              for (let key2 in bt) {
                if (bt[key2]["val"]) {
                  sleepingArrangements.push({
                    bed_room_id: sa[key]["key"],
                    bedCount: bt[key2]["val"],
                    bed_type_id: bt[key2]["id"],
                    name: bt[key2]["name"],
                  });
                }
              }
            }
          }
        }
        params["sleepingArrangements"] = sleepingArrangements;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("bed-rooms", property_id));
            next({ page: 4, step: 1, data: resp });
            //Router.push({ pathname: "/become-a-host/bath-rooms" });
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

  bedTypeCount = (val, name, type, keys) => {
    let _keys = keys.split("_");
    let key = _keys[0];
    let key1 = _keys[1];
    let _totalBed = this.state.sleepingArrangements[key]["totalBed"];
    this.setState({
      sleepingArrangements: {
        ...this.state.sleepingArrangements,
        [key]: {
          ...this.state.sleepingArrangements[key],
          ["totalBed"]: type == 1 ? _totalBed + 1 : _totalBed - 1,
          ["bedTypes"]: {
            ...this.state.sleepingArrangements[key]["bedTypes"],
            [key1]: {
              ...this.state.sleepingArrangements[key]["bedTypes"][key1],
              ["val"]: val,
            },
          },
        },
      },
    });
  };

  bedTypeIsShow = (keys) => {
    let _keys = keys.split("_");
    let key = _keys[0];
    let key1 = _keys[1];
    this.setState({
      sleepingArrangements: {
        ...this.state.sleepingArrangements,
        [key]: {
          ...this.state.sleepingArrangements[key],
          ["bedTypes"]: {
            ...this.state.sleepingArrangements[key]["bedTypes"],
            [key1]: {
              ...this.state.sleepingArrangements[key]["bedTypes"][key1],
              ["isDefaultShow"]: true,
            },
          },
        },
      },
    });
  };

  doneBed = (key) => {
    this.state.sleepingArrangements[key].status = 3;
    this.forceUpdate();
  };
  onChangeBedRooms = (bedroom) => {
    this.state.bedroom_count = bedroom;
    const { editTotalBed } = this.state;
    for (let i = 0; i <= bedroom; i++) {
      if (!this.state.sleepingArrangements[i]) {
        let bedRoomName = (i == 1) ? "Bedroom" : "Bedroom";
        this.state.sleepingArrangements[i] = {
          key: i,
          name: bedRoomName + " " + i,
          status: editTotalBed[i] ? 3 : 1,
          totalBed: editTotalBed[i] ? editTotalBed[i] : 0,
          bedTypes: this.state.bedTypes,
        };
      }
    }
    this.forceUpdate();
  };
  addBedRoom = (key) => {
    this.state.sleepingArrangements[key].status = 2;
    this.forceUpdate();
  };
  addBedRoomView(item, key) {
    const bedTypes1 = item["bedTypes"];
    let _this = this;
    return (
      <div key={key}>
        <Col span={24}>
          <div className="edit_beds">
            <div className="left">
              <h3>{item["name"]}</h3>
              <span>{item["totalBed"]} {(item["totalBed"] == 1 || item["totalBed"] == 0) ? 'bed' : 'beds'}</span>
            </div>
            <div className="right">
              <Button onClick={() => _this.doneBed(key)}>Done</Button>
            </div>
          </div>
        </Col>
        {Object.keys(bedTypes1).length > 0 &&
          Object.keys(bedTypes1).map((key1) => {
            let btItem = bedTypes1[key1];
            if (btItem["isDefaultShow"]) {
              let textName = key + "_" + btItem["textName"];
              return (
                <Col span={24} key={key1}>
                  <Form.Item>
                    <TextChange
                      labelName={btItem["name"]}
                      textName={textName}
                      isActive={btItem["isActive"]}
                      val={btItem["val"]}
                      index={key + "_" + key1}
                      textChange={_this.bedTypeCount}
                    />
                  </Form.Item>
                </Col>
              );
            }
          })}
        <Col span={14}>
          <Form.Item>
            <Select onChange={this.bedTypeIsShow} placeholder="Add another bed">
              {Object.keys(bedTypes1).length > 0 &&
                Object.keys(bedTypes1).map((key1) => {
                  let btItem = bedTypes1[key1];
                  if (!btItem["isDefaultShow"]) {
                    let keys = key + "_" + key1;
                    return (
                      <Option key={key1} value={keys}>
                        {btItem["name"]}
                      </Option>
                    );
                  }
                })}
            </Select>
          </Form.Item>
        </Col>
      </div>
    );
  }
  bedRoomView(item, key) {
    return (
      <Col span={24} key={key}>
        <div className="edit_beds add_beds">
          <div className="left">
            <h3>{item["name"]}</h3>
            <span>0 bed</span>
          </div>
          <div className="right">
            <Button onClick={() => this.addBedRoom(key)}>Add beds</Button>
          </div>
        </div>
      </Col>
    );
  }

  addBedRoomEdit(item, key) {
    const bedTypes1 = item["bedTypes"];
    return (
      <Col span={24} key={key}>
        <div className="edit_beds add_beds">
          <div className="left">
            <h3>{item["name"]}</h3>
            <span>{item["totalBed"]} {(item["totalBed"] == 1 || item["totalBed"] == 0) ? 'bed' : 'beds'}</span>
            <br />
            {Object.keys(bedTypes1).length > 0 &&
              Object.keys(bedTypes1).map((key1) => {
                if (bedTypes1[key1]["val"]) {
                  return (
                    <span key={key1}>
                      {bedTypes1[key1]["val"] +
                        " " +
                        bedTypes1[key1]["name"] +
                        " ,"}
                    </span>
                  );
                }
              })}
          </div>
          <div className="right">
            <Button onClick={() => this.addBedRoom(key)}>Edit beds</Button>
          </div>
        </div>
      </Col>
    );
  }

  render() {
    let { bedRoomlist, sleepingArrangements, bedroom_count, loading } = this.state;
    // console.log("===", sleepingArrangements);
    let sleeping;
    sleeping =
      Object.keys(sleepingArrangements).length &&
      Object.keys(sleepingArrangements).map((key) => {
        let item = sleepingArrangements[key];
        if (bedroom_count >= key) {
          if (item["status"] == 1) {
            return this.bedRoomView(item, key);
          } else if (item["status"] == 2) {
            return this.addBedRoomView(item, key);
          } else if (item["status"] == 3) {
            return this.addBedRoomEdit(item, key);
          }
        }
      });
    return (
      <Spin spinning={loading} tip="Loading...">
        <div className="accoommodation">
          <div>
            <h2>Number of guests accommodated by the property</h2>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  <TextChange
                    labelName="Guests"
                    textName="guest_count"
                    val={this.state.guest_count}
                    textChange={this.setStateFunc}
                  />
                </Form.Item>
              </Col>
              <Col span={14}>
                <p>How many bedrooms for your guests?</p>
                <Form.Item>
                  <Select
                    onChange={this.onChangeBedRooms}
                    value={this.state.bedroom_count}
                  >
                    {bedRoomlist.length > 0 &&
                      bedRoomlist.map((item, key) => {
                        return (
                          <Option value={item["id"]} key={key}>
                            {item["name"]}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <p>In total how many beds are there?</p>
                <Form.Item>
                  <TextChange
                    labelName="Beds"
                    textName="bed_count"
                    val={this.state.bed_count}
                    textChange={this.setStateFunc}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <h5>Rooms and beds</h5>
                <p>Please mention how many beds in each room</p>
              </Col>
              {sleeping}
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
                      this.props.continue({ page: 2, step: 1 });
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

const WrappedApp = Form.create({ name: "coordinated" })(BedRoom);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};

export default connect(mapState)(WrappedApp);
