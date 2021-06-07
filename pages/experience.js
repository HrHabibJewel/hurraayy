import React from "react";
import { connect } from "react-redux";
import App from "../layouts/App";
import ExperiencePage from "../components/experiencePage";

class PageAdventure extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <App>
        <ExperiencePage />
      </App>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(PageAdventure);
