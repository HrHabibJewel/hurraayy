import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Form, Button, Icon, Calendar } from "antd";

class CalendarPage extends React.Component {
  state = {
    value: moment("2020-04-15"),
    selectedValue: moment("2020-05-15"),
    selectedMonth: moment().month(),
    isPevBtnDisable: true,
    selectedDates: [],
  };
  componentDidMount() {
    let selectedDates = [];
    this.props["propsVal"];
    if (this.props["propsVal"] && this.props["propsVal"].length > 0) {
      this.props["propsVal"].map((item, key) => {
        selectedDates.push(item["blockDate"]);
      });
    }
    this.setState({
      selectedDates: selectedDates,
    });
  }

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
    const currentFirstDate = moment().startOf("month").format("YYYY-MM-DD");
    const dow = moment(valueDate).format("dddd");
    if (dow == "Sunday") {
      return true;
    }
    if (valueDate >= currentFirstDate) {
      return false;
    }
    return true;
  }
  render() {
    const { selectedMonth, selectedDates } = this.state;
    return (
      <Calendar
        disabledDate={this.disabledDate}
        // onSelect={this.onSelect}
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
            styleDate = { backgroundColor: "#FF5722" };
          }
          if (!(valueDate >= currentFirstDate)) {
            styleDate = { backgroundColor: "#ddd" };
          }
          return (
            <div className="ant-fullcalendar-date" style={styleDate}>
              <div className="ant-fullcalendar-value ">
                <span style={styleValue}>{a}</span>
              </div>
              <div className="ant-fullcalendar-content"></div>
            </div>
          );
        }}
        headerRender={({ value, type, onChange }) => {
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
            <div
              className="text-left"
              style={{ margin: "20px 0", paddingLeft: 20 }}
            >
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
              <strong style={{ marginLeft: 5 }}>
                {monthName} {yearName}
              </strong>
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
            </div>
          );
        }}
      />
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(CalendarPage);
const mapState = (state) => {
  return { formInfo: state.adventureForm };
};
export default connect(mapState)(WrappedApp);
