import React, { useState, useEffect } from "react";
import { Button, DatePicker, Collapse, Modal } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import BookingCalc from "./../../booking/calculation/index";
import GuestCalc from "./../../booking/guest/index";
import LoginForm from "../../common/loginForm/login";
import Router from "next/router";
import moment from "moment";
import { encryption, decryption } from "../../../lib/utils/utility";
import s from "./style.module.css";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export default ({ data, _criteria }) => {
  const userInfo = useSelector((state) => state.auth);
  //const userInfo = StorageService.getUserInfo();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  let accommodatesCount = data["accommodatesCount"];
  let propertyAvailabilitySetting = data['propertyAvailabilitySetting'];
  const [criteria, setCriteria] = useState({
    dateRange: "",
    numberOfGuestsCount: 0,
    id: 0,
    guestInfo: "",
  });

  useEffect(() => {
    if (Router.query) {
      let __criteria = Router.query.criteria;
      let _dateRange = [];
      let _guestInfo = {}
      if (__criteria) {
        let _criteria = decryption(__criteria);

        _dateRange = _criteria['dateRange'];
        _guestInfo = _criteria['guestInfo'];
      }
      setCriteria({ ...criteria, dateRange: _dateRange, guestInfo: _guestInfo });
    }
  }, []);

  const loginUser = () => {
    locationBooking();
  };
  const onLoginClose = () => {
    setVisible(false);
    // if(isUrl) {
    //   locationBooking();
    // }
  };
  const showDrawer = () => {
    setVisible(true);
  };
  function getGuestCalc(adults, children, infants) {
    let guestInfo = {
      adults: adults,
      children: children,
      infants: infants,
    };
    setCriteria({ ...criteria, guestInfo: JSON.stringify(guestInfo) });
  }

  function locationBooking() {
    router.push({
      pathname: "/payments",
      query: { ...criteria, id: data["id"] },
    });
  }
  function handleBook() {
    if (!Object.keys(criteria["dateRange"]).length > 0) {
      alert("Please select check in and check out...");
      return false;
    }
    if (propertyAvailabilitySetting['minStayNight'] > criteria["numberOfGuestsCount"]) {
      alert("Please enter maximum night...");
      return false;
    }
    if (userInfo && Object.keys(userInfo).length > 0) {
      locationBooking();
    } else {
      setVisible(true);
    }
  }
  let _fromDate = criteria['dateRange'][0] ? criteria['dateRange'][0] : null
  let _toDate = criteria['dateRange'][1] ? criteria['dateRange'][1] : null
  let _guestInfoData = criteria['guestInfo'] ? JSON.stringify(criteria['guestInfo']) : ""
  return (
    <div className="booking">
      <h3 className={s["booking-card-head"]}>
        BDT  {data["price"]} <small className={s["booking-card-head-sub"]}>Per night</small>
      </h3>
      <RangePicker
        size="large"
        placeholder={["Check In", "  Check Out"]}
        separator={"→‎‎‎‎‎‎‎‎‎‎ "}
        suffixIcon={() => null}
        style={{ marginBottom: "1rem", width: "100%" }}
        value={_fromDate && [moment(_fromDate), _toDate && moment(_toDate)]}
        onChange={(d, e) => {
          let a = moment(e[0]);
          let b = moment(e[1]);
          let days = b.diff(a, "days");
          setCriteria({
            ...criteria,
            numberOfGuestsCount: days,
            //  dateRange: e.join("/"),
            dateRange: e
          });
        }}
        className={s["normal-text"]}
      />
      <GuestCalc
        data={{ accommodatesCount: accommodatesCount, guestInfo: _guestInfoData }}
        getGuestCalc={getGuestCalc}
      />
      <Collapse
        bordered={false}
        defaultActiveKey={["1"]}
        className="site-collapse-custom-collapse"
      >
        <Panel
          header="Price Details"
          key="1"
          className="site-collapse-custom-panel"
        >
          <BookingCalc
            data={{
              currencyName: data["currency"] && data["currency"].name,
              symbol: data["currency"] && data["currency"].symbol,
              price: data["price"],
              numberOfGuestsCount: criteria["numberOfGuestsCount"],
              feesForClearing: data["cleaningFee"],
            }}
          />
        </Panel>
      </Collapse>
      <Modal
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

        <LoginForm onLoginClose={onLoginClose} setLogin={loginUser} />
      </Modal>
      <LoginForm
        visible={visible}
        onLoginClose={onLoginClose}
        // showSignup={showSignup}
        setLogin={loginUser}
        showLogin={showDrawer}
      />
      <Button type="primary" size="large" block onClick={handleBook}>
        <b className={s["button-text"]}>Book Now</b>
      </Button>
    </div>
  );
};
