import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";

import HeroSection from "../components/homepage/hero-section";
import Adventure from "../components/homepage/adventure";
import HeroBanner from "../components/homepage/banner";
import Accommodation from "../components/homepage/accommodation";
import Experience from "../components/homepage/experience";

class PageIndex extends React.Component {
  // static async getInitialProps({ ctx: { store } }) {
  //   store.dispatch(countIncrease());
  //   if (!store.getState().placeholder.data) {
  //     store.dispatch(loadData());
  //   }
  // }

  componentDidMount() {}

  render() {
    return (
      <App>
        <HeroSection />
        <Adventure />
        <HeroBanner />
        <Accommodation />
        <Experience />
      </App>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(PageIndex);
