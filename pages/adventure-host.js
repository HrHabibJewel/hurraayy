import React from "react";
import {
  connect
} from "react-redux";
import Router from "next/router";
import Layout from "../layouts/AdventureListing";

const isServer = typeof window === "undefined";

// components

//import PlaceSetting from "../components/become-a-host/place-setting";
import City from "../components/adventure-host/city";
import IdeaTheme from "../components/adventure-host/idea-theme";
import Language from "../components/adventure-host/language";
import Skill from "../components/adventure-host/skills";
import AboutYou from "../components/adventure-host/about-you";
import WellDo from "../components/adventure-host/Will-do";
import WellBe from "../components/adventure-host/Will-be";
import WillProvide from "../components/adventure-host/Will-provide";
import GuestBring from "../components/adventure-host/Guest-bring";
import Title from "../components/adventure-host/Title";
import Photos from "../components/adventure-host/Photos";

import MeetingLocation from "../components/adventure-host/meeting-location";
import Notes from "../components/adventure-host/notes";
import GuestRecquirements from "../components/adventure-host/guest-recquirements";
import GroupSize from "../components/adventure-host/group-size";
import Duration from "../components/adventure-host/duration";
import Price from "../components/adventure-host/price";
import BookingSettings from "../components/adventure-host/booking-settings";

import Review from "../components/adventure-host/review";
import {getAuthentication} from "../lib/utils/utility";

// components

class PageExperience extends React.Component {
  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      if(!getAuthentication()) {
        Router.push('/')
      }
      const { step, page } = isServer ? {} : Router.query;
      if(step == undefined || page == undefined) {
        Router.push('/')
      }
      this.setState({ step, page });
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      page: 1,
    };
    this.continue = this.continue.bind(this);
  }

  continue(obj) {
    const { page, step, data } = obj;

    this.setState({ page, step, data, loading: true });
    Router.push(`/adventure-host?step=${step}&page=${page}`, undefined, {
      shallow: true,
    });
  }
  render() {
    const { step, page, loading } = this.state;
    return (
      <Layout
        step={step || 1}
        page={page || 1}
        style={page == 9 && step == 3 ? { maxWidth: 950 } : null}
      >
        {page == 1 && step == 1 && <City continue={this.continue} />}
        {page == 2 && step == 1 && <IdeaTheme continue={this.continue} />}

        {page == 1 && step == 2 && <Language continue={this.continue} />}
        {page == 2 && step == 2 && <Skill continue={this.continue} />}

        {page == 1 && step == 3 && <AboutYou continue={this.continue} />}
        {page == 2 && step == 3 && <WellDo continue={this.continue} />}
        {page == 3 && step == 3 && <WellBe continue={this.continue} />}
        {page == 4 && step == 3 && <WillProvide continue={this.continue} />}
        {page == 5 && step == 3 && <GuestBring continue={this.continue} />}
        {page == 6 && step == 3 && <Title continue={this.continue} />}
        {page == 7 && step == 3 && <Photos continue={this.continue} />}

        {page == 1 && step == 4 && <MeetingLocation continue={this.continue} />}
        {page == 2 && step == 4 && <Notes continue={this.continue} />}
        {page == 3 && step == 4 && (
          <GuestRecquirements continue={this.continue} />
        )}
        {page == 4 && step == 4 && <GroupSize continue={this.continue} />}
        {page == 5 && step == 4 && <Duration continue={this.continue} />}
        {page == 6 && step == 4 && <Price continue={this.continue} />}
        {page == 7 && step == 4 && <BookingSettings continue={this.continue} />}

        {page == 1 && step == 5 && <Review continue={this.continue} />}
      </Layout>
    );
  }
}

const mapState = (state) => {
  return { userInfo: state.auth };
};

export default connect(mapState)(PageExperience);
