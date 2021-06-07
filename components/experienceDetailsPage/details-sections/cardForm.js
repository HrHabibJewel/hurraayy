import React, { useState, useEffect } from "react";
import { Button, DatePicker, Collapse, Modal, Card } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import GuestCalc from "./../../booking/guest/index";
import LoginForm from "../../common/loginForm/login";
import { $openAxios } from "../../../lib/http-service";
import Router from "next/router";
import moment from "moment";
import { encryption, decryption } from "../../../lib/utils/utility";
import s from "./style.module.css";

const { RangePicker } = DatePicker;

export default ({ data }) => {
  const userInfo = useSelector((state) => state.auth);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [scheduleVisible, setScheduleVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [criteria, setCriteria] = useState({
    dateRange: "",
    numberOfGuestsCount: 0,
    id: 0,
    guestInfo: "",
    pricePerGuest: 0,
    duration: 0
  });
  const [schedule, setSchedule] = useState([]);
  const [scheduleForPopUp, setScheduleForPopUp] = useState([]);
  let accommodatesCount = data["accommodatesCount"];

  useEffect(() => {
    // let x = document.getElementsByClassName("ant-modal-header");
    // if (x.length > 0) {
    //   x[0].style.borderBottom = "0";
    // }

    getSchedule();
    if (Router.query) {
      let __criteria = Router.query.criteria;
      let _dateRange = [];
      let _guestInfo = {}
      if (__criteria) {
        let _criteria = decryption(__criteria);

        _dateRange = _criteria['dateRange'];
        _guestInfo = _criteria['guestInfo'];
      }
      else{
        _dateRange = ["", ""]
      }
      setCriteria({ ...criteria, dateRange: _dateRange, guestInfo: _guestInfo });
    }
    
  }, []);

  const getSchedule = (dateRange = [], popUp = 0) => {
    let id = 0;
    if (router["query"] && router["query"]["id"]) {
      id = router["query"]["id"];
    }
    let params = {};
    if (dateRange.length > 0) {
      params["startDate"] = dateRange[0];
      params["endDate"] = dateRange[1];
    }
    $openAxios.get("experience-open/experience/" + id + "/schedule", { params: params }).then((resp) => {
      if (resp.status == 200) {
        // setSchedule(resp['data']);
        // console.log("sch", resp.data);
        if(popUp == 0){
          setSchedule(resp["data"]);
        }
        else{
          setScheduleForPopUp(resp["data"]);
        }
        setScheduleVisible(true)
        // if (resp['data'].length == 0) {
        //   setScheduleModalVisible(false)
        // }
      }
    })
  }

  const onLoginClose = () => {
    setVisible(false);
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const loginUser = () => {
    //  locationBooking();
  };

  function getGuestCalc(adults, children, infants) {
    let guestInfo = {
      adults: adults,
      children: children,
      infants: infants,
    };
    // console.log("data", data);
    setCriteria({ ...criteria, guestInfo: JSON.stringify(guestInfo), pricePerGuest: data['pricePerGuest'], duration: data['duration'] });
  }
  function handleBook(id = 0, blockDate = "", title = "", startDate = "", endDate = "") {
    // if (criteria["dateRange"] && criteria["dateRange"][0] == "") {
    //   alert("Please select check in and check out...");
    //   return false;
    // }
    //console.log(title);
    if (userInfo && Object.keys(userInfo).length > 0) {

      router.push({
        pathname: "/experience-booking",
        query: {
          ...criteria,
          id: data["id"],
          scheduleId: id,
          blockDate: blockDate,
          userInfo: JSON.stringify(userInfo),
          title: title,
          startDate: startDate,
          endDate: endDate
        },
      });
    } else {
      setVisible(true);
    }
  }

  function onChangeDate(d, e) {
    let a = moment(e[0]);
    let b = moment(e[1]);
    let days = b.diff(a, "days");
    setCriteria({ ...criteria, numberOfGuestsCount: days, dateRange: e });
    getSchedule(e,0)
  }

  function getScheduleData() {
    if (criteria["dateRange"] && !criteria["dateRange"][0]) {
      alert("Please select check in and check out...");
      return false;
    }
    setScheduleModalVisible(true)
    getSchedule(criteria["dateRange"],1)
  }
  function getMoreDatesData() {
    setScheduleModalVisible(true)
    getSchedule([],1);
  }

  let _fromDate = criteria['dateRange'][0] ? criteria['dateRange'][0] : null
  let _toDate = criteria['dateRange'][1] ? criteria['dateRange'][1] : null
  let _guestInfoData = criteria['guestInfo'] ? JSON.stringify(criteria['guestInfo']) : ""
  return (
    <div className="booking">
      <h3 className={"title text-center", s["booking-card-head"]}>
        BDT {data["pricePerGuest"]} <small className={s["booking-card-head-sub"]}>Per person</small>
      </h3>
      <RangePicker
        size="large"
        placeholder={["From                 ", "  To"]}
        separator={"    →‎‎‎‎‎‎‎‎‎‎    "}
        suffixIcon={() => null}
        value={_fromDate && [moment(_fromDate), _toDate && moment(_toDate)]}
        style={{ marginBottom: "1rem", width: "100%", textAlign: "center" }}
        // onChange={(d, e) => {
        //   let a = moment(e[0]);
        //   let b = moment(e[1]);
        //   let days = b.diff(a, "days");
        //   setCriteria({
        //     ...criteria,
        //     numberOfGuestsCount: days,
        //     //dateRange: e.join("/"),
        //     dateRange: e,
        //   });
        // }}
        onChange={(d, e) => onChangeDate(d, e)}
        className={s["normal-text"]}
      />
      <GuestCalc
        data={{ accommodatesCount: accommodatesCount, guestInfo: _guestInfoData }}
        getGuestCalc={getGuestCalc}
      />
      {/* <Modal
        title={
          <Button className="border-0" icon="left">
            Back
          </Button>
        }
        // wrapClassName="modal-login"
        visible={visible}
        // onOk={this.handleOk}
        onCancel={() => setVisible(false)}
        //closeIcon={<Icon type="left" />}
        footer={null}
        wrapClassName="border-modal"
      >
        
        <LoginForm onLoginClose={onLoginClose} setLogin={loginUser}/>
      </Modal> */}
      <LoginForm
        visible={visible}
        onLoginClose={onLoginClose}
        // showSignup={showSignup}
        setLogin={loginUser}
        showLogin={showDrawer}
      />
      <Button type="primary" className="mb-1" size="large" block onClick={() => getScheduleData()}>
        <b className={s["button-text"]}>Check Options</b>
      </Button>
      {/* <Button type="primary" className="mb-1" size="large" block onClick={ () => setScheduleVisible(!scheduleVisible) }>
         Check Options
      </Button> */}

      { scheduleVisible && (
        <div>
          {
            schedule && schedule.length > 0 && schedule.map((item, key) => {
              let month = moment(item['blockDate']).format('MMMM')
              let day = moment(item['blockDate']).format('DD')
              // console.log("a",item['blockDate']);
              if (key <= 2) {
                return (
                  <Card key={key} size="small" className="my-1 rounded py-1" bodyStyle={{ padding: '0px 4px 0px' }}>
                    <div className="row">
                      <div className="col-4 text-center">
                        <p className="m-0">
                          <strong className={"d-block", s["normal-text-bold"]}>{day}</strong><br />
                          <strong className={"d-block", s["normal-text-bold"]}>{month}</strong>
                          {/* <small className="d-block">Starts 9am</small> */}
                        </p>
                      </div>
                      <div className="col-8 my-auto">
                        <Button style={{
                          borderRadius: '40px',
                          paddingLeft: "30px",
                          paddingRight: "30px",
                          backgroundColor: "white",
                          color: "#717171",
                          borderColor: "#cdcdcd",
                          fontWeight: "600"
                        }}
                          onClick={() => handleBook(
                            item['id'],
                            item['blockDate'],
                            item.experience.title,
                            item['startDate'],
                            item['endDate']
                          )}
                          type="primary" className="mt-1 float-right" size="small">
                          Let's go!</Button>
                        {/* <p className="m-0 px-2 py-1 rounded border text-center">Count me in!</p> */}
                      </div>
                    </div>
                  </Card>
                )
              }
            })
          }
          <Button type="primary" className="mt-1" size="large" block 
          // onClick={() => setScheduleModalVisible(true)}
          onClick={() => getMoreDatesData()}
          >
            <b className={s["button-text"]}>More Dates</b>
          </Button>

          <Modal
            title={
              <p className={s["moldal-title"]}>Upcoming Dates</p>
            }
            // wrapClassName="modal-login"
            visible={scheduleModalVisible}
            // onOk={this.handleOk}
            onCancel={() => setScheduleModalVisible(false)}
            //closeIcon={<Icon type="left" />}
            footer={null}
            wrapClassName="border-modal-2"
            bodyStyle={{ paddingTop: '0px' }}
            width={800}
          >
            {
              scheduleForPopUp &&
              scheduleForPopUp.length > 0 &&
              scheduleForPopUp.map((item, key) => {
                let month = moment(item['blockDate']).format('MMMM')
                let day = moment(item['blockDate']).format('DD')
                return (
                  <div className="row" key={key} style={{ borderBottom: "1px solid #ddd", padding: "8px 0px" }}>
                    <div className="col-6 float-left ">
                      <div className="float-left pl-5">
                        <p className="m-0 text-center">
                          <strong className={"d-block", s["normal-text-bold"]}>{day}</strong><br />
                          <strong className={"d-block", s["normal-text-bold"]}>{month}</strong>
                          {/* <small className="d-block">Starts 9am</small> */}
                        </p>
                      </div>
                    </div>
                    <div className="col-6 my-auto">
                      <div className="float-right pr-5">
                        <Button style={{ borderRadius: "40px", paddingLeft: "30px", paddingRight: "30px" }} onClick={() => handleBook(item['id'], item['blockDate'], item.experience.title, item['startDate'], item['endDate'])} type="primary" className="mt-1" size="small">
                          Let's go!</Button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </Modal>
        </div>
      )
      }

    </div>
  );
};
