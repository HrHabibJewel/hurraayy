import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import {
  Row,
  Col,
  Form,
  Button,
  Input,
  Steps,
  message,
  Card,
  Select,
  Icon,
  Modal, Spin
} from "antd";
import App from "../layouts/Payments";
import { getAdvFormEditData } from "../lib/utils/utility";
import moment from "moment";
import s from "../components/adventureDetailsPage/details-sections/style.module.css";
import { $axios } from "../lib/http-service";
import BookingCalc from "./../components/booking/calculation/index";
import GuestCalc from "./../components/booking/guest/index";
import { getAuthentication } from "../lib/utils/utility";
import * as icon from "./../components/icons";
import payment from "../lib/payment";
const cardStyle = {};

const { Step } = Steps;
const { Option } = Select;

const steps = [
  {
    title: "Review details",
    content: "Review house rules",
  },
  {
    title: "Confirm and Pay",
    content: "Second-content",
  },
];

class PlaceSetting extends React.Component {
  state = {
    current: 0,
    params: {
      amountPaid: 0,
      bookingDate: 0,
      cancelDate: 0,
      checkInDate: "",
      checkOutDate: "",
      effectivePaid: 0,
      feesForClearing: 10,
      feesForService: 0,
      feesForStay: 0,
      feesTotal: 0,
      guest_currency_id: 0,
      numberOfAdults: 0,
      numberOfChildren: 0,
      numberOfGuestsCount: 0,
      numberOfInfants: 0,
      property_id: 0,
      refund: true,
      refundPaid: 0,
      workTrip: true,
    },
    houseRules: [],
    location: "",
    name: "",
    price: "",
    currencyName: "",
    symbol: "",
    accommodatesCount: 1,
    guestInfo: "",
    userName: "",
    visible: false,
    loading: false,
    visiblePayment: false,
  };
  componentDidMount() {
    if (!getAuthentication()) {
      Router.push("/");
    }
    this.setQueryData().then(() => {
      this.getEditData();
    });
  }
  async setQueryData() {
    // console.log("query", Router['query'])
    if (Router["query"]) {
      let query = Router["query"];
      if (query["id"]) {
        var stateCopy = Object.assign({}, this.state);
        stateCopy.params["property_id"] = query["id"];
        this.setState(stateCopy);
      }
      if (query["numberOfGuestsCount"]) {
        var stateCopy = Object.assign({}, this.state);
        stateCopy.params["numberOfGuestsCount"] = parseInt(
          query["numberOfGuestsCount"]
        );
        this.setState(stateCopy);
      }
      if (query["dateRange"]) {
        let dateRangeArr = query["dateRange"];
        var stateCopy = Object.assign({}, this.state);
        stateCopy.params["checkInDate"] = dateRangeArr[0];
        stateCopy.params["checkOutDate"] = dateRangeArr[1];
        this.setState(stateCopy);
      }
      if (query["guestInfo"]) {
        let guestInfo = JSON.parse(query["guestInfo"]);
        var stateCopy = Object.assign({}, this.state);
        stateCopy.params["numberOfAdults"] = guestInfo["adults"];
        stateCopy.params["numberOfChildren"] = guestInfo["children"];
        stateCopy.params["numberOfInfants"] = guestInfo["infants"];
        stateCopy.guestInfo = query["guestInfo"];
        this.setState(stateCopy);
      }
    }
  }
  getEditData() {
    let id = this.state.params.property_id;
    getAdvFormEditData(id).then((resp) => {
      if (resp) {
        if (resp["houseRules"] && resp["houseRules"]["propertyHouseRuleList"]) {
          let propertyHouseRuleList =
            resp["houseRules"]["propertyHouseRuleList"];
          this.setState({
            houseRules: propertyHouseRuleList,
          });
        }
        /*  location  */
        let city = "";
        let country = "";
        if (resp["city"] && resp["city"]["name"]) {
          city = resp["city"]["name"];
          if (resp["city"]["state"] && resp["city"]["state"]["country"]) {
            country = resp["city"]["state"]["country"]["name"]
              ? resp["city"]["state"]["country"]["name"]
              : "";
          }
        }
        let location = city + (country ? ", " + country : "");
        this.setState({ location: location });
        /* name */
        if (resp["name"]) {
          this.setState({ name: resp["name"] });
        }
        /* price */
        let price = 0;
        if (resp["price"]) {
          price = resp["price"];
        }
        this.setState({ price: price });
        this.setFeesForStay();

        /* currency */
        if (resp["currency"]) {
          if (resp["currency"]["name"]) {
            this.setState({ currencyName: resp["currency"]["name"] });
          }
          if (resp["currency"]["symbol"]) {
            this.setState({ symbol: resp["currency"]["symbol"] });
          }
          if (resp["currency"]["id"]) {
            this.set_guest_currency_id(resp["currency"]["id"]);
          }
        }
        if (resp["user"]) {
          let fullName =
            resp["user"]["firstName"] + " " + resp["user"]["lastName"];
          this.setState({
            userName: fullName,
          });
        }
        if (resp["accommodatesCount"]) {
          this.setState({ accommodatesCount: resp["accommodatesCount"] });
        }
        if (resp["cleaningFee"]) {
          var stateCopy = Object.assign({}, this.state);
          stateCopy.params["feesForClearing"] = parseInt(resp["cleaningFee"]);
          this.setState(stateCopy);
        }
      }
    });
  }
  set_guest_currency_id(id = 0) {
    var stateCopy = Object.assign({}, this.state);
    stateCopy.params["guest_currency_id"] = id;
    this.setState(stateCopy);
  }
  setFeesForStay() {
    let feesForStay = 0;
    var stateCopy = Object.assign({}, this.state);
    feesForStay = this.state.price * this.state.params.numberOfGuestsCount;
    stateCopy.params["feesForStay"] = feesForStay;
    this.setState(stateCopy);
    this.setfeesForService();
    this.setFeesTotal();
  }
  setfeesForService() {
    let feesForStay = this.state.params.feesForStay;
    let feesForService = (feesForStay * 10) / 100;
    var stateCopy = Object.assign({}, this.state);
    stateCopy.params["feesForService"] = feesForService;
    this.setState(stateCopy);
  }
  setFeesTotal() {
    let feesTotal = 0;
    var stateCopy = Object.assign({}, this.state);
    const { feesForStay, feesForService, feesForClearing } = this.state.params;
    feesTotal = feesForStay + feesForService + feesForClearing;
    stateCopy.params["feesTotal"] = feesTotal;
    stateCopy.params["amountPaid"] = feesTotal;
    this.setState(stateCopy);
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  onChangeSwitch = (checked) => {
    var stateCopy = Object.assign({}, this.state);
    stateCopy.params["workTrip"] = checked;
    this.setState(stateCopy);
  };
  getGuestCalc = (adults, children, infants) => {
    var stateCopy = this.state.params;
    stateCopy.numberOfAdults = adults;
    stateCopy.numberOfChildren = children;
    stateCopy.numberOfInfants = infants;
    this.setState({ params: stateCopy });
    // var stateCopy = Object.assign({}, this.state);
    // stateCopy.params['numberOfAdults'] = adults;
    // stateCopy.params['numberOfChildren'] = children;
    // stateCopy.params['numberOfInfants'] = infants;
    // this.setState(stateCopy);
  };
  closePaymentModal() {
    // setVisiblePayment(false);
    _this.setState({
      visiblePayment: false,
    });
  }
  handleSubmit() {
    let params = {};
    let _this = this;
    _this.setState({
      loading: true,
    });
    params = this.state.params;
    // console.log("params", params)
    $axios.post("bookings", JSON.stringify(params)).then(function (resp) {
      //console.log("resp", resp);
      if (resp && resp.status == 201) {
        //Router.push({ pathname: "/" });
        // _this.setState({ visible: true })
        let callingObj = {
          bookingCode: resp.data.bookingCode,
          bookingType: "ACCOMMODATION",
          paidAmount: resp.data.feesTotal,
        };
        $axios
          .post("payment", JSON.stringify(callingObj))
          .then(function (paymentResp) {
            if (paymentResp && paymentResp.status == 200) {
              let obj = {};
              // obj = JSON.parse(paymentResp.data.body);
              obj = paymentResp.data;
              // window.location.href = obj.redirectGatewayURL;
              window.location.href = obj.data;
              // payment.OpenModal(obj.GatewayPageURL, obj.storeLogo);
              // payment.OpenModal(obj.redirectGatewayURL, obj.storeLogo);
              _this.setState({
                loading: false,
              });
              //console.log("pay", obj);
            } else {
              _this.setState({
                loading: false,
                visiblePayment: true,
              });
            }
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      userName,
      current,
      guestInfo,
      houseRules,
      location,
      name,
      price,
      symbol,
      currencyName,
      accommodatesCount,
    } = this.state;
    const {
      checkInDate,
      numberOfAdults,
      checkOutDate,
      numberOfGuestsCount,
      feesForStay,
      feesForService,
      feesForClearing,
      feesTotal,
    } = this.state.params;
    let conentPage;
    //console.log("page===", this.state.params);
    // if (current == 0) {
    //     conentPage =
    //         (<div>
    //             <div className="house-rules-review">
    //                 <h2>Please review dates & house policies</h2>
    //                 <div className="things-to-remember">
    //                     <h4>Dates</h4>
    //                     <Row>
    //                         <Col md={{ span: 8 }}>
    //                             <div className="month">{moment(checkInDate).format('MMM')} <br />{moment(checkInDate).format('DD')}</div>
    //                             <span className="checkout">{moment(checkInDate).format('dddd')} Check-in <br />After 12:00 PM</span>
    //                         </Col>
    //                         <Col md={{ span: 8 }}>
    //                             <div className="month">{moment(checkOutDate).format('MMM')} <br />{moment(checkOutDate).format('DD')}</div>
    //                             <span className="checkout">{moment(checkOutDate).format('dddd')} Check-in <br />After 12:00 PM</span>
    //                         </Col>
    //                     </Row>
    //                 </div>
    //                 <div className="details">
    //                     <h4>House policies</h4>
    //                     <div className="house-rules">
    //                         {houseRules.length > 0 &&
    //                             houseRules.map((item, key) => {
    //                                 if (item['applicable']) {
    //                                     return (<span key={key}><Icon type="caret-right" />&nbsp;{item['houseRule']['name']}</span>)
    //                                 }
    //                             })}
    //                     </div>
    //                     <p>Velit eiusmod ullamco labore laborum. Consequat elit officia exercitation voluptate officia laborum culpa laborum. Sit ea cupidatat esse consequat veniam incididunt excepteur mollit eiusmod proident laborum. Fugiat magna in nostrud pariatur exercitation minim esse reprehenderit voluptate. </p>
    //                     <a>Show more</a>
    //                 </div>
    //             </div>
    //             <div className="who-comming">
    //                 <h2>Guest details</h2>
    //                 <Row className="wc-form" gutter={[16, 20]}>
    //                     <Col span={20}>
    //                         <h4>Number of guests</h4>
    //                         <GuestCalc data={{
    //                             accommodatesCount: accommodatesCount,
    //                             guestInfo: guestInfo
    //                         }}
    //                             getGuestCalc={this.getGuestCalc} />
    //                     </Col>
    //                     <Col span={20}>
    //                         <span>Travelling for work?</span>&nbsp;&nbsp;&nbsp;
    //                         <Switch defaultChecked onChange={this.onChangeSwitch} />
    //                     </Col>
    //                     <Col span={15}>
    //                         <h3>Introduce yourself to the host</h3>
    //                         <p>Please share information about you, number of guests etc</p>
    //                     </Col>
    //                     <Col span={5}>
    //                         <img src="./images/host.png" />
    //                     </Col>
    //                     <Col span={20}>
    //                         <Input.TextArea
    //                             rows={4}
    //                             placeholder="Say hello to your host!" />
    //                     </Col>
    //                 </Row>
    //             </div>
    //         </div>
    //         );
    // } else if (current == 1) {
    //     conentPage = (<div>ssssssss</div>);
    // }
    // else if(current == 2) {
    //     conentPage = (<div>ddddddd2</div>);
    // }
    const cardTitle = (
      <div className="pl-3 pb-4 pt-2">
        <span className="normal-text">
          <Icon type="environment" />
          &nbsp;{location}
        </span>
        <h3 className="title-text">{name}</h3>
        {/* <p><Icon type="star" theme="filled" />&nbsp;500 (0)</p> */}
      </div>
    );
    return (
      <App>
        <Spin spinning={this.state.loading} tip="Loading...">
          <Row className="pt-1">
            <Col md={24}>
              <Link href="/">
                <a>
                  <img
                    style={{ width: 38 }}
                    src="../images/logo.png"
                  />
                </a>
              </Link>
            </Col>
          </Row>
          <Form onSubmit={this.handleSubmit}>
            <div className="row">
              {/* <Col md={{ span: 16 }}>
                            <div>
                                {/* <Steps current={current}>
                                    {steps.map(item => (
                                        <Step key={item.title} title={item.title} />
                                    ))}
                                </Steps> 
                                 <div className="steps-content">{conentPage}</div> 
                                <div className="steps-action">
                                    {current < steps.length - 1 && (
                                        // <Button type="primary" onClick={() => this.next()}>
                                        <Button type="primary" onClick={() => this.handleSubmit()}>
                                            Continue
                                        </Button>
                                    )}
                                    {current === steps.length - 1 && (
                                        // <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                        <Button type="primary" onClick={() => this.handleSubmit()}>
                                            Done
                                        </Button>
                                    )}
                                    {current > 0 && (
                                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                            Previous
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Col> */}
              <div className="col-md-8">
                <Card className="payment-card" style={cardStyle} title={null}>
                  <div className="pt-3 pr-5 pl-5"></div>

                  <div className={s["payment-card-properties"]}>
                    <div className="date-guest">
                      {cardTitle}
                      <ul class="list-unstyled">
                        <li className="normal-text">
                          {icon.calender_sm}&nbsp;
                        {moment(checkInDate).format("DD-MM-YYYY")}&nbsp;
                        <Icon type="arrow-right" />
                        &nbsp;{moment(checkOutDate).format("DD-MM-YYYY")}
                        </li>
                        <li className="normal-text">
                          {icon.user_fill_sm}&nbsp;{numberOfAdults} Guest
                      </li>
                      </ul>
                    </div>
                    <BookingCalc
                      data={{
                        currencyName: currencyName,
                        symbol: symbol,
                        price: price,
                        numberOfGuestsCount: numberOfGuestsCount,
                        feesForClearing: feesForClearing,
                      }}
                    />
                  </div>
                </Card>
                <Row>
                  <Col md={24}>
                    <p className="text-center pt-3">
                      By proceeding you confirm that you agree to our{" "}
                      <a
                        href="/terms"
                      // onClick={() => {
                      //   Router.push({ pathname: "/terms" });
                      // }}
                      >
                        terms & conditions, refund policy
                    </a>{" "}
                    and{" "}
                      <a
                        href="/terms"
                      // onClick={() => {
                      //   Router.push({ pathname: "/terms" });
                      // }}
                      >
                        privacy policy
                    </a>
                    .
                  </p>
                  </Col>
                  <Col md={24} className="text-center">
                    <Button
                      type="primary"
                      onClick={() => this.handleSubmit()}
                      style={{
                        width: "50%",
                        height: "auto",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600"
                      }}
                      className="text-center pt-1 pb-1"
                    >
                      Proceed To Pay
                  </Button>
                  </Col>
                </Row>
              </div>
              <div className="col-md-4">
                <Card className="payment-card" style={cardStyle}>
                  <div
                    className="section mb-4 pl-4 pt-2"
                    style={{ position: "relative" }}
                  >
                    <div className={s["title-head"]}>
                      <span className={s["title-left"]}>&nbsp;</span>
                      <b className={s["title"]}>Why Hurraayy?</b>
                    </div>
                    <div>
                      <ul class="list-unstyled">
                        <li className={s["normal-text"]}>
                          <div className="d-flex flex-row align-content-start">
                            <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                            <div className="pl-1" >Payments are handled by secure platform</div>
                          </div>
                        </li>
                        <li className={s["normal-text"]}>
                          <div className="d-flex flex-row align-content-start">
                            <div className="align-content-start "><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                            <div className="pl-1" >Our hosts are experts in ther domain</div>
                          </div>
                        </li>
                        <li className={s["normal-text"]}>
                          <div className="d-flex flex-row align-content-start">
                            <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                            <div className="pl-1" >Packages are designed to give you excellent experienees</div>
                          </div>
                        </li>
                        <li className={s["normal-text"]}>
                          <div className="d-flex flex-row align-content-start">
                            <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                            <div className="pl-1" >Best price guranteed</div>
                          </div>
                        </li>
                        <li className={s["normal-text"]}>
                          <div className="d-flex flex-row align-content-start">
                            <div className="align-content-start"><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /></div>
                            <div className="pl-1" >24 hours live support</div>
                          </div>
                        </li>
                        {/* <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;Packages are designed to give you excellent experienees</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li>
              <li className={s["normal-text"]}><Icon type="check" style={{ color: '#FF6304', fontSize: '18px' }} /> &nbsp;</li> */}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>

              <Modal
                title={null}
                closable={false}
                visible={this.state.visible}
                footer={null}
              // onOk={Router.push({pathname:"/hosting/listings"})}
              >
                <b>
                  Hi {userName}, your booking has been successful. Thank you for
                using Hurraayy.{" "}
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
                    Router.push({ pathname: "/" });
                  }}
                >
                  Go to Host Panel
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
                onCancel={() => this.closePaymentModal()}
                //   onCancel={closePaymentModal}
                visible={this.state.visiblePayment}
                footer={null}
                width="650px"
              >
                <b>Hi {userName}, your booking is on the way. </b>
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
                    Router.push({ pathname: "/account" });
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
            </div>

            {/* <div className="row">
                        <Button type="primary" onClick={() => this.handleSubmit()}>
                            Continue
                        </Button>
                    </div> */}
          </Form>
        </Spin>
      </App>
    );
  }
}

const WrappedApp = Form.create({ name: "coordinated" })(PlaceSetting);

export default connect()(WrappedApp);
