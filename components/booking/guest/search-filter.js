import React, { useState, useEffect } from "react";
import { Button, Icon } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import TextChange from "../../ui/form/textChange";
import s from "./style.module.css";
import * as icon from "../../../components/icons";

export default ({ data, getGuestCalc }) => {
  let _guest = data["accommodatesCount"];
  // console.log("===search filters===", data)
  // let _guestInfo = data["guestInfo"];
  let _size = data["size"] ? data["size"] : "default";
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [show, setShow] = useState(false);

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
    if (data["guestInfo"]) {
      setAdults(data["guestInfo"]["adults"] ? data["guestInfo"]["adults"] : 0);
      setChildren(
        data["guestInfo"]["children"] ? data["guestInfo"]["children"] : 0
      );
      setInfants(
        data["guestInfo"]["infants"] ? data["guestInfo"]["infants"] : 0
      );
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
      getGuestCalc(val, children, infants);
    }
    if (name == "children") {
      b = val;
      if (type == 1) {
        setDecreaseChildrenDisabled(false);
      }
      setChildren(val);
      getGuestCalc(adults, val, infants);
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
      getGuestCalc(adults, children, val);
    }
    if (type == 0) {
      setIncreaseInfantsDisabled(false);
    }
    if (_guest < val) {
      setIncreaseInfantsDisabled(true);
    }
  }
  return (
    <div>
      <Button
        size={_size}
        className="text-left"
        style={{ padding: "5px", border: "none", boxShadow: "none" }}
        block
        onClick={() => setShow(!show)}
      >
        {/* <UserOutlined /> */}
        {icon.user_fill}
        &nbsp;
        {_size == "large" && (
          <span style={{ position: "absolute", marginLeft: "5px", fontFamily:'Heebo', fontSize:"13px",fontWeight:"600",color:"#808080"  }}>
            {adults + children == 0 ? "" : adults + children}{" "}
            {adults + children > 1 ? "Guests" : "Guest"}
          </span>
        )}
        {_size == "default" && (
          <span style={{ position: "absolute", marginLeft: "5px", fontFamily:'Heebo', fontSize:"13px",fontWeight:"600",color:"#808080"  }}>
            {adults + children == 0 ? "Guests" : "  " + (adults + children)}
          </span>
        )}
        <p onClick={() => setShow(!show)} style={{
            fontSize: "10px",
            position: "absolute",
            marginLeft: "90px",
            marginTop: "-22px",
          }}>
        <DownOutlined
          
        />
        </p>
        
      </Button>
      {show && (
        <div className={s["guest-calc-drop"]} style={{ width: "300px" }}>
          <div style={{marginTop:"20px"}}>
            <TextChange
              labelName="Adults"
              textName="adults"
              decreaseDisabled={decreaseAdultsDisabled}
              increaseDisabled={increaseAdultsDisabled}
              val={adults}
              textChange={onChangeGuest}
            />
          </div>
          <br/>
          <div>
            <TextChange
              labelName="Children"
              // spanLabelName="Ages 2–12"
              textName="children"
              decreaseDisabled={decreaseChildrenDisabled}
              increaseDisabled={increaseChildrenDisabled}
              val={children}
              textChange={onChangeGuest}
            />
            <span>Ages 2–12</span>
          </div>
          <br/>
          <div>
            <TextChange
              labelName="Infants"
              // spanLabelName="Under 2"
              increaseDisabled={increaseInfantsDisabled}
              textName="infants"
              val={infants}
              textChange={onChangeInfants}
            />
            <span className="small">Under 2</span>
          </div>
          
          <div className="text-right" style={{marginBottom:"20px"}}>
            <Button onClick={() => setShow(!show)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};
