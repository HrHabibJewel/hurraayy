import { Icon, Input, DatePicker, Button } from "antd";
import Router from "next/router";
import React, { useState, useEffect, useLayoutEffect } from "react";
import s from "./style.module.css";
import moment from "moment";
const { RangePicker } = DatePicker;
import GuestCalc from "./../../booking/guest/search-filter";
import * as icon from "../../../components/icons";
import { DownOutlined } from "@ant-design/icons";
import { encryption, decryption } from "../../../lib/utils/utility";

export default (props) => {
  const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
  const [isDesktop, setIsDesktop] = useState(false);
  const [criteria, setCriteria] = useState({
    search: "",
    dateRange: ["", ""],
    hurraayyType: 1,
    guestInfo: {
      adults: 0,
      children: 0,
      infants: 0,
    },
  });

  const _style = { paddingLeft: "5px", paddingRight: "5px", marginTop: "15px" };
  const [hideRangePicker, setHideRangePicker] = useState(null);
  const [isTrue, setIsTrue] = useState(null);
  useEffect(() => {
    let _search = "";
    let _dateRange = [];
    let _guestInfo = {};
    if (Router.query && Router.query.search) {
      let queryArr = decryption(Router.query.search);
      _search = queryArr[0];
      _dateRange = queryArr[1]["dateRange"];
      _guestInfo = queryArr[1]["guestInfo"];
    }

    setCriteria({
      ...criteria,
      search: _search,
      dateRange: _dateRange,
      guestInfo: _guestInfo,
    });
  }, []);
  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsDesktop(window.innerWidth > 550 ? true : false);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  function onChange(event) {
    setCriteria({ ...criteria, search: event });
  }

  function handleSearch() {
    props.searchChange(criteria);
  }
  const getGuestCalc = (adults, children, infants) => {
    let _guestInfo = {
      adults: adults,
      children: children,
      infants: infants,
    };
    setCriteria({ ...criteria, guestInfo: _guestInfo });
  };
  let _fromDate = criteria["dateRange"][0] ? criteria["dateRange"][0] : null;
  let _toDate = criteria["dateRange"][1] ? criteria["dateRange"][1] : null;
  function openRangePicker() {
    // setHideDateButton(true);
    setHideRangePicker(!hideRangePicker);
    setIsTrue(!isTrue);
  }
  useEffect(() => {
    // console.log("called");
    setHideRangePicker(true);
    // document.body.addEventListener("click", myHandler);
  }, []);
  function myHandler() {
    setIsTrue(false);
    // setHideDateButton(false);
    setHideRangePicker(true);
  }
  return (
    <div className="container">
      {isDesktop ? (
        <div className="row" style={{ marginLeft:5 }}>
          <div className="col-md-7" style={_style}>
            <Input
              value={criteria["search"]}
              prefix={icon.search}
              suffix={
                <span className="row" style={{ width: "370px" }}>
                  <Button
                    style={{
                      border: "none",
                      boxShadow: "none",
                      marginTop: "5px",
                    }}
                  >
                    {icon.line_vertical}
                  </Button>
                  <Button
                    onClick={openRangePicker}
                    style={{
                      border: "1px",
                      boxShadow: "none",
                      marginRight: "100px",
                      marginTop: "5px",
                    }}
                  >
                    {icon.calender} &nbsp;
                    {_fromDate != null ? (
                      _fromDate && [
                        <span
                          style={{
                            position: "absolute",
                            marginLeft: "0px",
                            fontFamily: "Heebo",
                            fontSize: "13px",
                            fontWeight: "600",
                            color:"#808080"
                          }}
                          onClick={openRangePicker}
                        >
                          {moment(_fromDate).format("MMM") +
                            " " +
                            moment(_fromDate).format("DD")}{" "}
                          {"-"}{" "}
                          {moment(_toDate).format("MMM") +
                            " " +
                            moment(_toDate).format("DD")}
                        </span>,
                      ]
                    ) : (
                      <span
                        style={{
                          position: "absolute",
                          marginLeft: "5px",
                          fontFamily: "Heebo",
                          fontSize: "13px",
                          fontWeight: "600",
                          color:"#808080"
                        }}
                        onClick={openRangePicker}
                      >
                        Dates
                      </span>
                    )}{" "}
                    {
                      <p
                        onClick={openRangePicker}
                        style={{
                          fontSize: "10px",
                          position: "absolute",
                          marginLeft: "125px",
                          marginTop: "-22px",
                        }}
                      >
                        <DownOutlined />
                      </p>
                    }
                  </Button>
                  <GuestCalc
                    data={{
                      accommodatesCount: 20,
                      size: "large",
                      guestInfo: criteria["guestInfo"],
                    }}
                    getGuestCalc={getGuestCalc}
                    style={{ marginRight: "30px" }}
                  />
                  <Button
                    onClick={handleSearch}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      marginTop: "5px",
                      marginLeft: "90px",
                    }}
                  >
                    {icon.right_arrow_tail}
                  </Button>
                </span>
              }
              // placeholder={placeHolder + "...."}
              placeholder={placeHolder}
              size="large"
              onChange={(e) => onChange(e.target.value)}
              style={{
                marginBottom: "1rem",
                height: "45px",
                position: "sticky",
              }}
            />
          </div>

          <div className="col-md-2" style={_style}></div>
          {/* <div className="col-md-2" style={_style}>
          <Button size="large" icon="search" onClick={handleSearch}>
            {" "}
            {icon.right_arrow_tail}
          </Button>
        </div> */}
        </div>
      ) : (
        <div>
          <div className="row">
            <span className="row" style={{
                position: "relative",
                marginLeft:10,
                marginTop:5
              }}>
              <Button
                onClick={openRangePicker}
                style={{
                  border: "1px",
                  boxShadow: "none",
                  marginRight: "100px",
                  marginTop: "5px",
                  color:"#808080"
                }}
              >
                {icon.calender} &nbsp;
                {_fromDate != null ? (
                  _fromDate && [
                    <span
                      style={{
                        position: "absolute",
                        marginLeft: "0px",
                        fontFamily: "Heebo",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                      onClick={openRangePicker}
                    >
                      {moment(_fromDate).format("MMM") +
                        " " +
                        moment(_fromDate).format("DD")}
                      {"-"}
                      {moment(_toDate).format("MMM") +
                        " " +
                        moment(_toDate).format("DD")}
                    </span>,
                  ]
                ) : (
                  <span
                    style={{
                      position: "absolute",
                      marginLeft: "5px",
                      fontFamily: "Heebo",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                    onClick={openRangePicker}
                  >
                    Dates
                  </span>
                )}{" "}
                {
                  <p
                    onClick={openRangePicker}
                    style={{
                      fontSize: "10px",
                      position: "absolute",
                      marginLeft: "125px",
                      marginTop: "-22px",
                    }}
                  >
                    <DownOutlined />
                  </p>
                }
              </Button>
              <GuestCalc
                data={{
                  accommodatesCount: 20,
                  size: "large",
                  guestInfo: criteria["guestInfo"],
                }}
                getGuestCalc={getGuestCalc}
                style={{ marginRight: "30px" }}
              />
            </span>
          </div>
          <div className="row">
            <div className="col-md-12" style={{ marginLeft: 8 }}>
              <Input
                value={criteria["search"]}
                prefix={icon.search}
                placeholder={placeHolder}
                size="large"
                onChange={(e) => onChange(e.target.value)}
                style={{
                  marginBottom: "1rem",
                  height: "45px",
                  position: "sticky",
                  width:"97%"
                }}
                suffix={
                  <Button
                    onClick={handleSearch}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      marginTop: "5px",
                      marginLeft: "90px",
                    }}
                  >
                    {icon.right_arrow_tail}
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      )}

      {hideRangePicker ? (
        ""
      ) : (
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-6" style={{ marginTop: "-50px" }}>
            <RangePicker
              open={isTrue}
              placeholder={["Start", "End"]}
              size="large"
              separator={"→‎‎‎‎‎‎‎‎‎‎ "}
              suffixIcon={() => null}
              value={
                _fromDate && [moment(_fromDate), _toDate && moment(_toDate)]
              }
              onChange={(d, e) => {
                setCriteria({
                  ...criteria,
                  dateRange: e,
                });
                // setHideDateButton(false);
                setHideRangePicker(true);
                setIsTrue(false);
              }}
              onMouseLeave={myHandler}
            />
          </div>
        </div>
      )}
    </div>
  );
};
