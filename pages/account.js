import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import Layout from "../layouts/Account";
import AccountHome from "../components/account";
import HeroSection from "../components/homepage/hero-section";
class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }
  componentDidMount() {
    let token = localStorage.getItem("token");
    // console.log("token", token);
    if (token === null) {
      this.setState({
        redirect: "NotLogIn",
      });
    }
  }
  render() {
    if (this.state.redirect) {
      return (
        <App>
          <HeroSection />
        </App>
      );
    }
    return (
      <App>
        <div style={{ backgroundColor: "rgb(243, 243, 243)", paddingBottom: "20px",paddingLeft:"20px",paddingRight:"40px"}}>
          <AccountHome />
        </div>
      </App>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(Account);
