import React, { Fragment, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  DatePicker,
  Button,
  Menu,
  Icon,
  Divider,
  Table,
  Calendar,
  Spin,
  Form,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { $axios } from "../../../lib/http-service";
import s from "../style.module.css";
import moment from "moment";

const { SubMenu } = Menu;
let propSelected = "";
const PropertyListUserCalender = () => {
  const [PropertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedProperties, setProperties] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    getPropertyList();
  }, []);
  const getPropertyList = () => {
    $axios.get("properties/property_list").then((resp) => {
      if (resp && resp.status == 200) {
        // console.log("property list", resp.data);
        setPropertyList(resp.data);
      }
      setLoading(false);
    });
  };
  const selectProperty = (value) => {
    setProperties(value.key);
    propSelected = value.key;
    $axios.get('properties/' + value.key).then((resp) => {
      if (resp && resp.status == 200) {
        let dateList = [];
        let calender = [];
        if (resp.data["calenderVOList"]) {
          calender = resp.data["calenderVOList"];
        }
        calender.forEach(element => {
          dateList.push(element.blockDate);

        });
        setSelectedDates(dateList);
      }
    })
  };
  // const updateDate = (value) => {
  //   const valueDate = value.format("YYYY-MM-DD");
  //   console.log("previous Dates", selectedDates);
  //   console.log("new dates", valueDate);

  //   // {"calenderParamList":[{"blockDate":"2021-01-31"},
  //   var obj = {
  //     calenderParamList: [],
  //   };
  //   var selectedDates2 = [];
  //   for (let i = 0; i < selectedDates.length; i++) {
  //     var obj2 = {};
  //     obj2 = selectedDates[i];
  //     selectedDates2.push(obj2);
  //   }

  //   selectedDates2.push(valueDate);
  //   console.log("transfer", selectedDates2);

  //   let calenderParamList = [];
  //   let selectedDates3 = selectedDates2;
  //   if (selectedDates3.length > 0) {
  //     for (let key in selectedDates3) {
  //       calenderParamList.push({
  //         blockDate: selectedDates3[key],
  //       });
  //     }
  //   }
  //   obj.calenderParamList = calenderParamList;
  //   //console.log("req", JSON.stringify(obj));
  //   $axios
  //     .put("properties/" + propSelected + "/calendar", JSON.stringify(obj))
  //     .then((resp) => {
  //       if (resp && resp.status == 200) {
  //         //console.log("response", resp);
  //         setProperties({ key: resp.id });
  //       }
  //     });
  // };

  const updateDate = (value) => {
    const valueDate = value.format("YYYY-MM-DD");
    let calenderList = [];

    selectedDates.push(valueDate);
    selectedDates.forEach(element => {
      var dateObj = {
        blockDate: element
      }
      calenderList.push(dateObj);
    });

    let obj = {
      calenderParamList: calenderList
    }

    obj = JSON.stringify(obj);

    $axios.put('properties/' + propSelected + '/calendar', obj).then((resp) => {
      if (resp && resp.status == 200) {
        selectProperty({ key: propSelected });
      }
    })

  }
  const disabledDate = (value) => {
    const valueDate = value.format("YYYY-MM-DD");
    // console.log("selectedDates", selectedDates);
    if (selectedDates.includes(valueDate)) {
      return true;
    }

    const currentFirstDate = moment().format("YYYY-MM-DD");
    if (!(valueDate >= currentFirstDate)) {
      return true;
    }
    return false;
  };
  return (
    <div className="row">
      <div className="col-sm-12 col-md-5 col-lg-5">
        {/* <Divider>
          <h6 className="text-center">Listings</h6>
        </Divider> */}
        <Menu
          mode="vertical"
          className={s.menuPanel}
          onClick={selectProperty}>
          {/* <p className="normal-text-bold text-center">Listings</p> */}
          <p className={s.headingText}>Listings</p>
          {PropertyList.map((experience) => {
            return (
              <Menu.Item className={s.menubuttonList} key={experience.id} className={s.menubuttonList}>
                {/* <p className="normal-text">{experience.name}</p> */}
                <p>{experience.name}</p>
              </Menu.Item>
            );
          })}
          {/* <Menu
            mode="vertical"
            defaultSelectedKeys={["basicInfo"]}
            className={s.menuPanel}
          >
            <Menu.Item className={s.menubutton} key="basicInfo">
              <b>Basic Information</b>
            </Menu.Item>
          </Menu> */}
        </Menu>
        {/* <Menu mode="inline">
          {PropertyList.length > 0 &&
            PropertyList.map((item, key) => {
              return (
                <Menu.Item key={key} value={item.id}>
                  {item.name}
                </Menu.Item>
              );
            })}
        
        </Menu> */}
      </div>
      <div className="col-sm-12 col-md-7 col-lg-7">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">

            <div className="pt-2 pb-5 pr-md-3 pl-md-3 ">
              <div className={s["propertyCalender"]}>
                <div>
                <p className={s.headingText}>
                    Calendar
                    </p>
                  <p className="normal-text-bold pt-2 pb-2">
                    Choose when to host. Select a property from the listings. Then click on a date in the calendar to block or unblock. Guests won't be able to book on blocked dates. By default all days are unblocked
                  </p>
                </div>

                <div 
                //className="p-md-5"
                >
                  <Card >
                    {/* <Calendar fullscreen={false} /> */}
                    {propSelected ? (
                      <Calendar
                        fullscreen={false}
                        onSelect={updateDate}
                        disabledDate={disabledDate}
                        dateFullCellRender={(value) => {
                          const valueDate = value.format("YYYY-MM-DD");
                          const currentFirstDate = moment()
                            .startOf("month")
                            .format("YYYY-MM-DD");
                          let a = value.date();
                          let check = false;
                          let date = value.format("YYYY-MM-DD");
                          if (selectedDates && selectedDates.length > 0) {
                            check = selectedDates.includes(date);
                          }
                          let styleDate = { height: 35 };
                          let styleValue = { color: "#231f1f" };
                          if (check) {
                            styleDate = { backgroundColor: "#FFD0B4" };
                          }

                          return (
                            <div
                              className="ant-fullcalendar-date"
                              style={styleDate}
                            >
                              <div className="ant-fullcalendar-value ">
                                <span style={styleValue}>{a}</span>
                              </div>
                              <div className="ant-fullcalendar-content"></div>
                            </div>
                          );
                        }}
                      />
                    ) : null}
                  </Card>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form.create()(PropertyListUserCalender);
