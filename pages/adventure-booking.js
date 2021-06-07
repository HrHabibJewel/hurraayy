import React, { useState, useEffect,useLayoutEffect } from "react";
import { Button, Card, Row, Col, Icon, Modal, Divider, Spin } from "antd";
import { useRouter, Router } from "next/router";
import s from "../components/adventureDetailsPage/details-sections/style.module.css";
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
  const [visiblePayment, setVisiblePayment] = useState(false);
  const [ownPayment, setOwnPayment] = useState(false);
  const [isSessionCreated, setIsSessionCreated] = useState(false);
  const [sessionData, setSessionData] = useState("");
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
  const [alert, setAlert] = useState(false);
  // const [initiatePayment, setInitiatePayment] = useState("");
  const [loading, setLoading] = useState(false);
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
    // console.log("data", data);
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
    console.log("getParams", data);
    if (data["guestInfo"]) {
      guestInfo = JSON.parse(data["guestInfo"]);
    }
    setParams({
      ...params,
      amountPaid: 0,
      currency_id: 70,
      effectivePaid: 0,
      cancelDate: 0,
      adventure_calender_id: data["scheduleId"],
      adventure_id: data["id"],
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
  const closeOwnPaymentModal = () => {
    setOwnPayment(false);
  };

  // function handleBooking() {
  //   setLoading(true);
  //   // setOwnPayment(true);
  //   let formData = new FormData();
  //   formData.append("store_id", "hurra600689ec9402c");
  //   formData.append("store_passwd", "hurra600689ec9402c@ssl");
  //   formData.append("total_amount", 100);
  //   formData.append("tran_id", "habib123");
  //   formData.append("cus_name", "habib");
  //   formData.append("cus_email", "habib.jewel86@gmail.com");
  //   formData.append("cus_add1", "Dhaka");
  //   formData.append("cus_city", "Dhaka");
  //   formData.append("cus_country", "Bangladesh");
  //   formData.append("cus_phone", "01813868986");
  //   formData.append("shipping_method", "NO");
  //   formData.append("product_name", "hurraayy");
  //   formData.append("product_category", "topup");
  //   formData.append("product_profile", "non-physical-goods");
  //   formData.append("success_url", "https://hurraayy.com");
  //   formData.append("fail_url", "https://hurraayy.com");
  //   formData.append("cancel_url", "https://hurraayy.com");

  //   $axios
  //     .post("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", formData)
  //     .then(function (resp) {
  //       if (resp && resp.data.status == "SUCCESS") {
  //         setLoading(false);
  //         console.log("transaction", resp);
  //         // setSessionData(resp.data)
  //         // setOwnPayment(true)
  //         let obj = {};
  //         obj = resp.data;
  //         console.log("obj", obj);
  //         payment.OpenModal(obj.GatewayPageURL, obj.storeLogo);
  //       }
  //     });
  // }

  function handleBooking() {
    setLoading(true)
    // console.log("userInfo",userInfo);
    // if (!(userInfo && Object.keys(userInfo).length > 0)) {
    //   userInfo = JSON.parse(data["userInfo"]);
    //   console.log("userInfo JSON", userInfo);
    // }
    // if (typeof userInfo["userInfo"] === "object") {
    //   userData = userInfo["userInfo"];
    // } else {
    //   userData = JSON.parse(userInfo["userInfo"]);
    // }
    // console.log("userData",userData);

    $axios
      .post("adventure_bookings", JSON.stringify(params))
      .then(function (resp) {
        if (resp && resp.status == 201) {
          console.log("book resp", resp);
          // setVisible(true);
          let callingObj = {
            bookingCode: resp.data.bookingCode,
            bookingType: "ADVENTURE",
            paidAmount: resp.data.feesTotal
          }
          $axios
            .post("payment", JSON.stringify(callingObj))
            .then(function (paymentResp) {

              if (paymentResp && paymentResp.status == 200) {
                let obj = {};
                obj = paymentResp.data;
                // setInitiatePayment(obj);

                // payment.OpenModal(
                //   obj.GatewayPageURL,
                //   obj.storeLogo
                // );
                // payment.OpenModal(obj.redirectGatewayURL, obj.storeLogo);
                // console.log("obj.GatewayPageURL",obj.GatewayPageURL);
                window.location.href = obj.data;
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
                // className={s['adv-booking-card-height']}
                >
                <div
                  className="ant-card-body"
                  // style={{ paddingLeft: "80px", paddingRight: "80px" }}
                  style = {isDesktop ? { paddingLeft: "80px", paddingRight: "80px",padding:"24px" }:{padding:"12px"}}
                >
                  <p
                    className="title-2x"
                    style={{
                      fontWeight: "500px",
                      fontFamily: "Heebo",
                      color: "#333",
                    }}
                  >
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
                            <td
                              colSpan={2}
                              style={{
                                fontFamily: "Heebo",
                                color: "#333",
                                fontWeight: "400",
                                fontSize: "14px",
                              }}
                            >
                              {moment(data.startDate).format("MMM")}&nbsp;
                              {moment(data.startDate).format("DD")}, &nbsp;
                              {moment(data.startDate).format("YYYY")} -{" "}
                              {moment(data.endDate).format("MMM")} &nbsp;
                              {moment(data.endDate).format("DD")}, &nbsp;
                              {moment(data.endDate).format("YYYY")}
                            </td>
                          ) : (
                            <td
                              colSpan={2}
                              style={{
                                fontFamily: "Heebo",
                                color: "#333",
                                fontWeight: "400",
                                fontSize: "14px",
                              }}
                            >
                              {moment(data.dateRange[0]).format("MMM")} &nbsp;
                              {moment(data.dateRange[0]).format("DD")}, &nbsp;
                              {moment(data.dateRange[0]).format("YYYY")} -{" "}
                              {moment(data.dateRange[1]).format("MMM")} &nbsp;
                              {moment(data.dateRange[1]).format("DD")}, &nbsp;
                              {moment(data.dateRange[1]).format("YYYY")}
                            </td>
                          )}
                        </tr>
                        <tr>
                          <td>{icon.clockOne}</td>
                          <td
                            colSpan={2}
                            style={{
                              fontFamily: "Heebo",
                              color: "#333",
                              fontWeight: "400",
                              fontSize: "14px",
                            }}
                          >
                            {days} days
                          </td>
                        </tr>
                        <tr>
                          <td>{icon.person}</td>
                          <td
                            style={{
                              fontFamily: "Heebo",
                              color: "#333",
                              fontWeight: "400",
                              fontSize: "14px",
                            }}
                          >
                            {totalGuest} Guest X ৳ {pricePerGuest}
                          </td>
                          <td
                            style={{
                              fontFamily: "Heebo",
                              color: "#333",
                              fontWeight: "400",
                              fontSize: "14px",
                            }}
                          >
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
                          <th
                            style={{
                              fontFamily: "Heebo",
                              color: "#333",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            Total
                          </th>
                          <th style={{ color: "#ff6304" }}>৳ {totalAmount}</th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </Col>
            <Col md={24}>
              <p
                className="text-center"
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
                <a
                  href="https://hurraayy.com/terms"
                  style={{ color: "#ff6204" }}
                >
                  terms & conditions, refund policy
                </a>{" "}
                and{" "}
                <a
                  href="https://hurraayy.com/terms"
                  style={{ color: "#ff6204" }}
                >
                  privacy policy
                </a>
                .
              </p>
            </Col>
            <Col md={24} className="text-center">
              <Button
                type="primary"
                onClick={() => handleBooking()}
                // id="sslczPayBtn"
                // order={() => getOrder()
                // onClick={() => setAlert(true)}
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
          <Card 
          style={isDesktop? cardStyle : secondcardStyle_mobile}
          // className={s['adv-booking-card-height']}
          >
            <div
              className="section mb-4"
              style={{ position: "relative", marginTop: "25px" }}
            >
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
            Hi, your booking has been successful. Thank you for using Hurraayy.{" "}
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
            style={{
              margin: "0 auto",
              display: "block",
              marginBottom: "20px",
            }}
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
            But we need some more information about you. Please update your
            account information. Like, phone number, e-mail address, home
            address etc.{" "}
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
        <Modal
          title={null}
          closable={false}
          onCancel={closeOwnPaymentModal}
          visible={ownPayment}
          footer={null}
          width="650px"
        >
          <b>
            {/* Hi {userData["name"]}, your booking is on the way.{" "} */}
            Hi, your booking is on the way.{" "}
          </b>
          <br />
          <br />
          <iframe
            src={sessionData.GatewayPageURL+ "?full=1"}
            title="Hurraayy Payment"
            width="600px"
            height="700px"
          ></iframe>
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
