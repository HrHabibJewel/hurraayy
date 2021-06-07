import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import Accommodation from "../components/accommodationPage/accommodation";

class PageAdventure extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <App>
        <Accommodation />
      </App>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(PageAdventure);
