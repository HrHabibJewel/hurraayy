import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import AventurePage from "../components/adventurePage";

class PageAdventure extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <App>
        <AventurePage />
      </App>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(PageAdventure);
