import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Row, Col, Form, Button, Icon, Calendar, Spin } from "antd";
import { adventrueForm } from "../../store/adventureForm/actions";
import { $axios } from "../../lib/http-service";
import { getAdvFormEditData } from "../../lib/utils/utility";

class CalendarPage extends React.Component {
  state = {
    selectedMonth: moment().month(),
    isPevBtnDisable: true,
    selectedDates: [],
    loading: true,
  };
  componentDidMount() {
    this.getEditData();
  }
  getEditData() {
    getAdvFormEditData().then((resp) => {
      let selectedDates = [];
      if (resp && resp["calenderVOList"].length > 0) {
        for (let key in resp["calenderVOList"]) {
          selectedDates.push(resp["calenderVOList"][key]["blockDate"]);
        }
      }
      this.setState({
        selectedDates: selectedDates,
        loading: false,
      });
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const next = this.props.continue;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let calenderParamList = [];
        let selectedDates = this.state.selectedDates;
        if (selectedDates.length > 0) {
          for (let key in selectedDates) {
            calenderParamList.push({
              blockDate: selectedDates[key],
            });
          }
        }
        let params = {};
        let _this = this;
        let property_id = this.props.formInfo["propertyId"];
        let url = "properties/" + property_id + "/calendar";
        params["calenderParamList"] = calenderParamList;
        $axios.put(url, JSON.stringify(params)).then(function (resp) {
          if (resp && resp.status == 200) {
            _this.props.dispatch(adventrueForm("calendar", property_id));
            next({ page: 10, step: 3, data: resp });
            //Router.push({ pathname: "/become-a-host/price-space" });
          }
        });
      }
    });
  };

  onSelect = (value) => {
    let date = value.format("YYYY-MM-DD");
    let selectedDates = this.state.selectedDates;
    let check = false;
    if (selectedDates.length > 0) {
      check = selectedDates.includes(date);
    }
    if (check) {
      var index = selectedDates.indexOf(date);
      if (index !== -1) selectedDates.splice(index, 1);
    } else {
      selectedDates.push(date);
    }
    this.setState({
      selectedDates: selectedDates,
    });
  };

  disabledDate(value) {
    const valueDate = value.format("YYYY-MM-DD");
    //const currentFirstDate = moment().startOf("month").format("YYYY-MM-DD");
    const currentFirstDate = moment().format("YYYY-MM-DD");
    // const dow = moment(valueDate).format("dddd");
    // if (dow == "Sunday") {
    //   return true;
    // }
    if (valueDate >= currentFirstDate) {
      return false;
    }
    return true;
  }
  render() {
    const {
      selectedMonth,
      selectedDates,
      isPevBtnDisable,
      loading,
    } = this.state;
    return (
      <Spin spinning={loading} tip="Loading..." style={{ maxWidth: "1166px" }}>
        <div className="process">
          <div>
            <h2>Let's update the calendar</h2>
            <p className="small">Your guests will see the calendar and book available days. Please select dates to block or unblock.</p>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Calendar
                fullscreen={true}
                disabledDate={this.disabledDate}
                onSelect={this.onSelect}
                dateFullCellRender={(value) => {
                  const valueDate = value.format("YYYY-MM-DD");
                  // console.log("=====valueDate=====", valueDate)
                  // const currentFirstDate = moment()
                  //   .startOf("month")
                  //   .format("YYYY-MM-DD");
                  const currentFirstDate = moment().format("YYYY-MM-DD");
                  let a = value.date();
                  let check = false;
                  // let date = value.format("YYYY-MM-DD");
                  // const dow = moment(date).format("dddd");
                  if (selectedDates && selectedDates.length > 0) {
                    check = selectedDates.includes(valueDate);
                  }
                  let styleDate = {};
                  let styleValue = { color: "#231f1f" };
                  if (check) {
                    styleDate = { backgroundColor: "#ede" };
                  }
                  if (!(valueDate >= currentFirstDate)) {
                    styleDate = { backgroundColor: "#ddd" };
                  }
                  // if (dow == "Sunday") {
                  //   styleValue = { color: "#ff0000" };
                  //   styleDate = { backgroundColor: "#388E3C" };
                  // }
                  return (
                    <div className="ant-fullcalendar-date" style={styleDate}>
                      <div className="ant-fullcalendar-value">
                        <span style={styleValue}>{a}</span>
                      </div>
                      <div className="ant-fullcalendar-content"></div>
                    </div>
                  );
                }}
                headerRender={({ value, type, onChange, onTypeChange }) => {
                  const selectedDate = value.format("YYYY-MM-DD");
                  const currentDate = moment().format("YYYY-MM-DD");
                  const monthCount = moment(selectedDate).diff(
                    moment(currentDate),
                    "months",
                    true
                  );
                  const month = value.month();
                  const yearName = value.year();
                  const monthName = moment().month(month).format("MMMM");
                  return (
                    <div style={{ marginBottom: 20 }}>
                      <Button
                        disabled={monthCount == 0 ? true : false}
                        onClick={() => {
                          const newValue = value.clone();
                          let newMonth = selectedMonth - 1;
                          newValue.month(parseInt(newMonth, 10));
                          if (newMonth == -1) {
                            newMonth = 11;
                          }
                          this.setState({ selectedMonth: newMonth });
                          onChange(newValue);
                        }}
                      >
                        <Icon type="left"></Icon>
                      </Button>
                      <Button
                        disabled={monthCount > 22 ? true : false}
                        style={{ marginLeft: 5 }}
                        onClick={() => {
                          const newValue = value.clone();
                          let newMonth = selectedMonth + 1;
                          newValue.month(parseInt(newMonth, 10));
                          if (newMonth == 12) {
                            newMonth = 0;
                          }
                          this.setState({ selectedMonth: newMonth });
                          this.setState({ isPevBtnDisable: false });
                          onChange(newValue);
                        }}
                      >
                        <Icon type="right"></Icon>
                      </Button>
                      <strong style={{ marginLeft: 5 }}>
                        {monthName} {yearName}
                      </strong>
                      <Button
                        className="float-right"
                        onClick={() => {
                          const newValue = value.clone();
                          var daysInMonth = moment(newValue).daysInMonth();
                          while (daysInMonth) {
                            var current = moment(newValue).date(daysInMonth);
                            this.onSelect(current);
                            daysInMonth--;
                          }
                        }}
                      >
                        <span className="text-primary">Block full month</span>
                      </Button>
                    </div>
                  );
                }}
              />
            </Row>
            <Row className="mt-5">
              <Col span={12}>
                <Form.Item
                  wrapperCol={{ span: 6, offset: 0 }}
                  style={{ marginTop: "10px" }}
                >
                  <Button
                    type="link"
                    onClick={() => this.props.continue({ page: 8, step: 3 })}
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

const WrappedApp = Form.create({ name: "coordinated" })(CalendarPage);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
