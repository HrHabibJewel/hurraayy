import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import TextChange from "../../../components/ui/form/textChange";
import OutsideClickHandler from "react-outside-click-handler";
import s from "./style.module.css";
import * as icon from "../../icons";

export default ({ data, getGuestCalc }) => {
  let _guest = data["accommodatesCount"];
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [show, setShow] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  const [decreaseAdultsDisabled, setDecreaseAdultsDisabled] = useState(true);
  const [increaseAdultsDisabled, setIncreaseAdultsDisabled] = useState(false);
  const [decreaseChildrenDisabled, setDecreaseChildrenDisabled] = useState(
    true
  );
  const [increaseChildrenDisabled, setIncreaseChildrenDisabled] = useState(
    false
  );

  const [increaseInfantsDisabled, setIncreaseInfantsDisabled] = useState(false);
  useEffect(() => {
    if (data["guestInfo"] && isMounted) {
      let guestInfo = JSON.parse(data["guestInfo"]);
      setAdults(guestInfo["adults"] ? guestInfo["adults"] : 1);
      setChildren(guestInfo["children"] ? guestInfo["children"] : 0);
      setInfants(guestInfo["infants"] ? guestInfo["infants"] : 0);
      setIsMounted(false);
    }
  });
  function onChangeGuest(val, name, type) {
    let a = 1;
    let b = 0;
    if (name == "adults") {
      a = val;
      if (type == 1) {
        setDecreaseAdultsDisabled(false);
      }
      setAdults(val);
    }
    if (name == "children") {
      b = val;
      if (type == 1) {
        setDecreaseChildrenDisabled(false);
      }
      setChildren(val);
    }
    let totalGuest = a + b;
    if (type == 0) {
      setIncreaseAdultsDisabled(false);
      setIncreaseChildrenDisabled(false);
    }
    if (_guest == totalGuest) {
      setDecreaseAdultsDisabled(false);
      setIncreaseAdultsDisabled(true);
      setIncreaseChildrenDisabled(true);
    }
  }
  function onChangeInfants(val, name, type) {
    if (name == "infants") {
      setInfants(val);
    }
    if (type == 0) {
      setIncreaseInfantsDisabled(false);
    }
    if (_guest < val) {
      setIncreaseInfantsDisabled(true);
    }
  }
  return (
    <div className="position-relative text-center">
      <Button
        size="large"
        className="text-left"
        block
        onClick={() => setShow(!show)}
      >
        <div className="row">

          <div className="col">
            {icon.user_fill}
          </div>
          <div className="col text-center">
            <b style={{ paddingLeft: "5px", textAlign: "center", alignSelf: "center" }} className={s["normal-text"]}>{adults + children} {(adults + children) > 1 ? "Guests" : "Guest"}{infants != 0 && ", " + infants + " infants"}{" "}</b>
          </div>
          <div className="col">
            <DownOutlined style={{ position: "absolute", top: 5, right: 15 }} />
          </div>
        </div>
      </Button>
      <OutsideClickHandler
        onOutsideClick={() => {
          getGuestCalc(adults, children, infants);
        }}
      >
        {show && (
          <div className={s["guest-calc-drop"]}>
            <div>
              <TextChange
                labelName="Adults"
                textName="adults"
                decreaseDisabled={decreaseAdultsDisabled}
                increaseDisabled={increaseAdultsDisabled}
                val={adults}
                textChange={onChangeGuest}
              />
            </div>
            <div>
              <TextChange
                labelName="Children"
                spanLabelName="Ages 2–12"
                textName="children"
                decreaseDisabled={decreaseChildrenDisabled}
                increaseDisabled={increaseChildrenDisabled}
                val={children}
                textChange={onChangeGuest}
              />
            </div>
            <div>
              <TextChange
                labelName="Infants"
                spanLabelName="Under 2"
                increaseDisabled={increaseInfantsDisabled}
                textName="infants"
                val={infants}
                textChange={onChangeInfants}
              />
            </div>
            <div className="text-right">
              <Button className={s["normal-text"]} onClick={() => setShow(!show)}>Close</Button>
            </div>
          </div>
        )}
      </OutsideClickHandler>
    </div>
  );
};
