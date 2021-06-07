import { Menu, Row, DatePicker, Col, Input, Radio, Select, Button } from "antd";
import s from "./style.module.css";
import { Fragment, useState, useEffect, useLayoutEffect } from "react";
import AutoCompleteSearch from "./autoCompleteSearch";
const { Option } = Select;
const { Search } = Input;
import moment from "moment";
import * as icon from "../../../components/icons";
import {
  RangeDatePicker,
  SingleDatePicker,
} from "react-google-flight-datepicker";
const SubMenu = Menu.SubMenu;
const { RangePicker } = DatePicker;

import GuestCalc from "./../../booking/guest/search-filter";
import { DownOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
export default ({ type = 1 }) => {
  const [hurraayyType, setHurraayyType] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [criteria, setCriteria] = useState({
    dateRange: ["", ""],
    hurraayyType: 1,
    guestInfo: {
      adults: 0,
      children: 0,
      infants: 0,
    },
  });

  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsDesktop(window.innerWidth > 550 ? true : false);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [isTrue, setIsTrue] = useState(null);
  const [hideDateButton, setHideDateButton] = useState(null);
  const [hideRangePicker, setHideRangePicker] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleHurraayyType(val) {
    setHurraayyType(val.target.value);
    setCriteria({ ...criteria, hurraayyType: val.target.value });
  }
  const getGuestCalc = (adults, children, infants) => {
    setCriteria({ ...criteria, guestInfo: { adults, children, infants } });
  };

  let _fromDate = criteria["dateRange"][0] ? criteria["dateRange"][0] : null;
  let _toDate = criteria["dateRange"][1] ? criteria["dateRange"][1] : null;
  function openRangePicker() {
    // setHideDateButton(true);
    // setHideRangePicker(false);
    // setIsTrue(true);

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
    setHideDateButton(false);
    setHideRangePicker(true);
  }

  function onDateChange(e, e1) {
    // console.log("eeee", e, e1);
    var _momentFrom = moment(e).format("YYYY-M-D");
    var _momentTo = moment(e1).format("YYYY-M-D");
    // console.log("mm", mm);
    setCriteria({
      ...criteria,
      dateRange: [_momentFrom, _momentTo],
    });
  }
  function handleOpen() {
    setIsOpen(!isOpen);
  }
  return (
    <div className="container">
      <div className="hero-section">
        <div className="d-flex mb-2 row">
          {isDesktop ? (
            <div className={s["search-menu"] + " col-md-7"}>
              <Radio.Group
                onChange={handleHurraayyType}
                value={hurraayyType}
                size="small"
              >
                <Radio.Button value={1}>Accommodations</Radio.Button>
                <Radio.Button value={2}>Adventures</Radio.Button>
                <Radio.Button value={3}>Experiences</Radio.Button>
              </Radio.Group>
            </div>
          ) : (
            ""
          )}

          <div className="col-md-5" 
          // style={{marginLeft:isDesktop?-30:0}}
          >
            <div className="row" >
              <div className={s["date-and-guest"]}>
                <div className={s["dates"]}>
                  {isDesktop ? (
                    <div>
                      {hideRangePicker ? (
                        <Button
                          onClick={openRangePicker}
                          style={{ border: "none", boxShadow: "none" }}
                          hidden={hideDateButton}
                        >
                          {icon.calender} &nbsp;
                          
                          {_fromDate != null ? (
                           <span style={{
                            position: "absolute",
                            marginLeft: "5px",
                            fontFamily: "Heebo",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#808080",
                          }}>
                            {_fromDate && [
                              moment(_fromDate).format("MMM") +
                                " " +
                                moment(_fromDate).format("DD") +" " +
                                "-" +" " +
                                moment(_toDate).format("MMM") +
                                " " +
                                moment(_toDate).format("DD"),
                            ]}
                          </span>
                          ) : (
                            <span
                              style={{
                                position: "absolute",
                                marginLeft: "5px",
                                fontFamily: "Heebo",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#808080",
                              }}
                            >
                              Dates
                            </span>
                          )}{" "}
                          {
                            <DownOutlined
                              style={{
                                fontSize: "10px",
                                position: "absolute",
                                marginLeft: "110px",
                                marginTop: "5px",
                              }}
                            />
                          }
                        </Button>
                      ) : (
                        <RangePicker
                          open={isTrue}
                          placeholder={["Start", "End"]}
                          separator={"→‎‎‎‎‎‎‎‎‎‎ "}
                          suffixIcon={() => null}
                          value={
                            _fromDate && [
                              moment(_fromDate),
                              _toDate && moment(_toDate),
                            ]
                          }
                          onChange={(d, e) => {
                            setCriteria({
                              ...criteria,
                              dateRange: e,
                            });
                            setHideDateButton(false);
                            setHideRangePicker(true);
                            setIsTrue(false);
                          }}
                          onMouseLeave={myHandler}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="row" style={{marginLeft:-25}}>
                        <Menu mode={"horizontal"}>
                          <SubMenu
                            title={
                              <Button shape="round">
                                Options
                              </Button>
                            }
                            style={{ width: 90 }}
                          >
                            <Menu.Item>
                              <div className={s["search-menu"] + " col-md-12"} style={{padding:0}}>
                                <Radio.Group
                                  onChange={handleHurraayyType}
                                  value={hurraayyType}
                                  size="small"
                                >
                                  <Radio.Button value={1}>
                                    Accommodations
                                  </Radio.Button>
                                  <Radio.Button value={2}>
                                    Adventures
                                  </Radio.Button>
                                  <Radio.Button value={3}>
                                    Experiences
                                  </Radio.Button>
                                </Radio.Group>
                              </div>
                            </Menu.Item>
                          </SubMenu>
                        </Menu>
                        <Button
                          onClick={openRangePicker}
                          // style={{ border: "none", boxShadow: "none" }}
                          hidden={hideDateButton}
                          style={{ border: "none", boxShadow: "none",marginLeft: 15, marginTop: 15 }}
                        >
                          {icon.calender} &nbsp;
                          {_fromDate != null ? (
                          <span style={{
                            position: "absolute",
                            marginLeft: "5px",
                            fontFamily: "Heebo",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#808080",
                          }}>
                            {_fromDate && [
                              moment(_fromDate).format("MMM") +
                                " " +
                                moment(_fromDate).format("DD") 
                                // "-" +
                                // moment(_toDate).format("MMM") +
                                // " " +
                                // moment(_toDate).format("DD"),
                            ]}<br/>
                            {_fromDate && [
                             
                                "-" +
                                moment(_toDate).format("MMM") +
                                " " +
                                moment(_toDate).format("DD"),
                            ]}
                          </span>
                          
                            
                          ) : (
                            <span
                              style={{
                                position: "absolute",
                                marginLeft: "5px",
                                fontFamily: "Heebo",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#808080",
                                marginTop:2
                              }}
                            >
                              Dates
                            </span>
                          )}{" "}
                          {
                            <DownOutlined
                              style={{
                                fontSize: "10px",
                                position: "absolute",
                                marginLeft: "60px",
                                marginTop: "7px",
                              }}
                            />
                          }
                        </Button>
                        {hideRangePicker ? (
                          ""
                        ) : (
                          <RangePicker
                            open={isTrue}
                            placeholder={["Start", "End"]}
                            separator={"→‎‎‎‎‎‎‎‎‎‎ "}
                            suffixIcon={() => null}
                            value={
                              _fromDate && [
                                moment(_fromDate),
                                _toDate && moment(_toDate),
                              ]
                            }
                            onChange={(d, e) => {
                              setCriteria({
                                ...criteria,
                                dateRange: e,
                              });
                              setHideDateButton(false);
                              setHideRangePicker(true);
                              setIsTrue(false);
                            }}
                            onMouseLeave={myHandler}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {isDesktop ? (
                <div className={s["date-and-guest"]}>
                  <GuestCalc
                    data={{ accommodatesCount: 20 }}
                    getGuestCalc={getGuestCalc}
                    className="row"
                  />
                </div>
              ) : (
                <div
                  className="row"
                  // className={s["date-and-guest"]}
                  style={{ marginLeft: 35, marginTop: 15 }}
                >
                  <GuestCalc
                    data={{ accommodatesCount: 20 }}
                    getGuestCalc={getGuestCalc}
                    className="row"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex row">
          <Col
            span={24}
            className={s["search-bar"]}
            style={{ position: "sticky" }}
          >
            <AutoCompleteSearch
              hurraayyType={hurraayyType}
              criteria={criteria}
              style={{ boxShadow: "none", border: "none" }}
            />
          </Col>
        </div>
      </div>
    </div>

    // <div className="container">
    //   <div className="hero-section">
    //     <div>
    //       <div className="d-flex mb-2 row">
    //         <div className={s["search-menu"] + " col-md-7"}>
    //           <Radio.Group
    //             onChange={handleHurraayyType}
    //             value={hurraayyType}
    //             size="small"
    //           >
    //             <Radio.Button
    //               value={1}
    //             >
    //               Accommodations
    //             </Radio.Button>
    //             <Radio.Button
    //               value={2}
    //             >
    //               Adventures
    //             </Radio.Button>
    //             <Radio.Button
    //               value={3}
    //             >
    //               Experiences
    //             </Radio.Button>
    //           </Radio.Group>
    //         </div>
    //         <div className={"col-md-5"}>
    //           {/* <GetDropDown /> */}
    //           <div className="row" style={{marginTop:"5px"}}>
    //             <div className={s["dates"]}
    //             //className="col-md-6"
    //             >
    //               <Button
    //                 onClick={openRangePicker}
    //                 style={{ border: "none", boxShadow: "none" }}
    //                 hidden={hideDateButton}
    //                 // className={s["search-menu"]}
    //                 // prefix={icon.calender}
    //                 // value={
    //                 //   _fromDate != null
    //                 //     ? _fromDate && [
    //                 //       moment(_fromDate).format('MMM') +" "+ moment(_fromDate).format('DD') +
    //                 //       "-" +
    //                 //       moment(_toDate).format('MMM') +" "+ moment(_toDate).format('DD')
    //                 //       ]
    //                 //     : "Dates"
    //                 // }
    //                 // suffix={<DownOutlined style={{ fontSize: "10px" }} />}
    //               >
    //                 {icon.calender} &nbsp;
    //                 {_fromDate != null ? (
    //                   _fromDate && [
    //                     moment(_fromDate).format("MMM") +
    //                       " " +
    //                       moment(_fromDate).format("DD") +
    //                       "-" +
    //                       moment(_toDate).format("MMM") +
    //                       " " +
    //                       moment(_toDate).format("DD"),
    //                   ]
    //                 ) : (
    //                   <span style={{ position: "absolute", marginLeft: "5px", fontFamily:'Heebo', fontSize:"13px",fontWeight:"600",color:"#808080"}}>
    //                     Dates
    //                   </span>
    //                 )}{" "}
    //                 {
    //                   <DownOutlined
    //                     style={{
    //                       fontSize: "10px",
    //                       position: "absolute",
    //                       marginLeft: "50px",
    //                       marginTop: "5px",
    //                     }}
    //                   />
    //                 }
    //               </Button>
    //               {hideRangePicker ? (
    //                 ""
    //               ) : (
    //                 <RangePicker
    //                   open={isTrue}
    //                   placeholder={["Start", "End"]}
    //                   separator={"→‎‎‎‎‎‎‎‎‎‎ "}
    //                   suffixIcon={() => null}
    //                   value={
    //                     _fromDate && [
    //                       moment(_fromDate),
    //                       _toDate && moment(_toDate),
    //                     ]
    //                   }
    //                   onChange={(d, e) => {
    //                     setCriteria({
    //                       ...criteria,
    //                       dateRange: e,
    //                     });
    //                     setHideDateButton(false);
    //                     setHideRangePicker(true);
    //                     setIsTrue(false);
    //                   }}
    //                   onMouseLeave={myHandler}
    //                 />
    //               )}
    //             </div>
    //             <div
    //               className="col-md-6"
    //               style={{paddingLeft: "5px" }}
    //             >
    //               <GuestCalc
    //                 data={{ accommodatesCount: 20 }}
    //                 getGuestCalc={getGuestCalc}
    //                 className="row"
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <Col span={24} className="mt-0" style={{ position: "sticky" }}>
    //         <AutoCompleteSearch
    //           hurraayyType={hurraayyType}
    //           criteria={criteria}
    //           style={{ boxShadow: "none", border: "none" }}
    //         />
    //       </Col>
    //     </div>
    //   </div>
    // </div>
  );
};
