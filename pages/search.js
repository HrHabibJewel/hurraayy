import React from "react";

import { connect } from "react-redux";

import App from "../layouts/App";

import Accommodation from "../components/homepage/accommodation";
import { Pagination } from "antd";

class PageIndex extends React.Component {
  componentDidMount() {
    // this.props.dispatch(startClock());
  }

  render() {
    return (
      <App>
        <Accommodation />
        <div className="text-center">
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </App>
    );
  }
}

export default connect()(PageIndex);
