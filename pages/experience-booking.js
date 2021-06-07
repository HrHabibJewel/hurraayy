import React, { useState, useEffect,useLayoutEffect } from "react";
import { Button, Card, Row, Col, Icon, Modal, Divider,Spin } from "antd";
import { useRouter, Router } from "next/router";
import s from "../components/experienceDetailsPage/details-sections/style.module.css";
import * as icon from "../components/icons";
import { useSelector } from "react-redux";
import { $axios } from "../lib/http-service";
import Link from "next/link";
import { getAuthentication } from "../lib/utils/utility";
import moment from "moment";
import Footer from "../components/AppLayout/footer";
import payment from "../lib/payment";

export default () => {
  const router = useRouter();
  let userData = {};
  const data = router["query"];
  const guestInfo = JSON.parse(data["guestInfo"]);
  let userInfo = useSelector((state) => state.auth);
  const totalGuest = guestInfo["adults"] + guestInfo["children"];
  const pricePerGuest = parseFloat(data["pricePerGuest"]);
  const totalAmount = parseFloat(totalGuest * pricePerGuest).toFixed(2);
  const [visible, setVisible] = useState(false);
  const [cardHeight, setCardHeight]=useState("350px");
  const [cardMarginLeft, setCardMarginLeft] = useState("-15px");
  const [cardMarginRight, setCardMarginRight] = useState("0px");
  const [params, setParams] = useState({
    amountPaid: 0,
    cancelDate: 0,
    currency_id: 0,
    effectivePaid: 0,
    experience_calender_id: 0,
    experience_id: 0,
    feesForService: 0,
    feesForStay: 0,
    feesTotal: 0,
    numberOfAdults: 0,
    numberOfChildren: 0,
    numberOfGuestsCount: 0,
    numberOfInfants: 0,
    refund: false,
    refundPaid: 0,
  });
  const days = data["duration"];
  const [loading, setLoading] = useState(false);
  const [visiblePayment, setVisiblePayment] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const cardStyle = {
    minHeight: "282px;",
    height: cardHeight,
    boxShadow: "2px 5px 15px 3px rgba(208, 216, 243, 0.7)",
    borderRadius: "18px",
    marginLeft:"20px",
    marginRight:cardMarginRight
  };
  const cardStyle_mobile = {
    minHeight: "282px;",
    // height: "350px",
    boxShadow: "2px 5px 15px 3px rgba(208, 216, 243, 0.7)",
    borderRadius: "18px",
    marginTop:"20px",
    marginLeft:"-15px",//cardMarginLeft,
    marginRight:"15px"
  };
  const secondcardStyle_mobile = {
    minHeight: "282px;",
    // height: "350px",
    boxShadow: "2px 5px 15px 3px rgba(208, 216, 243, 0.7)",
    borderRadius: "18px",
    marginLeft:"15px",
    marginRight:"15px",
    marginTop:"20px"
  };
  useEffect(() => {
    //console.log("data", data);
    if (!getAuthentication()) {
      router.push("/");
    }
    getParams();
  }, []);
  useLayoutEffect(() => {
    function updateSize() {
      //console.log("window.innerWidth", window.innerWidth);
      setIsDesktop(window.innerWidth > 550 ? true : false);
      if(window.innerWidth > 764 && window.innerWidth < 910){
        setCardHeight("450px")
      }
      else if(window.innerWidth > 910 && window.innerWidth < 1140){
        setCardHeight("430px")
      }
      else if(window.innerWidth > 1140 && window.innerWidth < 1274){
        setCardHeight("400px")
      }
      else //if(window.innerWidth > 1274 && window.innerWidth < 910){
      {
          setCardHeight("350px")
      }
  
      if(window.innerWidth > 550 && window.innerWidth < 764){
        setCardMarginRight("20px");
      }
      else{
        setCardMarginRight("0px");
      }
      // if(window.innerWidth > 295 && window.innerWidth < 375){
      //   setCardMarginLeft("0px")
      // }
      // else{
      //   setCardMarginLeft("-15px")
      // }
    }
    window.addEventListener("resize", updateSize);
    
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function getParams() {
    let guestInfo = {};
    if (data["guestInfo"]) {
      guestInfo = JSON.parse(data["guestInfo"]);
    }
    setParams({
      ...params,
      amountPaid: 0,
      currency_id: 70,
      effectivePaid: 0,
      cancelDate: 0,
      experience_calender_id: data["scheduleId"],
      experience_id: data["id"],
      feesForService: totalAmount,
      feesTotal: totalAmount,
      numberOfAdults: guestInfo["adults"] ? guestInfo["adults"] : 0,
      numberOfChildren: guestInfo["children"] ? guestInfo["children"] : 0,
      numberOfGuestsCount: totalGuest,
      numberOfInfants: guestInfo["infants"] ? guestInfo["infants"] : 0,
    });
  }

  const closeModal = () => {
    setVisible(false);
  };

  const closePaymentModal = () => {
    setVisiblePayment(false);
  };

  function handleBooking() {
    setLoading(true)
    // if (!(userInfo && Object.keys(userInfo).length > 0)) {
    //   userInfo = JSON.parse(data["userInfo"]);
    // }
    // if (typeof userInfo["userInfo"] === "object") {
    //   userData = userInfo["userInfo"];
    // } else {
    //   userData = JSON.parse(userInfo["userInfo"]);
    // }
    $axios
      .post("experience_bookings", JSON.stringify(params))
      .then(function (resp) {
        if (resp && resp.status == 201) {
          //console.log("book resp", resp);
          // setVisible(true);
          let callingObj = {
            bookingCode: resp.data.bookingCode,
            bookingType: "EXPERIENCE",
            paidAmount: resp.data.feesTotal
          }
          $axios
            .post("payment", JSON.stringify(callingObj))
            .then(function (paymentResp) {
              
              if (paymentResp && paymentResp.status == 200) {
                let obj = {};
                // obj = JSON.parse(paymentResp.data.body);
                obj = paymentResp.data;
                // setInitiatePayment(obj);
                window.location.href = obj.data;
                // payment.OpenModal(
                //   obj.GatewayPageURL,
                //   obj.storeLogo
                // );
                // payment.OpenModal(obj.redirectGatewayURL, obj.storeLogo);
                setLoading(false)
              }
              else{
                setLoading(false)
                setVisiblePayment(true);
              }
            });
        }
      });
  }

  return (
    <Spin className="booking" spinning={loading} tip="Loading...">
      <Row style={{marginTop:10}}>
        <Col md={24}>
          <Link href="/">
            <a>
              <img
                style={{ width: 38, marginLeft: "15px" }}
                src="../images/logo.png"
              />
            </a>
          </Link>
        </Col>
      </Row>
      <Row >
        <Col md={12} offset={2}>
          <Row>
            <Col md={24} className="mb-3">
              <Card 
              style={isDesktop? cardStyle:cardStyle_mobile}
              >
                <div
                  className="ant-card-body"
                  // style={{ paddingLeft: "80px", paddingRight: "80px" }}
                  style = {isDesktop ? { paddingLeft: "80px", paddingRight: "80px",padding:"24px" }:{padding:"12px"}}
                >
                  {/* <h4 className="title-2x">Explore the lagoons of the Nevado de Toluca volcano</h4> */}
                  <p className="title-2x" style={{ fontWeight: "500px",fontFamily:"Heebo",color:"#333" }}>
                    {data["title"]}
                  </p>
                  <br />
                  <div>
                    <table className="table table-borderless c-table">
                      <tbody>
                        <tr>
                          <td width="8%">{icon.calender}</td>
                          {/* <td colSpan={2}>Dec 16, 2020</td> */}
                          
                          {data.dateRange[0] === "" ? (
                            <td colSpan={2} style={{fontFamily:"Heebo",color:"#333",fontWeight:"400",fontSize:"14px"}}>
                              
                                {moment(data.blockDate).format("MMM")}&nbsp;
                                {moment(data.blockDate).format("DD")}, &nbsp;
                                {moment(data.blockDate).format("YYYY")}
                              
                            </td>
                          ) : (
                            <td colSpan={2} style={{fontFamily:"Heebo",color:"#333",fontWeight:"400",fontSize:"14px"}}>
                              
                                {moment(data.blockDate).format("MMM")}&nbsp;
                                {moment(data.blockDate).format("DD")}, &nbsp;
                                {moment(data.blockDate).format("YYYY")}
                              
                            </td>
                          )}
                          
                        </tr>
                        <tr>
                          <td>{icon.clockOne}</td>
                          <td colSpan={2} style={{fontFamily:"Heebo",color:"#333",fontWeight:"400",fontSize:"14px"}}>
                            {days} hours
                          </td>
                        </tr>
                        <tr>
                          <td>{icon.person}</td>
                          <td style={{fontFamily:"Heebo",color:"#333",fontWeight:"400",fontSize:"14px"}}>
                            {totalGuest} Guest X ৳ {pricePerGuest}
                          </td>
                          <td style={{fontFamily:"Heebo",color:"#333",fontWeight:"400",fontSize:"14px"}}>
                            ৳ {totalAmount}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3}>
                            <span className="hr"></span>
                          </td>
                        </tr>
                        <tr>
                          <th>&nbsp;</th>
                          <th style={{fontFamily:"Heebo",color:"#333",fontWeight:"600",fontSize:"14px"}}>Total</th>
                          <th style={{ color: "#ff6304" }}>৳ {totalAmount}</th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </Col>
            <Col md={24}>
              <p className="text-center" 
              style={isDesktop ? {
                fontFamily: "Heebo",
                color: "#333",
                fontWeight: "400",
                fontSize: "14px",
              } : {
                fontFamily: "Heebo",
                color: "#333",
                fontWeight: "400",
                fontSize: "14px",
                marginLeft:"-15px",
                marginRight:"15px"
              }}
              >
                By proceeding you confirm that you agree to our{" "}
                <a href="https://hurraayy.com/terms" style={{color:"#ff6204"}}>terms & conditions, refund policy</a> and{" "}
                <a href="https://hurraayy.com/terms" style={{color:"#ff6204"}}>privacy policy</a>.
              </p>
            </Col>
            <Col md={24} className="text-center">
              <Button
                type="primary"
                onClick={() => handleBooking()}
                style={isDesktop ? {
                  width: "350px",
                  height: "40px",
                  borderRadius: "6px",
                } : {
                  width: "350px",
                  height: "40px",
                  borderRadius: "6px",
                  marginLeft:"-15px",
                  marginRight:"15px"
                }}
                className="text-center"
              >
                <span style={{fontFamily:'Heebo', fontSize:14,fontWeight:600}}>Proceed To Pay</span>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col md={8}>
          <Card style={isDesktop? cardStyle : secondcardStyle_mobile}>
            <div className="section mb-4" style={{ position: "relative",marginTop:"25px" }}>
              <div className={s["title-head"]}>
                <span className={s["title-left"]}>&nbsp;</span>
                <b className={s["title"]}>Why Hurraayy?</b>
              </div>
              <div style={{ marginLeft: "25px" }}>
                <ul class="list-unstyled">
                  <li>
                    {isDesktop? (
                      <div className="row">
                      <div className="col-sm-1">
                      <Icon type="check" style={{ color: "red" }} />{" "}
                      </div>
                      <div className="col-sm-11">
                      Payments are handled by secure platform
                      </div>
                    </div>
                    ):
                    (<div>
                    <Icon type="check" style={{ color: "red" }} />{" "}
                    Payments are handled by secure platform
                  </div>)}
                    
                    {/* &nbsp; */}
                  </li>
                  <li>
                    {isDesktop? (
                      <div className="row">
                      <div className="col-sm-1">
                      <Icon type="check" style={{ color: "red" }} />
                      </div>
                      <div className="col-sm-11">
                      Our hosts are experts in their domain
                      </div>
                    </div>
                    ):
                    (
                    <div> 
                      <Icon type="check" style={{ color: "red" }} />&nbsp;
                      Our hosts are experts in their domain
                    </div>
                    )}
                    
                     {/* &nbsp; */}
                  </li>
                  <li>
                    {isDesktop? (
                      <div className="row">
                      <div className="col-sm-1">
                      <Icon type="check" style={{ color: "red" }} />
                      </div>
                      <div className="col-sm-11">
                      Packages are designed to give you excellent experiences
                      </div>
                    </div>
                    ):
                    (
                    <div>
                      <Icon type="check" style={{ color: "red" }} />&nbsp;
                      Packages are designed to give you excellent experiences
                    </div>
                    )}
                  
                    {/* {" "} 
                    &nbsp; */}
                  </li>
                  <li>
                    {isDesktop? (
                      <div className="row">
                      <div className="col-sm-1">
                      <Icon type="check" style={{ color: "red" }} />
                      </div>
                      <div className="col-sm-11">
                      Best price guranteed
                      </div>
                    </div>
                    ):
                    (
                      <div>
                      <Icon type="check" style={{ color: "red" }} />&nbsp;
                      Best price guranteed
                    </div>
                    )}
                  
                     {/* &nbsp; */}
                  </li>
                  <li>
                    {isDesktop? (
                      <div className="row">
                      <div className="col-sm-1">
                      <Icon type="check" style={{ color: "red" }} />
                      </div>
                      <div className="col-sm-11">
                      24/hours live support
                      </div>
                    </div>
                    ):
                    (
                    <div>
                      <Icon type="check" style={{ color: "red" }} />&nbsp;
                      24/hours live support
                    </div>
                    )}
                  
                     {/* &nbsp; */}
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </Col>
        <Modal
          title={null}
          closable={true}
          onCancel={closeModal}
          visible={visible}
          footer={null}
          // onOk={Router.push({pathname:"/hosting/listings"})}
        >
          <b>
            {/* Hi {userData["name"]}, your booking has been successful. Thank you */}
            Hi, your booking has been successful. Thank you
            for using Hurraayy.{" "}
          </b>
          <br />
          <br />
          <p>
            Please check your email, we have sent booking details along with
            host contacts, location, access details etc. You can check your
            upcoming trips from Trips section.{" "}
          </p>
          <Button
            type="primary"
            style={{ margin: "0 auto", display: "block", marginBottom: "20px" }}
            onClick={() => {
              router.push({ pathname: "/trips" });
            }}
          >
            Go to Trips
          </Button>
          <p>
            If you have further question or if you need our assistance then
            please do not hesitate to contact us through our chat support.{" "}
          </p>
          <p>Thank you once again. </p>
        </Modal>
        <Modal
          title={null}
          closable={false}
          onCancel={closePaymentModal}
          visible={visiblePayment}
          footer={null}
          width="650px"
        >
          <b>
            {/* Hi {userData["name"]}, your booking is on the way.{" "} */}
            Hi, your booking is on the way.{" "}
          </b>
          <br />
          <br />
          <p>
            But we need some more information about you. Please update your account information. Like, phone number, e-mail address, home address etc.{" "}
          </p>
          <Button
            type="primary"
            style={{
              margin: "0 auto",
              display: "block",
              marginBottom: "20px",
            }}
            onClick={() => {
              router.push({ pathname: "/account" });
            }}
          >
            Go to Account
          </Button>
          <p>
            If you have further question or if you need our assistance then
            please do not hesitate to contact us through our chat support.{" "}
          </p>
          <p>Thank you once again. </p>
        </Modal>
      </Row>
      {/* <Divider className="footer-separator" /> */}
      <Divider style={{marginBottom:"20px" }}/>
      <footer>
        <Footer />
      </footer>
    </Spin>
  );
};
